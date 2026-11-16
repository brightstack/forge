# Target repository harness

The target repository defines what good implementation looks like. Forge supplies
portable delivery and judgment procedure; it does not impose its author's stack,
component style, framework, or package commands.

## Resolve applicable authority progressively

Resolve three locations explicitly: the Forge installation/resources, the target
application checkout, and the selected loop directory. Normally Forge is installed
in the application. An explicit target-harness link or host registration can select
a complete installation elsewhere; arbitrary directory names and non-sibling
locations work without a naming convention. Read that actual entrypoint and keep
the complete pack's relative resources accessible. Inaccessible resources or
missing host discovery remain visible gaps. Do not guess a sibling installation
or create another installation to hide the gap.

Run `forge context` from where you started, without `--repo` and without
changing directory, before reading the harness. Add `--engine <actual-engine>`
when you will dispatch native assignments. Like Git, it targets the nearest
directory at or above the working directory that holds Forge's installation
(`.forge/references/`) or a `forge.yml`, stopping at the Git root. Use the
Target it prints as `--repo` for later forge commands. It applies
the application's `forge.yml` and prints the harness entry, an ordered
`Read now:` list of instruction maps, the rule for maps on owned or inspected
paths, loop storage, model defaults per role, and warnings. Follow that output;
do not interpret `forge.yml` yourself. Treat each warning as a visible gap.

Without `harness.path`, `Read now:` lists every `AGENTS.md` and `CLAUDE.md` from
the Git root (or the filesystem root outside Git) down to the target, outermost
first, with the application's own maps last. Read them all; nearer maps refine
farther ones. For each owned or inspected path below the target, read the maps in
each directory on the way to it, then only the rules, references, canonical
exemplars, and checks that govern the behavior being changed or judged.

With `harness.path`, `Read now:` lists only the curated harness. Read root,
parent, and nested instruction maps, project rules, and `.cursor/` instructions
only when the curated harness routes to them. A host may load the root
`AGENTS.md` or `CLAUDE.md` by itself; under a curated harness those auto-loaded
files do not route Forge work.

Standards follow one convention: `docs/standards/` in each directory from the
Git root down to the target, or only `standards/` inside a curated harness.
`forge context` lists them under `Standards`. Open only the files that govern the
behavior being changed or judged; nearer folders refine farther ones.

A frontend change can route to component composition, state, data access,
accessibility, and testing standards; a backend change can route to different
owners. Retrieve the actual paths and contents rather than assuming conventions
from the framework name.

If `forge context` fails because the `forge` executable is missing or does not
know the command (an older CLI), tell the user to update Forge by running the
installer again from the project. Meanwhile, read the `AGENTS.md` and `CLAUDE.md`
from the Git root down to the target and relevant project rules, including
`.cursor/` instructions when the target routes to them, and report that
configuration was not resolved.

The [authority order](authority.md) still applies. Accepted intent owns the asked
outcome; applicable repository instructions own stack policy and required checks.
A named canonical exemplar or mechanical check inherits only the authority that
routes to it. A nearby sibling implementation is evidence about current practice,
not an independent rule. When the route yields no applicable standard, record
`NOT_FOUND` and its consequence instead of inventing one. A missing required rule
or inaccessible source is a visible gap, not permission to ignore the obligation.

Forge reads optional configuration, including `harness.path`, only from the
target application's root `forge.yml`.
An installation or factory can supply delivery procedure and custom flows through
the selected harness, but its stack policy does not replace the application's
rules, accepted intent, ontology, canonical Specs/knowledge, tests, or QA policy.
`--repo` always identifies the application; another storage repository is only a
record location. Installation selection does not change configuration path bases
or canonical write ownership.

Before entering another subtree, framework boundary, or standards domain,
re-resolve its applicable harness and load newly relevant sources. Paths narrow
initial retrieval; real callers and actual semantics can expand the affected
scope. Do not bulk-load every rule, inspect archived code without scope, or turn
unrelated debt into current requirements.

## Carry real paths into assignments

The accountable owner supplies each delegated professional, Worker, Reviewer, or
Judge with the actual applicable instruction-map paths and the relevant routed
rule, reference, exemplar, and required-check paths or commands. Include accepted
source/revision, exact candidate and owned scope alongside them. Do not send only
"follow the repo standards" or a summary of what the owner remembers.

Include the `forge context` output, the selected installation entrypoint, target
checkout, and exact selected loop path. Apply [native assignment defaults](runtime.md#model-selection) before
dispatch and carry their resolved fields and sources in the existing packet.

The receiving agent reads those actual sources before work or judgment, follows
new relevant links when its trace crosses a boundary, and reports unavailable or
conflicting sources. An owner's summary, a persona, or a generic Forge rubric
cannot override target rules. Use existing handoff/report fields for inspected
authority, selected source, checks, evidence, and gaps to identify what was read
and what it established; no new manifest or report form is required.

## Select a review procedure without replacing app standards

Resolve an explicitly selected skill or rubric from current user instruction,
then applicable target harness, then the bundled default. Integrated Forge Review
owns its dimension selection and waiver procedure; direct leaf review does not
start that broader operation.
Read the actual selected source; a name or remembered description is insufficient.
A missing explicit replacement remains a gap unless fallback is authorized.
A selected review procedure determines how to inspect; it does not replace the
target app's component or engineering standards or waive required proof.

For Code Review, the Reviewer or delegated Code Review Judge reads and follows the
actual selected leaf and relevant target standards. Record the selected source and
actual applicable app standards/evidence in existing report fields. Neither a
rubric link nor a copied skill folder establishes that this work ran.
