# A practical manual for using this repository

This repository gives a coding agent reusable engineering procedures: clarify the requirement, plan the change, implement it, prove it works, review it, and prepare delivery. You keep control of the objective and decisions; the agent follows the relevant procedure.

It is useful with an existing .NET/SQL application as well as a new TypeScript application. Adapt examples and commands to the actual project. Some checklists use JavaScript tooling, frontend metrics, and opinionated defaults; those are not evidence of what your project requires.

Repository inspected: `189nethuwa/ai-agent-skills`, starting at commit `1401c8b8030e023baeebb31781a6653fe8e93026`. This guide accompanies the addition of `codebase-rules-extraction`.

## Contents

1. [Understand the pieces](#1-understand-the-pieces)
2. [Install your version](#2-install-your-version)
3. [Give the agent project context](#3-give-the-agent-project-context)
4. [Choose the workflow](#4-choose-the-workflow)
5. [Work on an existing project](#5-work-on-an-existing-project)
6. [Build a new feature](#6-build-a-new-feature)
7. [Continue across sessions and models](#7-continue-across-sessions-and-models)
8. [Use the new codebase skill](#8-use-the-new-codebase-skill)
9. [Check whether the system is helping](#9-check-whether-the-system-is-helping)

## 1. Understand the pieces

Think of a skill as a procedure a colleague would follow. Installing it makes the procedure available; selecting it asks the agent to read and follow it.

| Repository part | Plain meaning | How you use it |
|---|---|---|
| `skills/<name>/SKILL.md` | A task procedure with checkpoints and exit conditions | Ask the agent to use it for the relevant work |
| `skills/using-agent-skills/` | A guide to choosing procedures | Use if your host needs help routing work; avoid always loading it alongside a native router |
| `agents/` | Specialist reviewer personas | Request a code, test, security, or web performance perspective when supported |
| `.claude/commands/` | Claude Code shortcuts to procedures | Invoke commands such as `/spec`, `/plan`, or `/review`; plugins may namespace them |
| `.gemini/commands/`, `commands/` | Other host-specific wrappers | Follow the corresponding setup guide; command availability differs by host |
| `references/` | Shared checklists | Let the selected skill load the relevant checklist when needed |
| `hooks/` | Host-dependent integration helpers | Use only through a supported integration; their presence does not mean every host runs them |
| `evals/`, `scripts/` | Tests for the skill pack itself | Use when contributing skills, rather than as your application's test suite |
| Root `AGENTS.md`, `CLAUDE.md` | Instructions for contributing to this skills repository | Read when editing this repository; write separate instructions for your application |

The original catalog has 25 skills. The new extraction skill brings this version to 26. The four personas are `code-reviewer`, `test-engineer`, `security-auditor`, and `web-performance-auditor`.

The repository supplies procedures and some host-specific orchestration. It does not supply a cross-provider model router, a continuously running supervisor, or automatic coordination of your subscriptions and local models. Those require configuration in the agent host or a separate orchestration system. A persona file also does not launch another agent by itself.

## 2. Install your version

Use **your repository**, `189nethuwa/ai-agent-skills`, when you want your additional skills. Many inherited setup examples mention `addyosmani/agent-skills`; those install the original upstream version.

Keep one clone as the source you update:

```bash
mkdir -p "$HOME/DEV"
git clone https://github.com/189nethuwa/ai-agent-skills.git "$HOME/DEV/ai-agent-skills"
```

The new skill becomes available from `main` after its change is merged. To try the proposed version before merging, check out the branch containing it in that clone.

### Claude Code: load the whole clone

Open a terminal in the application you want to work on, then start:

```bash
claude --plugin-dir "$HOME/DEV/ai-agent-skills"
```

This loads the skill pack, reviewer personas, and Claude-specific wrappers while you work in your application's directory. It also preserves the shared checklists. Do not run the application task from the skills repository by accident.

For a marketplace installation of this version, the proposed change makes the marketplace plugin source point to its own repository root, rather than fetching upstream. The existing marketplace identifier remains `addy-agent-skills`, and the plugin identifier remains `agent-skills`. If you already installed upstream under those identifiers, avoid an ambiguous duplicate; the local `--plugin-dir` route is the clearest way to test your version.

Inspect the available commands in your session. Depending on host and loading mode, a shortcut can be namespaced, such as `/agent-skills:spec`. A portable alternative is to ask in words: "Use the spec-driven-development skill."

### Codex: discover local skills

In your application repository, copy the portable skills and their shared references:

```bash
SKILLS_REPO="$HOME/DEV/ai-agent-skills"
mkdir -p .agents/skills .agents/references
cp -R "$SKILLS_REPO/skills/." .agents/skills/
cp -R "$SKILLS_REPO/references/." .agents/references/
```

Start a new session and ask it to list the available skills. Codex scans `.agents/skills` and supports skill-folder symlinks. A checked-in copy gives the project a stable version; a symlink follows your local clone and is less portable to another machine.

The shared references are deliberate: a skill's `../../references/...` path resolves to `.agents/references/...` in this layout. Copying only a skill without these references can leave required checklist links broken.

The repository also includes a Codex plugin adapter; see [codex-setup.md](codex-setup.md) for that route. Claude's personas and slash-command wrappers are not automatically Codex subagents or commands. Ask for the underlying skill by name.

### OpenCode: discover local skills

In your application repository:

```bash
SKILLS_REPO="$HOME/DEV/ai-agent-skills"
mkdir -p .opencode/skills .opencode/references
cp -R "$SKILLS_REPO/skills/." .opencode/skills/
cp -R "$SKILLS_REPO/references/." .opencode/references/
```

OpenCode discovers these skill folders and loads a selected procedure through its `skill` tool. It can also discover `.agents/skills`, so if you already installed the shared Codex layout, reuse it rather than creating duplicate copies.

This repository currently has no checked-in `.opencode/commands/*.md` lifecycle wrappers. OpenCode supports custom commands, but installing these skills alone does not provide `/spec` or `/build auto`. Ask for the skills by name or create explicit wrappers separately.

### Confirm installation before depending on it

Ask:

> List the skills available from my ai-agent-skills installation. Confirm that codebase-rules-extraction is present, open its SKILL.md, and report where its knowledge templates are located. Do not modify the application.

Seeing the right name and being able to read its resources is a better check than an agent saying it knows a similar technique. If a skill is missing, check the installation path, repository/branch, restart requirements, duplicate skill names, and tool permissions.

## 3. Give the agent project context

Skills explain **how to work**. Your application's instructions explain **what is true here**.

Create or extend the application's own `AGENTS.md`, `CLAUDE.md`, or host-specific instruction file. Keep it short and project-specific. For an unfamiliar application, let the new extraction skill establish the facts first.

Include:

- What the application does and its actual stack/runtime constraints.
- Real build, test, lint and verification commands, with prerequisites.
- Important directories and interfaces.
- Existing accepted architectural decisions and protected change boundaries.
- A pointer to the codebase knowledge and current feature specification/plan.

For example, a .NET Framework application may need Windows, a particular MSBuild version, private assemblies, and Oracle integration services. Document those requirements and blocked verification explicitly. An agent should not substitute `dotnet test` or `npm test` merely because those appear in a generic checklist.

Preserve the application's existing instructions and their scope. Do not copy this repository's root instruction files into another project: they describe contribution to the skills pack itself.

Avoid pasting every skill into your instructions. Skills are meant to load on demand. Native skill selection plus a full always-loaded meta-router can spend context and repeat routing work without helping the task.

## 4. Choose the workflow

You can let the host choose, but explicit selection is helpful while learning the pack.

| Your situation | Start with | Typical next step |
|---|---|---|
| "I have an idea but cannot describe the outcome clearly" | `interview-me`, then `idea-refine` if alternatives are needed | `spec-driven-development` |
| "Understand this existing system and preserve its rules" | `codebase-rules-extraction` | `context-engineering` to load the resulting records |
| "Define a feature before changing code" | `spec-driven-development` | `planning-and-task-breakdown` |
| "Implement this agreed plan" | `incremental-implementation` | `test-driven-development`, relevant UI/API skills, review |
| "Something is broken" | `debugging-and-error-recovery` | A focused regression test, correction, review |
| "Review this branch or PR" | `code-review-and-quality` | Security/test specialists where relevant |
| "The agent keeps forgetting conventions" | `context-engineering` | A focused context refresh |
| "Choose our quality gates" | `constraint-driven-development` | Existing CI checks and definition of done |
| "Simplify working code" | `code-simplification` | Verify preserved behavior |
| "Measure a slowdown" | `performance-optimization` | Relevant profiling and browser verification |
| "Prepare production delivery" | `shipping-and-launch` | Staging, monitoring, rollback and actual deployment authorization |

Use supporting procedures when the task calls for them: `source-driven-development` for official framework documentation, `api-and-interface-design` for contracts, `frontend-ui-engineering` for UI, `security-and-hardening` for security-sensitive changes, `documentation-and-adrs` for decisions, and `observability-and-instrumentation` for runtime evidence. `doubt-driven-development` adds an adversarial check to important assumptions.

`git-workflow-and-versioning`, `ci-cd-and-automation`, and `deprecation-and-migration` cover commits, pipeline changes, and safe retirement. The full [catalog](../README.md#all-26-skills) explains each skill. A small correction does not need every workflow in the catalog.

## 5. Work on an existing project

For a complicated application, establish reusable knowledge before a substantial change:

1. Install the pack and confirm discovery.
2. Use `codebase-rules-extraction` to map the application and document its actual rules.
3. Review its unresolved questions. Answer those that determine intended behavior or authorized change boundaries.
4. Choose one concrete change; load the relevant module records and current code/tests.
5. Add characterization or regression tests where behavior is poorly documented and a change would be risky.
6. Implement a small slice, run the applicable checks, review, and update affected knowledge records.

An initial prompt:

> Use codebase-rules-extraction to analyze this application. Include executable projects, shared libraries, runtime dependency injection, database procedures/triggers, jobs and integrations. Work down through dependencies and synthesize contracts back upward. Save an evidence-backed guide in the project's existing documentation location, or docs/codebase if none exists. Keep implementation unchanged. Ask when evidence cannot establish important intent, and checkpoint coverage and pending work between sessions.

Then a change prompt:

> Read the codebase index, the billing module record and its referenced rules. Check freshness against this checkout. Fix the reported rounding defect using debugging-and-error-recovery and test-driven-development. Preserve the documented reconciliation contract and scoped legacy exceptions. Review the change and update the affected records.

For a tiny bug, a full initial survey can be excessive. Start with a local trace and regression test, and label the knowledge scope accordingly. For sustained agent work on a large legacy system, the broader analysis becomes useful shared infrastructure.

## 6. Build a new feature

Run the lifecycle with a clear output at each stage:

| Stage | What you give the agent | What you should receive |
|---|---|---|
| Define | User outcome, constraints, examples | A specification with acceptance criteria and unanswered questions |
| Plan | Accepted specification and project rules | Ordered small tasks, dependencies and verification for each |
| Build | Accepted plan and the next task | A focused implementation plus relevant tests and recorded checks |
| Review | Current diff, specification and project rules | Findings with severity and concrete evidence |
| Prepare delivery | Verified change and target environment | Delivery/rollback plan and operational checks |

Portable prompts:

> Use spec-driven-development to define this feature: [outcome]. Read the applicable codebase rules first. Write the spec without implementing it.

> Use planning-and-task-breakdown to turn the accepted spec into small verifiable tasks. Record task dependencies and actual project checks.

> Use incremental-implementation and test-driven-development to implement the next task. Report the changed behavior, checks and remaining tasks. Keep the plan current.

> Use code-review-and-quality to review the actual diff against the spec and project rules. Verify the important claims rather than accepting the implementation summary.

Claude's `/build auto` wrapper can plan and work through an approved feature specification with per-task verification and commits. It is a capability of that wrapper, not an autonomous mode inherent in every skill installation. Read its actual instructions and ensure the specification exists before using it.

## 7. Continue across sessions and models

Keep the work in files instead of relying on one long chat. Use the project's established spec/plan conventions; this pack commonly uses `SPEC.md`, `tasks/plan.md`, and `tasks/todo.md`.

Before changing sessions or models, update the accepted scope, task status, changed files, unresolved questions, and verification results. Commit the documents with the relevant change when appropriate. An agent that starts fresh can then continue from the repository.

> Read the codebase index and relevant module records, SPEC.md and tasks/plan.md. Check the working-tree changes and the last verification results. State the next incomplete task and continue using the relevant skills.

Your Claude, Codex, OpenCode and local-model sessions can share these records. They still need a host that exposes skills and tools, and a model capable of following them. The pack does not route work automatically between your providers. Configure model choice and delegation in the host separately, and avoid assuming a written persona creates an independent reviewer.

For independent review, use a fresh session or a supported reviewer agent with the diff, specification and applicable rule records. The repository endorses parallel specialist review followed by synthesis for its `/ship` workflow; it does not require every task to spawn a team.

## 8. Use the new codebase skill

The procedure is `codebase-rules-extraction`. Its job is to discover the rules the existing system follows and the evidence for them.

It starts with a map and an explicit work queue. It follows a real flow from the entry point to the lowest accessible behavior, including SQL, configuration-selected implementations and asynchronous boundaries. It then returns through the callers, recording what each layer relies on. Shared dependencies are summarized once; cyclic dependency groups are analyzed together.

For a .NET/Oracle application, that might mean: controller or scheduled job → application service → interface → DI-selected implementation → repository → package procedure → trigger. Returning upward can reveal that a business invariant belongs to the procedure, while the controller merely supplies inputs. Another job may call the same procedure with different preconditions, creating a scoped exception that an agent must understand.

By default, it produces these records:

| Record | What a future agent learns |
|---|---|
| `docs/codebase/README.md` | Where to start, what was inspected, which records to load |
| `architecture.md` | System boundaries, wiring, dependencies and real flows |
| `rules.md` | Canonical rules with IDs, scope, authority, evidence and exceptions |
| `modules/<module-id>.md` | Contracts, dependencies, consumers, tests and hazards in one area |
| `questions.md` | Conflicting evidence, missing intent and recorded maintainer answers |
| `worklog.md` | Coverage, verification and the exact checkpoint for unfinished analysis |

It labels claims precisely:

- **Confirmed:** explicit accepted policy, or independently evidenced current behavior. Those are kept distinct.
- **Observed:** supported by inspected code, with intended authority or verification still missing.
- **Proposed:** an improvement someone might adopt; not a mandatory rule.
- **Disputed:** evidence disagrees or an important question is unanswered.
- **Superseded:** a retained historical rule linked to its replacement.

This prevents an agent from discovering the same workaround in several places and declaring it mandatory architecture. It also prevents a stale README from overruling a real runtime path without investigation.

The result is a source of truth **for documented knowledge within its verified scope**. Future agents should use it to avoid repeating the full investigation, then inspect the local source/tests they will change. Evidence baselines and refresh instructions keep it useful as the application evolves.

### First analysis

> Use codebase-rules-extraction on the complete accessible first-party application. Build a durable guide for future agents. Document business invariants, interface contracts, architectural boundaries, conventions, operational constraints and explicit change permissions. Keep policies separate from observed behavior. Continue across checkpoints until coverage is accounted for, and clearly report blocked areas.

### Resume a large analysis

> Resume codebase-rules-extraction from docs/codebase/worklog.md. Validate the recorded baseline and current changes, restore the pending dependency traversal, and continue from the next recorded action. Reuse completed summaries whose evidence is still valid.

### Refresh after a change

> Refresh codebase knowledge for the persistence changes since the recorded baseline. Include affected contracts, reverse dependents, configuration wiring and schema behavior. Retain rule IDs and history, and do not advance the full-scope baseline for areas you have not revalidated.

### Work without another full survey

> Use the codebase guide to plan this change. Load only the relevant module records and rules, inspect their current evidence and touched code, and identify any local knowledge that needs refreshing. Do not repeat the full repository survey unless the change's impact cannot be bounded.

## 9. Check whether the system is helping

Look for useful outputs rather than ritual announcements:

- The agent opens the selected procedure and relevant supporting files.
- Specifications describe the requested outcome and actual constraints.
- Plans have verifiable tasks rather than vague phases.
- Implementation uses the project's commands and respects local conventions and exceptions.
- Verification distinguishes passed, failed, blocked and not run.
- Reviews examine the diff and important behavior.
- Codebase rules cite specific evidence and acknowledge conflicts.
- A fresh session can find the next action without reconstructing the chat.

If the agent repeatedly skips these, reduce the task scope, invoke the skill explicitly, check tool permissions and missing references, and verify that your chosen host/model actually supports the workflow. Skills improve the agent's procedure; repository checks, CI and your review provide independent evidence of the result.

## Sources and related reading

- Repository workflows and contribution rules: [README](../README.md), [adoption guide](adoption-guide.md), [skill anatomy](skill-anatomy.md), [contribution guide](../CONTRIBUTING.md), [agent orchestration](agents.md), [evals](../evals/README.md).
- [Official Codex skill documentation](https://learn.chatgpt.com/docs/build-skills): local discovery and progressive loading.
- [Official Claude plugin documentation](https://code.claude.com/docs/en/plugins) and [marketplace sources](https://code.claude.com/docs/en/plugin-marketplaces): local loading and plugin-source resolution.
- [Official OpenCode skill documentation](https://opencode.ai/docs/skills/): discovery locations and the skill tool.

Host guidance checked on 2026-10-06. Local discovery and source layout were checked against the files and official documentation; end-to-end Claude/Codex/OpenCode installation was not run in this environment.
