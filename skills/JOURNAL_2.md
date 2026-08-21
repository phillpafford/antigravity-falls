# Journal 2: API Contracts, Schemas & DB Migrations
*Instructions: Place this file in your project's `.agent/skills/` directory. Fill in the brackets `[]` with your API and database design standards.*

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
