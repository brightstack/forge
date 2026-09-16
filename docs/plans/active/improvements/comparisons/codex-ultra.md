# Forge topology compared with Codex Ultra and OpenAI multi-agent behavior

**Evidence labeling:** Section 1 reports documented behavior. Sections 2–5 are
comparative inferences and recommendations derived from those facts and the pinned
Forge proposal. Section 6 states the boundary of that evidence.

## 1. What the compared system actually does

OpenAI documents Ultra as an execution mode, not an SDLC. In the Codex model selector it is described as “maximum reasoning with automatic task delegation”; the model guide says Ultra uses subagents for separate parts of a complex task in parallel and that most tasks do not need Max or Ultra. Codex/ChatGPT subagent workflows spawn specialized agents, expose their activity as separate threads, wait for requested results, and consolidate those results in the main thread’s response. Each subagent performs its own model and tool work, so delegation increases token use. [Models](https://learn.chatgpt.com/docs/models) · [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)

Current local Codex releases enable multi-agent tools by default. Codex delegates after a direct request or an applicable `AGENTS.md`/skill instruction; the same documentation separately says Ultra can proactively delegate when parallel work would materially improve speed or quality. Local custom agents can define a name, description, developer instructions, model, reasoning effort, sandbox, MCP servers, and skills. Defaults inherit from the parent unless overridden. OpenAI recommends narrow, opinionated custom agents with a clear job and matching tool surface. [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

The Responses API multi-agent beta is the clearest public description of an adjacent OpenAI-hosted pattern, but it is only described as *similar to* Codex Ultra. A root model dynamically creates a tree of bounded subagents, can message, resume, wait for, interrupt, and inspect them, and owns synthesis of the final response. Subagents have separate contexts; all use the request’s model and tools. The API has no fixed total-agent or tree-depth limit, while concurrency defaults to three and can be capped. OpenAI explicitly prefers multi-agent execution for independent bounded work and one agent for ordered chains, small tasks, shared mutable resources, or fixed deterministic graphs. [Multi-agent API guide](https://developers.openai.com/api/docs/guides/responses-multi-agent) · [GPT-5.6 guidance](https://developers.openai.com/api/docs/guides/latest-model)

## 2. Strong matches with Forge

- **Dynamic inner topology with accountable synthesis.** Forge’s Phase Lead chooses outcome-sized work at runtime and integrates one phase candidate. This matches Codex’s model-directed spawning, follow-up, waiting, and one main-thread synthesis. OpenAI likewise treats bounded independence—not a predeclared staffing graph—as the reason to delegate.
- **Focused context, lean returns.** Forge keeps Worker/Judge coordination ephemeral and preserves integrated artifacts instead of transcripts. OpenAI says subagents reduce main-thread context pollution by returning distilled summaries rather than raw exploration, logs, and traces.
- **Outcome-sized delegation.** OpenAI recommends specific, bounded tasks and gives implementation of independent components or test suites as appropriate examples. That supports Forge Workers owning coherent outcomes rather than receiving disguised edit commands.
- **One review lead over focused judges.** OpenAI’s canonical API example asks three agents to review correctness, security, and missing tests, then reconcile duplicate or conflicting findings into one prioritized review. This is a close behavioral match to Forge’s Reviewer/Judges split and single verdict.
- **Role/tool/model configuration.** Codex custom agents support distinct instructions, models, effort, sandbox, tools, and skills. Forge’s role directories and semantic model tiers can compile cleanly onto those host controls while remaining provider-neutral.
- **Ephemeral isolation.** Codex-managed worktrees are lightweight, disposable environments for parallel chats. This supports Forge treating worktrees as runtime isolation rather than durable delivery artifacts, although the docs do not say Ultra automatically allocates a worktree per subagent. [Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)

## 3. Material differences or contradictions

- **Ultra has no documented lifecycle or authority model.** Official material does not define Intake, Spec, Plan, Build, Verify, Simplify, Ship; acceptance-criteria ownership; authority gaps; canonical vocabulary; Issue graphs; or PR-only Ship. Forge supplies a deterministic outer contract around a nondeterministic inner scheduler.
- **Synthesis is not an independent gate.** Codex documents the main thread collecting subagent work into a final response. It does not document a frozen candidate handed to a separately accountable Review Lead, evidence reconciliation against every explicit obligation, or one continued candidate returned to the same Reviewer. Forge’s independence and candidate boundary are additional controls, not Codex behavior.
- **OpenAI’s hosted tree is more permissive.** The API allows arbitrary depth and any agent to use configured tools. Forge intentionally limits meaningful spawning to Builders→Workers and Reviewers→read-only Judges. That restriction is compatible with Codex configuration, but it is not inherited automatically from the generic multi-agent system.
- **Write parallelism carries an explicit warning.** OpenAI recommends starting with read-heavy parallel work and being careful with simultaneous code edits because of conflicts and coordination overhead. Forge permits parallel implementation when contracts are stable. This is defensible, but only if its Builder truly owns shared contracts, overlap, sequencing, and integration.
- **Rich personas exceed documented guidance.** OpenAI’s custom-agent guidance favors narrow, opinionated roles; it does not support a claim that BMAD-like identity/personality matrices improve performance. Forge already mitigates this by keeping Workers and Judges lean, but the value of expanded core-persona prompts remains an evaluation question.
- **Semantic “deep” should not silently mean Ultra.** OpenAI says to use the lowest effort that meets the quality bar and that most tasks need neither Max nor Ultra. Ultra also changes topology by enabling automatic delegation; it is not merely a stronger reasoning setting.

## 4. Failure modes Forge should avoid copying

1. **Delegation by availability.** Ultra can delegate proactively, but Forge should still require concrete independent work and a material speed/quality gain. Otherwise token cost and reconciliation work rise without better outcomes.
2. **Parallel writes into one mutable checkout.** Shared files, schemas, generated artifacts, or migrations can turn speedup into conflicts and incoherent proof. One writer for hot seams, explicit interface ownership, or earned worktree isolation is safer.
3. **Tool/permission overexposure.** API subagents share the request’s tools; Codex subagents inherit parent sandbox/permission state unless narrowed. Read-only Judges and least-tool Workers should be mechanical configuration, not prose alone.
4. **Recursive agent sprawl.** The API imposes no total-agent or depth limit. Forge should retain its small role topology and concurrency budget; nested delegation is not evidence of useful decomposition.
5. **Summary-as-proof.** Codex consolidates results, but a concise subagent return can omit contradictory evidence. The Forge lead must inspect changed state and cumulative proof rather than treating Worker/Judge prose as an attestation.
6. **Encoding beta internals into durable artifacts.** The Responses multi-agent schemas may change, and custom-agent authoring is described as evolving. Forge should bind to semantic capabilities, not current event shapes, thread paths, or provider-specific manifests.

## 5. Concrete recommendations

- **Adopt:** Dynamic bounded delegation, focused subagent context, explicit concurrency caps, follow-up/interrupt/wait controls, and one accountable synthesizer per phase.
- **Adopt:** The Reviewer→read-only Judges→one reconciled verdict pattern; it closely matches OpenAI’s documented multi-agent review example while Forge adds the necessary independence and authority checks.
- **Adapt:** Permit parallel implementation only after the Builder marks tasks dependency-ready and assigns shared-contract/file ownership. Default to read-heavy parallelism; use isolated worktrees only when write conflicts or environment contention justify them.
- **Adapt:** Map `mechanical | standard | deep` by behavioral evaluation. Treat Ultra as a distinct “maximum reasoning plus proactive delegation” host capability, not the automatic implementation of `deep` and not a floor for every formal role.
- **Adapt:** Implement core personas as narrow professional decision postures first. Retain personality-matrix material only when Forge-vs-control evals show better decisions without instruction conflict or prompt bloat.
- **Reject:** Arbitrary recursive spawning, per-contributor reviews, shared-write free-for-alls, durable subagent transcripts, and reliance on subagent summaries as candidate identity or proof.
- **Evaluate:** A representative Forge-vs-single-agent-vs-Ultra suite measuring obligation coverage, defect escape, integration conflicts, wall time, total tokens/cost, and unnecessary agents. OpenAI explicitly recommends representative evaluations rather than assuming higher effort is better.

## 6. Source and evidence limitations

All external claims above use current OpenAI documentation on `learn.chatgpt.com` or `developers.openai.com`. No public source examined exposes Codex Ultra’s private delegation heuristic, exact prompt, scheduling policy, convergence logic, worktree allocation, or hidden agent topology. The API multi-agent guide is beta and says its behavior is *similar to* Ultra; it is evidence of OpenAI’s public multi-agent design, not proof of Codex Ultra internals. The Codex subagent page also distinguishes proactive ChatGPT Ultra delegation from current local Codex delegation triggered by a request or project/skill instructions, while the model page labels CLI Ultra “automatic task delegation.” Therefore the safe conclusion is capability-level alignment, not implementation equivalence.
