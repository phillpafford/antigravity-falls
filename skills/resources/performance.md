# Performance Resource Guide — Execution & Query Efficiency

Reference guide for Rumble. Audit checklists for processing bottlenecks, resource efficiency, and transactional safety.

---

## 1. N+1 Loop Detection

An N+1 pattern occurs when an application retrieves a collection of parent items and then executes a separate query/service call for each item to fetch child details. This creates substantial latency and network overhead.

**Fail Pattern:**
```
# N+1 bottleneck
parents = db.fetch_all_parents()
for parent in parents:
    parent.children = db.fetch_children_for_parent(parent.id) # Runs N times!
```

**Pass Pattern:**
```
# Single batched lookup or join
parents = db.fetch_parents_with_children_joined()
```
*Or, if joining is inefficient:*
```
parents = db.fetch_all_parents()
parent_ids = [p.id for p in parents]
children = db.fetch_children_for_multiple_parents(parent_ids) # Single batch query
# Map children back to parents in memory
```

**Rule of Thumb:** Proactively identify loops that execute network or data retrieval commands. If a loop iterates over an arbitrary or growing collection, block it and mandate a batched query/service replacement.

---

## 2. Resource, Index, & Query Design

If the project utilizes a database or heavy storage layer, audit for these patterns:

- **Wildcard Selection (`SELECT *`)**: Always request explicit fields. This reduces the network payload, speeds up serialization, and allows the engine to optimize query planning.
- **Key Indexing**: Search columns, join conditions, and filter clauses must have indexes. Check that any newly added tables include indices on search/filter keys.
- **Unbounded SELECTs**: Enforce strict limits or pagination on retrieve queries. Unbounded collections risk memory exhaustion when table sizes scale.

---

## 3. Transaction & Mutex Scope

When multiple data entities or logical states are updated in sequence, ensure atomic protection.

- **Atomic Groups**: If a function modifies table A and table B, wrap both in a single transaction (e.g. BEGIN / COMMIT / ROLLBACK) to prevent partial writes if step B fails.
- **Isolation Levels**: For operations with sensitive calculations (e.g., financial ledger balances, ticket reservations), check that appropriate transactional locks are applied to avoid write/read conflicts.

---

## 4. Scaling Bottlenecks

- **Synchronous Blocks**: Avoid long-running synchronous execution blocks on main threads. Delegate heavy processing, bulk calculations, or slow mail alerts to background workers or task queues.
- **Caching Opportunities**: For heavy read operations on stagnant data (e.g., configurations, static metadata), suggest localized caching mechanisms.
- **Timeouts**: Enforce statement and connection timeouts at the client configuration level to prevent a hung backend from holding open pools indefinitely.
