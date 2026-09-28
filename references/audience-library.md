# Audience: Developers Using a Library, SDK or Tool

> **When to read this:** Step 0, after choosing library mode. The course onboards developers who will *call* this project from their own code — it teaches the public surface and how to use it well, not how it is implemented.

## Who the learner is

A working developer who just added (or is evaluating) this library. They know how to program — in the library's language or a close one — but know **nothing about this project**. They want to become productive quickly and avoid the mistakes everyone makes in their first week.

**Their goals:**
- Get a first working result in minutes
- Understand the library's **mental model**: its core types/abstractions and how they relate
- Know the common tasks and the idiomatic way to do each
- Understand configuration, lifecycle (init → use → close), concurrency/async rules and error handling
- Avoid pitfalls and anti-patterns; know the limits
- Know where to look when something breaks

**Tone:** a senior engineer pairing with them. Precise, pragmatic, opinionated about idiomatic usage. Explain *why* the API is shaped the way it is when that helps them use it correctly.

**Tooltips:** only for project-specific concepts and for domain terms outside general programming (e.g. "backpressure", "idempotency key", "CRDT"). **Do not** tooltip general programming vocabulary (function, class, async, JSON) — it's patronizing for this audience. Tooltip density is much lower than in the other modes.

---

## What to extract from the code (Phase 1)

Map the **public surface** first; internals only matter where they explain behavior a user can observe.

| Look for | Where it usually lives | Why it matters |
|---|---|---|
| **Public API** — exported functions, types, classes, methods, options | `index.ts`/package `exports`, `__init__.py`/`__all__`, Go exported identifiers, `pub` items, header files | The course's backbone. Signatures copied exactly. |
| **Entry point & setup** | README quickstart, constructors/`New…`/`init`/`createClient` | The "first win" |
| **Real usage examples** | `examples/`, docs, README, and especially **tests** | Tests are verified-working usage — prefer them over inventing examples |
| **Options & configuration** — names, types, defaults, validation | Options structs/interfaces, default constants, schema validation | Setting/param tables with real defaults |
| **Lifecycle & resources** | `close()`/`Dispose`/`defer`, context managers, connection pools | What leaks if you forget |
| **Async / concurrency contract** | Promises, goroutines, locks, "not thread-safe" comments | The most common source of bugs |
| **Errors** | Custom error types, sentinel errors, thrown exceptions, error codes | "When things go wrong" module |
| **Extension points** | Interfaces to implement, plugins, hooks, middleware, callbacks | Advanced module |
| **Deprecations & versions** | `@deprecated`, CHANGELOG, migration guides | Warn; never teach deprecated APIs as the main path |
| **Limits & performance notes** | Constants, comments, benchmark files | Pitfall callouts |
| **CLI (for dev tools)** | Command/flag definitions (cobra, click, argparse, yargs) | Command reference and workflows |

**Accuracy rules**
- **Snippets must be real.** Prefer code copied verbatim from `examples/`, tests, README or docs (cite the file). If you must compose a new example, use only APIs and signatures that exist exactly as written, keep it minimal, and label its header `example` rather than a file path.
- Copy signatures, option names and error names **exactly**.
- Teach the public API only. Mention internals only to explain observable behavior ("results are cached for 60s, so…"), and say it's an implementation detail.
- Match the language(s) the library supports. For multi-language SDKs, use `.tabs` with `data-tab-group="lang"` so the learner's choice syncs across the course.

---

## Module arc

| # | Module | Purpose | Hero element |
|---|---|---|---|
| 1 | **What it solves & the 30-second example** | The problem, when to use it (and when not), install + the smallest complete example. | Code ↔ English translation of the quickstart |
| 2 | **The mental model** | The 3–6 core abstractions and how they relate; the lifecycle of a typical call. | Architecture diagram of the public types; **flow animation** of one call through them |
| 3–4 | **Common tasks** | One module per cluster of tasks, each with idiomatic code, options that matter, and a do/don't comparison. | Code ↔ English blocks; API cards; `.compare` |
| 5 | **Configuration, errors & edge cases** | Options with real defaults, error types and how to handle them, async/concurrency rules, resource cleanup. | Param tables; error cards (error type → cause → handling) |
| 6 | **Going further** | Extension points, performance, testing code that uses the library, integration patterns. | Pattern cards; spot-the-misuse challenge |
| 7 | **API map** (optional for large APIs) | Searchable map of every public function/type with one-line purpose and a link to the module teaching it. | Feature map |

Adapt: a tiny utility library may need 3–4 modules; a framework may need 7.

---

## Required elements (every library course)

1. **Course hero** — with version, language(s), install command chip.
2. **Code ↔ English translations** — at least one per module, using real snippets.
3. **Flow animation or group chat** — at least one, showing what happens during a call (your code → client → transport → server/filesystem, or the library's core objects talking).
4. **API cards** (`.api-card`) for the most important functions/types.
5. **Do / don't comparisons** (`.compare`) — at least two across the course, for the most common mistakes.
6. **Quizzes** — one per module, applied (see below).
7. **Code blocks with file headers** (`.code-block` + `.code-header`) and copy buttons for anything the learner will paste.

---

## Quizzes that test applied understanding

- "You need to process 10,000 records without exhausting memory. Which API do you reach for?"
- "This snippet leaks connections under load — which line is the problem?" (spot the misuse, `.bug-challenge`)
- "Your call returns `ErrRateLimited`. What's the right response?"
- "Which option would you change to make retries idempotent?"

Don't quiz: exact signatures, parameter order, or anything answerable by scrolling up.

---

## Mapping from the original (internals) elements

| Internals element | Library equivalent |
|---|---|
| Code ↔ English (internal code) | Code ↔ English of **usage code** (examples/tests) |
| Group chat between internal components | Chat between **the learner's code and the library's core objects** |
| Architecture diagram of services | Diagram of the **public types** and what owns what |
| Spot the bug in the project's code | **Spot the misuse** in calling code |
| Permission / config badges | `.param-table` or `.setting-card` for options |
