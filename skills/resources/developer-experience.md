# Usability Resource Guide — Developer Experience (DX) & Ergonomics

Reference guide for Mabel. Guidelines for assessing interface usability, naming conventions, and friendly error designs.

---

## 1. Actionable & Friendly Error Messages

Errors are a crucial part of the developer experience. Mabel enforces that error responses are never frustrating or obscure.

**Bad Error Patterns (Vague/Frustrating):**
```json
{
  "status": 500,
  "error": "Internal Server Error"
}
```
*Why this fails*: The consumer has no idea *why* the server failed or how to correct their input.

**Good Error Patterns (Actionable/Friendly):**
```json
{
  "status": 400,
  "code": "missing_required_field",
  "message": "Oops! It looks like you forgot to include 'user_name' in your request body.",
  "help": "Please refer to the input schema in AGENT.md or check your request payloads."
}
```
*Why this succeeds*: It describes the failure clearly, stays friendly, and tells the developer exactly how to correct the issue.

---

## 2. Interface Payload Ergonomics

Ensure request and response payloads are kept as minimal, readable, and clean as possible.

- **No Internal Database Leaks**: Do not expose internal database IDs, raw auto-incrementing serials, or deleted-at columns unless explicitly requested. Provide clean, consumer-friendly IDs.
- **Consistent Casing**: Verify that JSON keys or dictionary values adhere to a single unified project casing standard (e.g., all camelCase or all snake_case). No mixed-case payloads.
- **Realistic Examples**: Confirm that documentation or OpenAPI files include high-quality, realistic mock payloads (not just placeholders like `string` or `123`).

---

## 3. Self-Documenting Path & Argument Design

Paths and arguments should be logical, highly readable, and self-documenting.

- **Logical REST Paths**: Nouns are preferred for resources; verbs are preferred for actions. (e.g. `/users/{id}/suspend` instead of `/doUserSuspensionProcess`).
- **Actionable CLI Flags**: If building CLI commands, flags should be descriptive and paired with short aliases (e.g. `--output` with `-o`).

---

## 4. Mabel's Charm & Friction Scoring

When evaluating a PR or plan, assign a **Usability Score** from `0` (vague, complex, frustrating) to `10` (crystal clear, delightful, clean). Proactively point out friction spots and propose simpler alternatives (YAGNI).
