#!/bin/sh
# Install the Forge CLI, then set up skills in this repository.
# Usage: curl -fsSL https://get.brightstack.ai/forge/install.sh | sh
set -eu

base="${FORGE_BASE_URL:-https://get.brightstack.ai/forge}"
base="${base%/}"
version="${FORGE_VERSION:-latest}"
release="$base/releases/$version"
target="${FORGE_TARGET:-$(pwd)}"
bin_dir="${FORGE_BIN_DIR:-$HOME/.local/bin}"
tools="${FORGE_TOOLS:-agents}"

os=$(uname -s | tr '[:upper:]' '[:lower:]')
arch=$(uname -m)
case "$arch" in
  x86_64|amd64) arch=x64 ;;
  aarch64|arm64) arch=arm64 ;;
  *)
    echo "Unsupported architecture: $arch" >&2
    exit 1
    ;;
esac
case "$os" in
  darwin|linux) ;;
  *)
    echo "Unsupported OS: $os. Install from source: bun install && bun run build:cli" >&2
    exit 1
    ;;
esac

artifact="forge-$os-$arch.gz"
need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}
need curl
need gzip

hash_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | awk '{print $1}'
  else
    openssl dgst -sha256 "$1" | awk '{print $NF}'
  fi
}

work=$(mktemp -d)
cleanup() { rm -rf "$work"; }
trap cleanup EXIT
cd "$work"

curl -fsSL "$release/SHA256SUMS" -o SHA256SUMS
curl -fsSL "$release/$artifact" -o "$artifact"
expected=$(awk -v f="$artifact" '$2 == f { print $1; exit }' SHA256SUMS)
if [ -z "$expected" ]; then
  echo "No checksum for $artifact" >&2
  exit 1
fi
actual=$(hash_file "$artifact")
if [ "$actual" != "$expected" ]; then
  echo "Checksum mismatch for $artifact" >&2
  exit 1
fi

mkdir -p "$bin_dir"
gzip -cd "$artifact" > "$bin_dir/forge"
chmod 755 "$bin_dir/forge"

echo "Installed forge CLI to $bin_dir/forge"
case ":$PATH:" in
  *":$bin_dir:"*) ;;
  *)
    echo "Add $bin_dir to PATH:"
    echo "  export PATH=\"$bin_dir:\$PATH\""
    ;;
esac

"$bin_dir/forge" setup --repo "$target" --tools "$tools"
