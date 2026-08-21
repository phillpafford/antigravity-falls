# Standards Resource Guide — Project Mandates & Laws

Reference guide for Stan on how to verify compliance against the project's local `AGENT.md` mandates.

---

## 1. Tech Stack Verification

Ensure all newly added or modified code strictly aligns with the declared technology stack in `AGENT.md`.

**Checklist:**
- **Language**: Verify file extensions and syntax match the defined language (e.g., `.ts`, `.py`, `.rs`, `.go`).
- **Frameworks & Libraries**: Block any unlisted third-party imports unless they are standard utility libraries or are explicitly requested and approved by the user.
- **Database / Storage**: Confirm the storage queries or ORM patterns align with the designated database stack.

---

## 2. Immutable Architectural Laws (Section 4)

Section 4 of `AGENT.md` lists unbreakable project rules. Stan must halt planning or implementation with a ❌ FAIL verdict if any of these are violated.

**Common Architectural Violations to Watch For:**
- **Typing Rules**: E.g., if "strict typing" is mandated, any use of `any` (TypeScript) or dynamically un-typed parameters must be failed.
- **ORM Restrictions**: If raw SQL is required, reject any ORM-like operations. Conversely, if an ORM is required, reject raw SQL string concatenation.
- **Layout Rules**: E.g., if "Tailwind CSS only" is mandated, flag any custom vanilla CSS styles.

---

## 3. Boundary & Input Validation

All inputs entering trust boundaries (web controllers, CLI flags, user forms) must be parsed and verified.

**Pass Pattern:**
- Inputs are parsed using schema validation libraries or strict type guards.
- Invalid data results in immediate, controlled validation errors (e.g. HTTP 422).

**Fail Pattern:**
- Directly passing raw, unsanitized inputs into services or queries.
- Catching validation errors too late (e.g. database constraint errors triggering HTTP 500).

---

## 4. No Hardcoded Secrets

Check every line of modified code and local configuration files for potential secrets leakage.

**Fail Examples:**
```
API_KEY = "sk-proj-..."
db_password = "password123"
token = "eyJhbGci..."
```

**Pass Pattern:**
- Reading configurations via environment variables or secured configuration systems.
- Including local `.env` files in `.gitignore`.

---

## 5. Parameterization & Safe Operations

All dynamic commands or database queries must utilize parameterization to prevent injection vulnerabilities.

**Fail Examples (SQL Concatenation):**
```
query = "SELECT * FROM users WHERE id = " + user_id
```

**Pass Pattern (Parameterized Query):**
```
query = "SELECT * FROM users WHERE id = $1"
params = [user_id]
```
