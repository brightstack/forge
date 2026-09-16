import { describe, expect, test } from "bun:test";
import {
  OKF_VERSION,
  inspect_okf_document,
  okf_local_links,
  validate_okf_document,
} from "../src/okf.ts";

function concept(frontmatter: string, body = "# Concept\n"): string {
  const lines = frontmatter.split("\n");
  const indentation = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0),
  );
  const yaml = lines.map((line) => line.slice(indentation)).join("\n").trim();
  return `---\n${yaml}\n---\n${body}`;
}

function healthCodes(document: ReturnType<typeof inspect_okf_document>): string[] {
  return document.health.map((finding) => finding.code);
}

describe("OKF document inspection", () => {
  test("accepts a minimal concept with an unknown open type", () => {
    const document = inspect_okf_document(
      "domain/opaque.md",
      concept("type: A type nobody registered"),
    );

    expect(document).toMatchObject({
      kind: "concept",
      type: "A type nobody registered",
      title: "opaque",
      body: "# Concept\n",
      trust_tier: "unverified",
      lifecycle_status: "stable",
      stale: null,
      health: [],
    });
  });

  test("parses YAML block, flow, nested, and anchored values", () => {
    const document = inspect_okf_document(
      "domain/yaml.md",
      concept(`
        type: Domain Concept
        title: YAML surface
        summary: |
          line one
          line two
        labels: [one, two]
        nested:
          owner:
            name: Forge
            aliases: [builder, verifier]
        defaults: &defaults
          mode: compact
          retries: 2
        copied: *defaults
      `),
    );

    expect(document.metadata.summary).toBe("line one\nline two\n");
    expect(document.metadata.labels).toEqual(["one", "two"]);
    expect(document.metadata.nested).toEqual({
      owner: { name: "Forge", aliases: ["builder", "verifier"] },
    });
    expect(document.metadata.defaults).toEqual({ mode: "compact", retries: 2 });
    expect(document.metadata.copied).toEqual({ mode: "compact", retries: 2 });
  });

  test("preserves unknown fields and accepts omitted optional families", () => {
    const document = inspect_okf_document(
      "domain/vendor.md",
      concept(`
        type: Vendor Concept
        vendor_extension:
          nested: true
        arbitrary_scalar: 17
      `),
    );

    expect(document.metadata.vendor_extension).toEqual({ nested: true });
    expect(document.metadata.arbitrary_scalar).toBe(17);
    expect(document.health).toEqual([]);
  });

  test("reports malformed optional families in health without rejecting the concept", () => {
    const content = concept(`
      type: Attested Computation
      generated: []
      verified:
        - actor: missing-by
      sources: { resource: expected-list }
      usage_window:
        from: 2026-09-10T00:00:00Z
      status: archived
      stale_after: tomorrow
      runtime: {}
      parameters: {}
      executor: []
      attester: 3
    `);

    let document: ReturnType<typeof validate_okf_document> | undefined;
    expect(() => {
      document = validate_okf_document("domain/computation.md", content);
    }).not.toThrow();

    expect(document).toBeDefined();
    expect(healthCodes(document!)).toEqual(expect.arrayContaining([
      "invalid-generated",
      "invalid-verified",
      "invalid-sources",
      "invalid-usage-window",
      "unknown-status",
      "invalid-stale-after",
      "missing-runtime",
      "invalid-parameters",
      "invalid-executor",
      "invalid-attester",
    ]));
  });

  test("treats a bare verified mapping by a human actor as human-reviewed", () => {
    const document = inspect_okf_document(
      "domain/verified.md",
      concept(`
        type: Domain Concept
        verified:
          by: human:marcelo
          at: 2026-09-10T00:00:00Z
      `),
    );

    expect(document.trust_tier).toBe("human-reviewed");
    expect(document.metadata.verified).toEqual({
      by: "human:marcelo",
      at: "2026-09-10T00:00:00Z",
    });
    expect(document.health).toEqual([]);
  });

  test("derives stale from the supplied observation clock", () => {
    const content = concept(`
      type: Domain Concept
      stale_after: 2026-09-10T12:00:00Z
    `);

    const before = inspect_okf_document(
      "domain/fresh.md",
      content,
      new Date("2026-09-10T11:59:59Z"),
    );
    const atDeadline = inspect_okf_document(
      "domain/stale.md",
      content,
      new Date("2026-09-10T12:00:00Z"),
    );

    expect(before.stale).toBe(false);
    expect(healthCodes(before)).not.toContain("stale");
    expect(atDeadline.stale).toBe(true);
    expect(healthCodes(atDeadline)).toContain("stale");
  });
});

describe("OKF reserved documents", () => {
  test("accepts a bundle-root index with or without okf_version", () => {
    const withoutVersion = inspect_okf_document(
      "docs/knowledge/index.md",
      "# Knowledge\n",
    );
    const withVersion = inspect_okf_document(
      "docs/knowledge/index.md",
      `---\nokf_version: "${OKF_VERSION}"\n---\n# Knowledge\n`,
    );

    expect(withoutVersion).toMatchObject({ kind: "index", metadata: {}, health: [] });
    expect(withVersion).toMatchObject({
      kind: "index",
      metadata: { okf_version: OKF_VERSION },
      health: [],
    });
  });

  test("rejects frontmatter on nested indexes and reserved root fields", () => {
    expect(() => inspect_okf_document(
      "docs/knowledge/domain/index.md",
      "---\nokf_version: 0.2\n---\n# Domain\n",
    )).toThrow();
    expect(() => inspect_okf_document(
      "docs/knowledge/index.md",
      "---\nokf_version: 0.2\ntitle: forbidden\n---\n# Knowledge\n",
    )).toThrow();
  });

  test("accepts a log without frontmatter when date groups are newest first", () => {
    const document = inspect_okf_document(
      "docs/knowledge/log.md",
      "# Log\n\n## 2026-09-10\n\nnew\n\n## 2026-09-09\n\nold\n",
    );

    expect(document).toMatchObject({ kind: "log", metadata: {}, health: [] });
  });

  test("rejects log frontmatter, invalid calendar dates, and ascending dates", () => {
    expect(() => inspect_okf_document(
      "docs/knowledge/log.md",
      "---\ntitle: forbidden\n---\n# Log\n",
    )).toThrow();
    expect(() => inspect_okf_document(
      "docs/knowledge/log.md",
      "# Log\n\n## 2026-02-30\n\nnot a date\n",
    )).toThrow();
    expect(() => inspect_okf_document(
      "docs/knowledge/log.md",
      "# Log\n\n## 2026-09-09\n\nold\n\n## 2026-09-10\n\nnew\n",
    )).toThrow();
  });
});

test("extracts relative and leading-slash Markdown links while skipping non-local targets", () => {
  expect(okf_local_links(`
    [relative](./domain/concept.md)
    [parent](../shared.md?view=1#details)
    [bundle-relative](/index.md#map)
    ![image](assets/diagram.svg)
    [anchor](#section)
    [web](https://example.test/concept.md)
    [email](mailto:team@example.test)
  `)).toEqual([
    "./domain/concept.md",
    "../shared.md",
    "/index.md",
    "assets/diagram.svg",
  ]);
});
