# Codebase Knowledge Templates

Adapt these schemas to the project's established layout. Do not fill fields with guesses. Keep one canonical copy of each rule. Paths below are relative to the target project, not the skill pack.

## Contents

- [Index](#index)
- [Architecture](#architecture)
- [Rule registry](#rule-registry)
- [Module record](#module-record)
- [Question ledger](#question-ledger)
- [Worklog and checkpoint](#worklog-and-checkpoint)
- [Instruction-file pointer](#instruction-file-pointer)
- [Change rehearsal](#change-rehearsal)

## Index

```markdown
# Codebase knowledge

Scope: <repositories/deployables/areas included>
Full-scope baseline: <commit, or none while initial analysis is incomplete>
Working baseline: <commit + relevant uncommitted changes>
Analysis date: <date>
Completeness: <complete within scope / partial / blocked, with reasons>

Read architecture.md for the map, rules.md for canonical rule IDs,
modules/<id>.md for the area being changed, and questions.md for unresolved intent.
Use worklog.md to resume an incomplete analysis.

| Area / task | Module record | Applicable rule IDs | Status |
|---|---|---|---|
| <area> | <relative link> | <links to rules> | <coverage> |

Confirmed obligations: <links, scope, and whether policy or current behavior>
High-impact unresolved questions: <links>
Build/test entry points: <links to verified commands and prerequisites>

Before changing code, compare relevant evidence with the checkout and local edits.
Refresh changed modules, their dependencies, reverse dependents, wiring and tests.
Read the actual code/tests being changed. Preserve per-record verification baselines.
```

## Architecture

```markdown
# Architecture

Evidence baseline: <commit + local changes>

| Module ID | Responsibility | Entrypoints | Runtime/configuration variants |
|---|---|---|---|
| <id> | <purpose> | <symbols/jobs/routes> | <conditions> |

| Consumer | Dependency | Edge type / condition | Evidence |
|---|---|---|---|
| <id> | <id or external boundary> | <compile/runtime/data/event> | <path + symbol> |

Cycles: <members, internal edges, shared state, outgoing dependencies>
External/unavailable boundaries: <version, consumed contract, evidence and limitations>

## Flow <id>: <trigger>
<Entry point, runtime implementation, transformations, leaf/data effects,
return path, error handling, authorization, transaction owner, async effects.>
Evidence: <paths/symbols/tests>; variants checked: <list>; unresolved: <question IDs>.
```

## Rule registry

```markdown
# Rules

Statuses: confirmed / observed / proposed / disputed / superseded.
Confirmed policy and confirmed current behavior are distinct claims.
Observed/disputed claims require investigation before a change depends on them.

## R-<stable-id>: <precise statement>

- Kind: <business / contract / architecture / convention / operation / permission>
- Scope: <modules, public boundary, environment and configuration conditions>
- Status: <status>
- Claim type: <intended policy / current behavior / recommendation>
- Authority: <explicit instruction, accepted ADR, implementation, test, clarification>
- Evidence baseline / last verified: <commit + relevant local changes; date>
- Evidence:
  - <relative path :: symbol/config/test> — <what it proves>
  - <independent source> — <what it proves; execution status if applicable>
- Exceptions and counterexamples: <list, or search performed with none found>
- Enforcement / check: <existing command/test/check, or not enforced>
- Affected modules and consumers: <links>
- Change impact: <what must be reviewed, verified, migrated or clarified>
- Open questions / replacement: <question IDs or superseding rule ID>
```

Example: implementation plus an executed assertion can confirm that duplicate events produce one stored row in a local test configuration. It does not prove that production has exactly-once delivery, or that deduplication is a universal architectural policy.

## Module record

```markdown
# M-<stable-id>: <module name>

Paths: <owned paths>; responsibility: <purpose>; owner: <known owner or unknown>.
Last verified: <commit + local changes/date>; coverage: <status and limitations>.

Public inputs/outputs and contracts: <symbols, DTOs, events, errors, preconditions>.
Consumers/reverse dependents: <module links + evidence>.
Dependencies: <module/boundary links + edge types/selection conditions>.
Runtime wiring: <registration/bootstrap/configuration evidence>.
Data/side effects: <state, transactions, schema, SQL, external calls>.
Failure/concurrency semantics: <retries, cancellation, idempotency, ordering>.
Applicable rules: <links to canonical IDs, including exceptions>.
Tests/commands: <exact command, working directory, prerequisites, recorded outcome>.
Hazards and unknowns: <question IDs and change boundaries>.
Leaf-to-caller synthesis: <guarantees relied on by callers and how they propagate>.
```

## Question ledger

```markdown
| ID | Evidence and conflict | Interpretations | Impact / blocks what | Status |
|---|---|---|---|---|
| Q-<id> | <links> | <A/B> | <affected rules/modules, analysis or future change> | unresolved |

## Q-<id>: <focused maintainer question>
Already inspected: <sources>; answer needed: <intent/authority/missing access>.
Answer: <verbatim or faithful summary, author/date/scope, or unanswered>.
Resolution: <rule updates, exceptions, outstanding code/policy mismatch>.
```

## Worklog and checkpoint

```markdown
# Analysis worklog

Working baseline: <commit + local changes>; requested scope: <scope>.
Exclusions: <generated/vendor areas, unavailable repos, reasons>.

| Area / owned paths | Entry points / variants | Status | Evidence / blocker |
|---|---|---|---|
| <area> | <flows/configurations> | <unseen/mapped/traced/verified/blocked/excluded> | <links> |

| Node / dependency group | Traversal state | Caller / unresolved edge | Next evidence/action |
|---|---|---|---|
| <id> | <pending/visiting/summarized/blocked> | <id/edge> | <path + action> |

| Command | Working directory / baseline | Prerequisites | Outcome / assertions |
|---|---|---|---|
| <actual command> | <cwd/commit/local changes> | <requirements> | <passed/failed/not run/blocked> |

Completed flows/groups: <IDs and evidence>.
Active stack and cycle groups: <IDs, ordering, unresolved internal contracts>.
Decisions/questions: <IDs>; baseline changes: <what became stale>.
Next action: <one exact action that resumes the traversal>.
```

## Instruction-file pointer

Add only when authorized and compatible with the actual host's instructions:

```markdown
## Codebase knowledge
Before a change, read docs/codebase/README.md and the relevant module/rule records.
Check their evidence baseline against the current checkout and local changes.
Honor confirmed policy and contract obligations within their scope and exceptions.
Use documented current behavior as compatibility evidence, not automatic policy.
Investigate observed/disputed claims before relying on them and surface conflicts.
Read the source/tests being changed; refresh affected records with the change.
See docs/codebase/worklog.md for incomplete analysis and verification limitations.
```

## Change rehearsal

Record one concrete hypothetical change, affected modules, rule IDs, dependencies and reverse dependents, variant-specific exceptions, safe verification commands, and questions that must be answered first. Do not implement the change. If those cannot be found from the index and linked records, repair the knowledge before claiming it is usable.
