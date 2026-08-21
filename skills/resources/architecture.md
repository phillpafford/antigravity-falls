# Architecture Resource Guide — Layered Design & Logical Separation

Reference guide for McGucket. Best practices for logic isolation, type handling, design pattern compliance, and testing.

---

## 1. Multi-Tier Layered Architecture

To ensure high maintainability, code should be separated into distinct layers. McGucket enforces that logic does not leak across boundaries.

```
Interface Layer (Routes, HTTP Controllers, CLI Commands, UI Views)
       │
       ▼ (Passes parsed input payloads)
Business Logic Layer (Domain Services, Orchestrators, Core Calculations)
       │
       ▼ (Uses abstract repository interfaces or standard helpers)
Data Access Layer (Repositories, DAOs, Cache Clients, DB Pools)
```

**Boundary Isolation Rules:**
- **Interface Layer**: Focuses exclusively on parsing inputs, validating payload boundaries, choosing network/protocol protocols (e.g. REST, gRPC, CLI), and handling responses. It must NOT contain business logic or raw SQL.
- **Business Logic Layer**: Handles domain rules, conditional processing, state transitions, and calculation invariants. It must NOT import network protocols or execute direct raw queries.
- **Data Access Layer**: Encapsulates data retrieval, storage updates, caching, or third-party service connections. It must return plain models or structured data payloads to the service layer.

---

## 2. Strong Type Handling & Safety

If the project's language supports static typing (e.g., TypeScript, Go, Rust), enforce strict typing patterns:

- **Explicit Signatures**: Ensure all public functions have explicit argument types and return type declarations.
- **Type Casting Abuses**: Flag any excessive type overrides, bypass mechanisms (e.g., `any` in TypeScript, raw empty interfaces without narrow checks), or reflection-based workarounds unless explicitly requested.
- **Payload Schema Types**: Infer or generate types from validation schemas rather than manually hardcoding duplicate interfaces.

---

## 3. Clean-Room Testing (Mocking vs Integration)

McGucket enforces that unit and integration tests are properly structured and separated.

- **Unit Testing**:
  - Focuses on validating individual business logic methods or services.
  - **Zero External Connections**: Unit tests must completely mock all databases, HTTP client pools, filesystem operations, and network connections.
  - Ensures fast execution and isolates logic from environmental issues.
- **Integration Testing**:
  - Verifies the end-to-end flow of a system (e.g., calling an endpoint to query a local database instance).
  - Uses localized, temporary databases or isolated test environments.
  - Strictly prohibits hardcoded production credentials.
- **Unhappy Path Coverage**:
  - Require that test cases exist to verify failure paths (e.g., how the system reacts when a dependency throws an error or returns empty values).
