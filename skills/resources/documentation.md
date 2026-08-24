# Documentation Resource Guide — Requirement Coverage & Doc Sync

Reference guide for Soos. Checklists for verifying that implementations match their specifications and that documentation stays synchronized with the code.

Soos surfaces gaps; he does not block execution.

---

## 1. Requirement Coverage Checklist

For every task, confirm the implementation maps back to a defined requirement:

- **Traceability**: Does each implemented module, endpoint, or function tie to a specific user-supplied issue, feature, or PRD line? Flag code that has no requirement behind it (scope creep) and requirements with no code (incomplete work).
- **Scope Fidelity**: Does the implementation do exactly what was requested — no more, no less? Note undocumented extras.
- **Acceptance Criteria**: Are the conditions that define "done" for the task observable in code or tests?

---

## 2. Spec & Interface Integrity

- **Public Surface Match**: Public APIs, CLI flags, config keys, and types must match the specification exactly — names, shapes, and defaults.
- **Validation Parity**: Input validation (types, ranges, limits, required/optional) must match what the spec promises consumers.
- **Contract Drift**: When an interface changes, verify every caller and every doc that references it is updated in the same change.

---

## 3. Code-Level Documentation

- **Explain the WHY**: Non-obvious business rules, quirks, and workarounds need a short high-signal comment on the *reason*, not a restatement of the syntax.
- **No Redundant Comments**: Delete comments that merely echo the code (`// increment i`). Avoid multi-paragraph essays.
- **Public Symbols**: Exported functions/types carry a one-line doc describing intent and non-obvious constraints.

---

## 4. Project Guides & README Sync

- **Setup / Run / Test**: The README (and `AGENT.md`) must document how to install, configure, test, and run — and those commands must actually work.
- **Changed Behavior**: When a feature changes user-facing behavior, the corresponding guide section is updated in the same PR.
- **Examples Stay Valid**: Code samples and command snippets in docs must match the current interface. Stale examples are a `NEEDS_REVISION` gap.

---

## Gap Report

Report findings to Ford using the schema in `team/soos.md` (`documentation_gaps` + `requirements_coverage`). Classify each gap as `MISSING`, `CHANGED`, or `NEEDS_REVISION` with a severity.
