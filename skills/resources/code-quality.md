# Code Quality Resource Guide — PR Review & Clean Code Standards

Reference guide for Pacifica. Guidelines for enforcing code cleanliness, dead code elimination, and pedantic naming audits.

---

## 1. Dead Code Elimination Checklist

Pacifica has zero tolerance for sloppy, commented-out, or unused code. All changes must be fully complete and tidy.

**What to Check and Reject (`❌ FAIL`):**
- **Commented-Out Code**: Any lines of inactive code left behind in production-bound files. (Reject; must be deleted. Git history preserves past versions).
- **Unused Imports & Variables**: Variables or dependencies declared but never imported/used.
- **Obsolete Todo Comments**: Temporary `// TODO` comments that lack an associated issue link or are completed.

---

## 2. Structural Cleanliness & Complexity

Review modified functions to ensure they are highly maintainable and free of structural bloat.

- **Cyclomatic Complexity**: If a function contains deep-nested conditional blocks (more than 3 levels of `if/else`), reject it.
- **Single Responsibility Principle**: A function or class should do exactly one thing. If a method does database calls AND parses HTTP logic, McGucket should flag it architecturally, and Pacifica will reject it on style/complexity!

**❌ BAD (Too complex / nested - Trigger for `❌ FAIL`):**
```typescript
function processUserData(user: User) {
  if (user) {
    if (user.is_active) {
      if (user.role === 'admin') {
        // deep nesting is hard to trace
        doAdminWork();
      } else {
        doNormalWork();
      }
    }
  }
}
```

**✅ GOOD (Guard Clauses / Flat Layout - Required for `✅ PASS`):**
```typescript
function processUserData(user: User) {
  if (!user || !user.is_active) return; // Immediate guard clause exit
  
  if (user.role === 'admin') {
    doAdminWork();
    return;
  }
  
  doNormalWork();
}
```

---

## 3. High-Standard Variable & Function Naming

Names must be self-documenting and grammatically precise.

- **Pronounceable & Meaningful**: Avoid arbitrary single-letter variables (e.g. `let u = getUser()`). Use explicit, descriptive names: `let activeUser = getUser()`.
- **Searchable Keys**: Magic numbers or unassigned constants must be declared as clear uppercase constants (e.g., `const MAX_USER_LIMIT = 50` instead of `if (count > 50)`).
- **Action Verbs for Functions**: Function names should start with an action verb reflecting their behavior (e.g. `fetchUserRecord` instead of `userRecord`).

---

## 4. Linting & Formatting Gaps

Ensure every committed file is formatted using standard ecosystem settings.

- Reject files containing trailing whitespaces, mismatched indentation (e.g., mixing tabs and spaces), or sloppy line breaks.
- All code statements must use unified, predictable symbols matching project configurations.
