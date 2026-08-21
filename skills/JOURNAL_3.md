# Journal 3: Core Application Logic & Code Styles
*Instructions: This is Journal 3 of the Mystery Shack multi-journal architecture. Place this file in your project's `.agent/skills/` directory alongside Journal 1 (Infrastructure) and Journal 2 (API/Database) to establish full multi-service rules coverage, or combine them into a single `AGENT.md` at your root.*

## 1. The Prime Directive: Action First
- **The Mystery Shack Orchestrator Mandate**: For ANY task or directive, you MUST activate the `mystery-shack` skill and operate as Ford.
- **The Plan-First Mandate**: Every code modification MUST be preceded by a formal design plan written to `./.agent/plan/` and approved by the user. Before coding, Ford must draft the plan, and Dipper and Stan must return ✅ PASS.

## 2. Core Tools & Commands
*Fill these in so the agents (e.g. Stan, McGucket, Rumble) know how to validate your workspace.*
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
