# Skeptic Resource Guide — Risk & Edge Case Analysis

Reference guide for Dipper. Outline of common structural risks, scope creep signals, and edge case inventories.

---

## 1. Scope & Blast Radius Checklist

Before approving any plan, verify it stays strictly within the boundaries of the task requirements:

- **Redundant Changes**: Does the plan modify files that are not directly involved in satisfying the user's request? (Flag for deletion)
- **Shared Utilities**: If a shared helper is modified, list all components that import it. Will this change break them?
- **Configuration Modifications**: Does the plan add global config flags, middleware, or system-wide wrappers? Ensure a minor, localized solution isn't safer.

---

## 2. Security & Privilege Escapes

Look for potential security leaks or unauthorized logical bypasses:

- **Permission Gating**: Are non-public actions properly authenticated? Ensure permission checks happen *before* executing the action or accessing data.
- **Bypass Arguments**: Flag any functions that accept flags like `skipAuth`, `ignoreValidation`, or `adminOverride` unless strictly required and scoped.
- **Data Redaction**: Check that highly sensitive personal data (e.g. passwords, SSNs, credit card numbers, tax IDs) is parsed and formatted securely without being leaked to logs.

---

## 3. Edge Case Inventory

Ensure the plan or code explicitly handles typical exceptional paths:

| Scenario                          | What to verify                                                                                                                                              |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Empty Result Set**              | Does the code expect an array/collection to be empty? Does it throw, or return an empty state elegantly?                                                    |
| **Null or Missing Fields**        | If optional fields are omitted in the input payload, does the code assign robust defaults or handle `undefined` without crashing?                           |
| **Concurrency & Race Conditions** | If multiple operations write to the same resource, are there transactional safeties, locks, or atomic states?                                               |
| **Network & Outage Failures**     | What happens if an external API or database is temporarily offline? Are there timeouts and graceful try/catch blocks?                                       |
| **Large Datasets**                | Does a retrieval query lack limit boundaries? Any bulk collection retrieve should include pagination or strict maximum limits to prevent memory exhaustion. |

---

## 4. Complexity & Over-Engineering (YAGNI)

Actively flag any of the following patterns:
- **Interfaces with Single Implementations**: Creating interfaces or abstractions for a single service/class.
- **Premature Generalization**: Designing code to handle "future requirements" that are not currently requested.
- **Complex Dependency Graphs**: Adding heavy new library dependencies when a few lines of standard library logic would suffice.
