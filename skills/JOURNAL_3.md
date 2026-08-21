# Journal 3: Core Application Logic & Code Styles (AGENT.md)
*Instructions: This is Journal 3 of the Mystery Shack multi-journal architecture, serving as your primary code rules template. Place this file in your project's root as `AGENT.md` (or keep it as `JOURNAL_3.md` alongside `JOURNAL_1.md` and `JOURNAL_2.md` under `.agent/skills/` for complex multi-service projects).*

## 1. The Prime Directive: Action First
- **The Mystery Shack Orchestrator Mandate**: For ANY task or directive, you MUST activate the `mystery-shack` skill and operate as Ford.
- **The Plan-First Mandate**: Every code modification MUST be preceded by a formal design plan written to `./.agent/plan/` and approved by the user. Before coding, Ford must draft the plan, and Dipper and Stan must return ✅ PASS.

## 2. Core Tools & Commands
*Fill these in so the agents (e.g. Stan, McGucket, Rumble, Pacifica) know how to execute local commands and validate your workspace.*
- **Install Dependencies**: `[e.g., npm install, cargo build]`
- **Lint Code**: `[e.g., npm run lint, ruff check .]`
- **Run Tests**: `[e.g., npm test, pytest, cargo test]`
- **Build Project**: `[e.g., npm run build, docker build]`

## 3. Tech Stack
- **Language**: `[e.g., TypeScript, Python, Rust, Go]`
- **Frameworks**: `[e.g., Next.js, FastAPI, Axum, Express]`
- **Database/Storage**: `[e.g., PostgreSQL + Prisma, MongoDB, SQLite]`
- **Infrastructure**: `[e.g., Vercel, AWS Serverless, Docker]`

## 4. Immutable Architectural Laws
*These are the unbreakable rules that Stan (Standards) and Dipper (Skeptic) will strictly enforce. Agents must halt and reject plans that violate these.*
*   **Rule 1**: `[e.g., "100% strict typing is required. The use of 'any' is forbidden."]`
*   **Rule 2**: `[e.g., "All database queries must be parameterized to prevent SQL injection."]`
*   **Rule 3**: `[e.g., "All business logic must live in the domain layer, completely isolated from controllers."]`

---

## 🐳 Containerization & Deployment (Infra Rules)
- **Base Image**: `[e.g. node:22.17.0-alpine, python:3.12-slim]`
- **Build Multi-stage**: `[e.g. Enabled / Required to minimize image footprint]`
- **User Privileges**: `[e.g. Non-root execution is strictly mandated (e.g. USER node)]`
- **Secrets Injection**: `[e.g. Secrets must NEVER be baked into images; use container env mounts]`

## 🔒 Security Invariants (Stan & Bill Cipher)
- **Encryption**: `[e.g. All production traffic must be served over TLS 1.3]`
- **CORS Rules**: `[e.g. CORS allow-list must be explicitly declared; wildcard '*' is forbidden]`
- **Token Expiry**: `[e.g. Session tokens must use secure JWT standards with max expiry of 1 hour]`
- **Security Scanning**: `[e.g. Zero critical or high-severity vulnerabilities allowed in dependencies]`

---

## 🗺️ API Contracts & Routing (Soos & Mabel)
- **Interface Protocol**: `[e.g. REST over OpenAPI v3, gRPC, GraphQL]`
- **Casing Standards**: `[e.g. camelCase for keys, kebab-case for endpoint paths]`
- **Error Payloads**: `[e.g. Standard RFC 7807 problem details json format required]`
- **Version Gating**: `[e.g. All endpoints must be version-gated (e.g. /v1/users)]`

## 🗄️ Database Schemas & Migrations (Rumble)
- **Database Engine**: `[e.g. PostgreSQL v16, MongoDB, SQLite]`
- **Migration Policy**: `[e.g. Zero-downtime, non-blocking migrations strictly required]`
- **Casing Convention**: `[e.g. snake_case table and column names mandated]`
- **Wildcard Selection**: `[e.g. SELECT * is forbidden in queries; specify explicit columns]`
