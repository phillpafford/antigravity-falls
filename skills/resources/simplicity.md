# Simplicity Resource Guide — Anti-Overengineering & YAGNI

Reference guide for Wendy. Checklists for spotting wrapper bloat, premature abstraction, and complexity that doesn't earn its keep.

---

## 1. Wrapper & Abstraction Bloat

Flag abstractions that add indirection without adding value:

- **Single-Implementation Interfaces**: An interface, abstract base class, or protocol with exactly one concrete implementation. Delete the interface and use the concrete type until a second implementation actually exists.
- **Pass-Through Wrappers**: Functions or classes that only forward their arguments to another call without transforming, validating, or deciding anything.
- **Manager/Handler/Service Sprawl**: New `*Manager`, `*Handler`, `*Service` layers introduced to hold a single function. Prefer a plain function.

**Fail Pattern:**
```
class UserServiceWrapper:
    def __init__(self, service):
        self.service = service
    def get_user(self, id):
        return self.service.get_user(id)  # adds nothing
```
**Pass Pattern:** call `service.get_user(id)` directly.

---

## 2. Premature Generalization (YAGNI)

"You Aren't Gonna Need It." Solve the requirement in front of you, not imagined futures:

- **Speculative Config Flags**: Options, feature toggles, or strategy parameters with only one value ever passed.
- **Generic Frameworks for One Case**: Building a plugin system, rules engine, or DSL to handle a single concrete case.
- **Extension Points "Just In Case"**: Hooks, callbacks, or overridable methods with no current caller.

**Rule of Thumb:** If nothing in the current scope exercises the generality, cut it. The change can be made when the second case arrives.

---

## 3. Dependency Weight

- **Heavy Dep for a Small Job**: Pulling a large library to do what a few lines of standard-library code already do (e.g. left-pad, simple date formatting, trivial deep-clone).
- **Duplicate Capability**: Adding a dependency that overlaps one already in the project. Reuse the existing one.
- **Transitive Cost**: Note when a dependency drags in a large tree; weigh it against the lines of code it saves.

---

## 4. Shortest Working Diff

The house style is the "Shortest Working Diff." Actively cut:

- **Dead Scaffolding**: Empty methods, `TODO` stubs, and placeholder classes staged for later.
- **Boilerplate Layers**: Redundant DTO↔model mapping, getter/setter walls around plain data, and ceremony that the language or framework already provides.
- **Collapsible Structure**: Multiple files or layers that can be one. Prefer the smallest change that satisfies the requirement and reuses existing helpers.
