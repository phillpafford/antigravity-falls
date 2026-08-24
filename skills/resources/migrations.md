# Migrations Resource Guide — Schema Evolution & Version Consistency

Reference guide for Blendin. Checklists for reversible migrations, zero-downtime schema changes, and backward compatibility.

If a change touches no database schema or migration file, the audit is **not applicable** — return `MIGRATION_SAFE` with a note.

---

## 1. Forward & Reverse Migration Safety

Every migration should apply cleanly and roll back without data loss:

- **Reversible `down`**: Each migration has an explicit reverse step, or documents deliberately why it is irreversible (e.g. a destructive backfill).
- **Non-Nullable Columns**: A new `NOT NULL` column must ship with a default, or be added nullable → backfilled → tightened. Adding bare `NOT NULL` to a populated table breaks the migration.
- **Idempotency**: Prefer `IF NOT EXISTS` / `IF EXISTS` guards so a partially-applied migration can be re-run.

---

## 2. Zero-Downtime Evolution (Expand → Migrate → Contract)

Destructive changes must be safe against a live deployment still running the old code:

| Operation | Safe approach |
|-----------|---------------|
| **Rename column** | Add new column → dual-write / backfill → switch reads → drop old column in a later release. Never rename in place during a rolling deploy. |
| **Drop column** | Stop referencing it in code first, ship, *then* drop in a subsequent migration. |
| **Narrow a type / add constraint** | Add as `NOT VALID` / validate concurrently where supported; backfill offending rows first. |
| **Add index** | Create `CONCURRENTLY` (or engine equivalent) to avoid a full table lock. |

**Rule of Thumb:** the old application version and the new schema must coexist for the duration of a rolling deploy.

---

## 3. Backward Compatibility

- **Rolling Deploys**: During deploy, N-1 app code runs against N schema. Confirm the previous version can still read and write.
- **Additive First**: Prefer additive changes (new nullable columns, new tables) that old code simply ignores.
- **Enum & Constraint Ordering**: Add new enum values / constraints before code depends on them; remove them only after all code stops emitting the old values.

---

## 4. Data Integrity & Rollback

- **Tested Rollback Path**: The `down` migration must not drop committed data that cannot be recovered. If it must, flag it explicitly.
- **Foreign Keys & Order**: Order operations so intermediate states never violate FK or check constraints.
- **Backfill in Batches**: Large backfills should be batched to avoid long locks and replication lag; note transaction scope.
