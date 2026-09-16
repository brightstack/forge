#!/usr/bin/env bun
import { Argument, Command, CommanderError } from "commander";
import { ForgeError } from "./errors.ts";
import { KINDS, append_record, create_document, init_loop, update_document } from "./records.ts";
import { candidate_snapshot, validate_documents } from "./validation.ts";
import { apply_kb, apply_prepared, ask, knowledge_history, record_kb_decision, scaffold_okf, verify_knowledge, verify_prepared } from "./memory.ts";
import { serve_artifacts } from "./serve.ts";
import { parse_setup_tools, setup_project } from "./setup.ts";

function sorted(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, item]) => [key, sorted(item)]));
  }
  return value;
}
function output(value: unknown) { console.log(JSON.stringify(sorted(value))); }
const collect = (value: string, previous: string[]) => [...previous, value];
function repo(command: Command) {
  return command.option("--repo <path>", "Repository containing the managed corpus", ".");
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  try {
    const program = new Command("forge")
      .description("Local file mechanics and artifact previews. Invoke the Forge agent skill for semantic Explore/Spec/Plan/Build/Review/Acceptance/Ship.")
      .enablePositionalOptions()
      .exitOverride()
      .configureOutput({ writeErr: () => {} });
    program.command("serve <directory>").description("Serve an artifact directory on localhost until interrupted")
      .option("--port <number>", "Port to bind; 0 selects an available port", "0")
      .option("--json", "Print one JSON readiness record with root, URL, port and PID")
      .action((directory: string, options: { port: string; json?: boolean }) => {
        if (!/^\d+$/.test(options.port)) throw new ForgeError("port must be an integer from 0 to 65535");
        const { server, root } = serve_artifacts(directory, Number(options.port));
        const stop = () => { void server.stop(true); };
        process.once("SIGINT", stop);
        process.once("SIGTERM", stop);
        const ready = { root, url: server.url.toString(), port: server.port, pid: process.pid };
        if (options.json) output(ready);
        else console.log(`Serving ${root}\n${ready.url}\nPress Ctrl+C to stop.`);
      });
    repo(program.command("setup").description("Install Forge skills into this repository from GitHub or --pack").option("--tools <list>", "Comma-separated hosts: agents, claude, cursor", "agents").option("--pack <path>", "Copy skills from this package directory instead of GitHub"))
      .action((options: { repo: string; tools: string; pack?: string }) => output(setup_project(options.repo, parse_setup_tools(options.tools), options.pack)));
    repo(program.command("init <loop_id>").description("Initialize a loop; this is not approval").requiredOption("--title <title>"))
      .action((id: string, options: { repo: string; title: string }) => output(init_loop(options.repo, id, options.title)));
    const docs = program.command("docs").description("Scaffold and validate identified documents");
    repo(docs.command("create").addArgument(new Argument("<kind>").choices([...KINDS])).argument("<path>").requiredOption("--title <title>").option("--code <code>").option("--body-file <file>"))
      .action((kind: string, path: string, options: { repo: string; title: string; code?: string; bodyFile?: string }) => output(create_document(options.repo, kind, path, options.title, options.code, options.bodyFile)));
    repo(docs.command("update <path>").option("--body-file <file>").option("--set <key=value>", "Set ordinary metadata", collect, []))
      .action((path: string, options: { repo: string; bodyFile?: string; set: string[] }) => {
        const fields: Record<string, unknown> = {};
        for (const assignment of options.set) {
          const separator = assignment.indexOf("=");
          if (separator < 0) throw new ForgeError("--set requires KEY=VALUE");
          const key = assignment.slice(0, separator), value = assignment.slice(separator + 1);
          try { fields[key] = JSON.parse(value); } catch { fields[key] = value; }
        }
        output(update_document(options.repo, path, options.bodyFile, fields));
      });
    repo(docs.command("validate [paths...]"))
      .action((paths: string[], options: { repo: string }) => output(validate_documents(options.repo, paths)));
    repo(docs.command("append <path>").requiredOption("--heading <heading>").requiredOption("--body-file <file>"))
      .action((path: string, options: { repo: string; heading: string; bodyFile: string }) => output(append_record(options.repo, path, options.heading, options.bodyFile)));
    repo(program.command("decision").command("record [loop_decisions_path]").requiredOption("--authorization-file <file>").requiredOption("--body-file <file>").option("--title <title>").option("--supersedes <id>"))
      .action((path: string | undefined, options: { repo: string; authorizationFile: string; bodyFile: string; title?: string; supersedes?: string }) => output(record_kb_decision(options.repo, path, options.authorizationFile, options.bodyFile, { title: options.title, supersedes: options.supersedes })));
    repo(program.command("candidate").description("Fingerprint current candidate including dirty files").option("--path <path>", "Explicit candidate input", collect, []).option("--expect <identity>"))
      .action((options: { repo: string; path: string[]; expect?: string }) => {
        const result = candidate_snapshot(options.repo, options.path);
        if (options.expect && options.expect !== result.candidate) throw new ForgeError("candidate changed; prior Review/Acceptance evidence is stale");
        output(result);
      });
    const memory = program.command("memory").description("Validate or apply prepared canonical files");
    for (const operation of ["verify", "apply"]) {
      repo(memory.command(`${operation} <manifest>`)).action((manifest: string, options: { repo: string }) => output((operation === "verify" ? verify_prepared : apply_prepared)(options.repo, manifest)));
    }
    const kb = program.command("kb").description("Query or maintain canonical local knowledge");
    repo(kb.command("scaffold <path>").requiredOption("--type <type>").requiredOption("--title <title>").requiredOption("--code <code>").option("--body-file <file>"))
      .action((path: string, options: { repo: string; type: string; title: string; code: string; bodyFile?: string }) => output(scaffold_okf(options.repo, path, options.type, options.title, options.code, options.bodyFile)));
    repo(kb.command("ask <query>").option("--scope <kind>", "Knowledge kind", collect, []))
      .action((query: string, options: { repo: string; scope: string[] }) => output(ask(options.repo, query, options.scope.length ? options.scope : undefined)));
    repo(kb.command("verify").option("--scope <kind>", "Knowledge kind", collect, []))
      .action((options: { repo: string; scope: string[] }) => {
        const result = verify_knowledge(options.repo, options.scope.length ? options.scope : undefined);
        output(result);
        if (!result.valid) process.exitCode = 1;
      });
    repo(kb.command("history").description("Read successful canonical memory-operation receipts"))
      .action((options: { repo: string }) => output(knowledge_history(options.repo)));
    for (const operation of ["add", "update", "remove"] as const) {
      repo(kb.command(`${operation} <manifest>`)).action((manifest: string, options: { repo: string }) => output(apply_kb(options.repo, manifest, operation)));
    }
    await program.parseAsync(argv, { from: "user" });
  } catch (error) {
    if (error instanceof CommanderError && error.exitCode === 0) return;
    console.error(`forge: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = error instanceof CommanderError ? 2 : 1;
  }
}

if (import.meta.main) await main();
