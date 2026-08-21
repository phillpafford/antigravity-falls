# Documentation Resource Guide — Specs & Gap Analysis

Reference guide for Soos. How to assess documentation completeness and generate gap reports.

---

## 1. Requirements & Spec Verification

An implementation is considered fully "documented" and "specified" when:
1. All public interfaces, routes, or commands are documented in a centralized specification file (e.g. `openapi.yml`, README, or markdown guides).
2. The input schemas, parameter lists, and environment config variables match the specification exactly.
3. Every main logic pathway has associated test scripts with descriptive names.

---

## 2. API & Interface Schema Requirements

If the project exposes an API or library interface, ensure that each exported boundary lists:
- **Identifier / Name**: Descriptive, camelCase or snake_case, conforming to project styles.
- **Description**: Clear, single-sentence summary of the function or endpoint's intent.
- **Inputs & Payloads**: Strictly defined parameters, showing types, optionality, and constraints.
- **Expected Outputs**: Success schema mapping and standard error codes.

---

## 3. Severity Assignment for Documentation Gaps

| Severity     | Condition                                                                                           |
|--------------|-----------------------------------------------------------------------------------------------------|
| **critical** | Missing auth or initialization documentation (consumers cannot start the application).              |
| **critical** | Missing critical error states/codes (consumers cannot recover from errors).                         |
| **high**     | Feature or endpoint is implemented in code but entirely omitted in the public specification/README. |
| **high**     | Public interface schema mismatch (documented types or fields differ from the actual code).          |
| **medium**   | Missing description tags or parameter descriptions in schemas.                                      |
| **medium**   | Local `DEVELOPMENT.md` or README lacks a required configuration block.                              |
| **low**      | Missing realistic example payloads or return values.                                                |
| **low**      | Vague or grammatically incorrect description prose.                                                 |

---

## 4. Documentation Best Practices

- **Avoid Redundant Comments**: Do not write comments that describe *what* the code does on a syntactic level (e.g. `// Increment count by 1` above `count++`).
- **Explain the "Why"**: Use comments exclusively to explain non-obvious business logic, structural constraints, workarounds, or business-logic invariants.
- **Minimalist READMEs**: Maintain clean, actionable workspace guides. They should outline the absolute minimum steps required to set up, configure, build, run, and test the project.
- **No Stale Code comments**: Remove commented-out code blocks. They clutter the repository and should be preserved in git history instead.
