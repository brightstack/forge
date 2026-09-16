#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client } from "bun";
import { gzipSync } from "node:zlib";

interface PackageManifest {
  version: string;
}

interface CloudflareResponse {
  success: boolean;
  errors?: Array<{ message?: string }>;
}

export const targets = [
  { bun: "bun-darwin-arm64", artifact: "forge-darwin-arm64" },
  { bun: "bun-darwin-x64", artifact: "forge-darwin-x64" },
  { bun: "bun-linux-x64", artifact: "forge-linux-x64" },
  { bun: "bun-linux-arm64", artifact: "forge-linux-arm64" },
] as const;

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const manifest = (await Bun.file(join(appRoot, "package.json")).json()) as PackageManifest;
const publicBaseUrl = "https://get.brightstack.ai";
const releaseDir = join(appRoot, "dist", "release");
const installScript = join(appRoot, "install.sh");
const dryRun = process.argv.includes("--dry-run");
const skipBuild = process.argv.includes("--skip-build");

const versionedPrefix = `forge/releases/${manifest.version}`;
const latestPrefix = "forge/releases/latest";
const artifactNames = ["SHA256SUMS", ...targets.map((target) => `${target.artifact}.gz`)];
const keys = [
  "forge/install.sh",
  ...artifactNames.flatMap((name) => [`${versionedPrefix}/${name}`, `${latestPrefix}/${name}`]),
];

if (dryRun) {
  for (const key of keys) console.log(`${publicBaseUrl}/${key}`);
  process.exit(0);
}

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function run(command: string[], cwd = appRoot): Promise<void> {
  const child = Bun.spawn(command, { cwd, stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`${command.join(" ")} failed with exit code ${exitCode}`);
}

function sha256(bytes: Uint8Array): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(bytes);
  return hasher.digest("hex");
}

async function buildRelease(): Promise<void> {
  rmSync(releaseDir, { recursive: true, force: true });
  mkdirSync(releaseDir, { recursive: true });
  for (const target of targets) {
    const outfile = join(releaseDir, target.artifact);
    await run([
      "bun",
      "build",
      "--compile",
      "--minify",
      `--target=${target.bun}`,
      "./src/cli.ts",
      `--outfile=${outfile}`,
    ]);
    const compressed = gzipSync(readFileSync(outfile), { level: 9 });
    await Bun.write(join(releaseDir, `${target.artifact}.gz`), compressed);
    rmSync(outfile);
  }
  await Bun.write(join(releaseDir, "install.sh"), Bun.file(installScript));
  const sums = targets.map((target) => `${target.artifact}.gz`)
    .map((name) => `${sha256(readFileSync(join(releaseDir, name)))}  ${name}`)
    .join("\n") + "\n";
  await Bun.write(join(releaseDir, "SHA256SUMS"), sums);
}

if (!skipBuild) await buildRelease();

const accessKeyId = requiredEnvironmentVariable("S3_ACCESS_KEY_ID");
const secretAccessKey = requiredEnvironmentVariable("S3_SECRET_ACCESS_KEY");
const endpointValue = requiredEnvironmentVariable("S3_ENDPOINT");
const endpoint = endpointValue.includes("://") ? endpointValue : `https://${endpointValue}`;
const cloudflareApiToken = requiredEnvironmentVariable("CLOUDFLARE_API_TOKEN");
const bucket = process.env.S3_BUCKET ?? "get-brightstack-ai";
const region = process.env.S3_REGION ?? "auto";
const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID ?? "6394803456c748d72284b18c192ee725";
const s3 = new S3Client({ accessKeyId, secretAccessKey, bucket, endpoint, region });

function contentType(key: string): string {
  if (key.endsWith(".sh")) return "text/x-shellscript; charset=utf-8";
  if (key.endsWith(".gz")) return "application/gzip";
  return "text/plain; charset=utf-8";
}

function localPath(key: string): string {
  if (key === "forge/install.sh") return join(releaseDir, "install.sh");
  return join(releaseDir, key.split("/").at(-1)!);
}

for (const key of keys) {
  const path = localPath(key);
  if (!existsSync(path)) throw new Error(`Missing release artifact for ${key}`);
  console.log(`Uploading ${key}`);
  await s3.file(key).write(readFileSync(path), { type: contentType(key) });
  if (!(await s3.exists(key))) throw new Error(`Upload verification failed for ${key}`);
}

const purgeResponse = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cloudflareApiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: ["get.brightstack.ai/forge"] }),
  },
);
const purgeResult = (await purgeResponse.json()) as CloudflareResponse;
if (!purgeResponse.ok || !purgeResult.success) {
  const errors = purgeResult.errors?.map((error) => error.message).filter(Boolean).join(", ");
  throw new Error(`Cloudflare cache purge failed${errors ? `: ${errors}` : ""}`);
}

for (const key of [`forge/install.sh`, `${latestPrefix}/SHA256SUMS`, ...targets.map((target) => `${latestPrefix}/${target.artifact}.gz`)]) {
  const url = `${publicBaseUrl}/${key}`;
  const response = await fetch(url, { method: "HEAD", cache: "no-store" });
  if (!response.ok) throw new Error(`Public download verification failed for ${url}: ${response.status}`);
}

console.log(`Deployed ${publicBaseUrl}/forge/install.sh`);
console.log(`Updated ${publicBaseUrl}/${latestPrefix}/`);
