# Validator Resource Guide — Adversarial & Security Reference

Reference guide for Bill Cipher. Framework for locating security holes, input sanitization bypasses, logical escapes, and system-wide vulnerabilities.

---

## 1. Injection Attack Surface (OWASP A03:2021)

Injection is one of the most critical vulnerabilities. Bill Cipher inspects every incoming data boundary to ensure inputs cannot manipulate execution strings.

- **SQL / NoSQL Injection**:
  - **Check**: Are any raw variables concatenated or interpolated into query strings?
  - **Remediation**: Mandate parameter binding/bound parameters (e.g. `$1` placeholders or ORM parameter bindings).
- **Command / Shell Injection**:
  - **Check**: Does the application execute system commands (e.g., `exec`, `spawn`, `os.system`) utilizing user-provided arguments?
  - **Remediation**: Avoid raw shells. Use safe library equivalents (like directory readers, native builders) or sanitize and allowlist inputs tightly.
- **Path Traversal**:
  - **Check**: Does the app load or write files using user-provided paths (e.g., `../../etc/passwd`)?
  - **Remediation**: Use library path resolution and validate that paths stay strictly within an designated sandboxed root.

---

## 2. Broken Access Control & Logic Bypasses (OWASP A01:2021)

Logical errors allow malicious actors to perform actions they shouldn't.

- **Unconditional Bypasses**:
  - **Check**: Are there any hardcoded bypass switches? (e.g. `if (bypassAuth == true)`, `allowed = true` overrides inside middleware, or `admin` triggers).
  - **Remediation**: Delete unconditional bypass blocks entirely.
- **Inverted / Swapped Invariants**:
  - **Check**: Are logic flags and permissions checked with correct Boolean operators? Look for inverted logic checks where an error bypasses security or allows access instead of blocking.
- **Gating Sequence**:
  - **Check**: Is access checked AFTER data is retrieved or processed?
  - **Remediation**: Enforce authorization gates at the absolute entry point of controllers or routes.

---

## 3. Sensitive Data Exposure & Leaks (OWASP A02:2021)

PII (Personally Identifiable Information) and credentials must be isolated.

- **Telemetry / Logs Leaks**:
  - **Check**: Does logger output include active user passwords, SSNs, credit cards, or private keys?
  - **Remediation**: Intercept and redact sensitive keys, or avoid logging entire input request bodies in raw form.
- **Plaintext Storage**:
  - **Check**: Are passwords, access tokens, or session tokens stored in plaintext in the database or config?
  - **Remediation**: Passwords must be hashed using a strong, CPU-intensive, adaptive hashing algorithm (e.g., bcrypt with cost ≥12, Argon2). Never use simple hashes like MD5, SHA1, or SHA256 for password storage.

---

## 4. Insecure Configuration & Hardcoding (OWASP A05:2021)

- **Hardcoded Credentials**:
  - **Check**: Look for developer names, test credentials, or system passwords written directly into source files.
  - **Remediation**: abstract all passwords and keys into environment variables, or retrieve them from secure vault configurations.
- **Insecure Default TLS / HTTPS**:
  - **Check**: Look for flags that disable strict TLS verification (e.g. `rejectUnauthorized: false` in Node.js, `verify=False` in Python requests) in production-bound files.
  - **Remediation**: Mandate full verification. Use localized, trusted certificates if working in development schemas.
