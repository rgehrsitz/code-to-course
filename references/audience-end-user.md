# Audience: End Users of an Application

> **When to read this:** Step 0, after choosing end-user mode. It replaces the internals-mode assumptions — this course teaches people to *use* the product, not how it's built.

## Who the learner is

Someone who has installed (or is about to install) the app and wants to get real work done with it — and ideally discover the capabilities they didn't know existed. They may be highly skilled in their own domain (accounting, design, research, operations) but should be assumed to have **no software-development background**.

**Their goals:**
- Accomplish their everyday tasks quickly and confidently
- Discover features and shortcuts that save time
- Understand the app's *model* (what its core objects are and how they relate) so nothing feels magical or scary
- Recover on their own when something goes wrong
- Know what the app *won't* do, so they don't waste time looking

**Tone:** a friendly expert colleague sitting next to them. Concrete, encouraging, never condescending. Speak in the app's vocabulary (the words on its buttons), not the code's (never "component", "IPC", "store", "handler", "renderer").

**Tooltips:** for app-specific concepts ("notebook", "workspace", "sync conflict") and general computing terms a non-technical person might not know ("file path", "export", "cache", "plugin"). Don't tooltip programming concepts — they shouldn't appear at all.

---

## What to extract from the code (Phase 1)

Treat the codebase as the most accurate, up-to-date manual in existence. Build an internal **feature inventory** before designing anything:

| Look for | Where it usually lives | Why it matters |
|---|---|---|
| **Core objects** (documents, projects, accounts, items…) | Data models, database schema, Go structs, TS types, file formats | Becomes the mental model in Module 1 |
| **Menus and commands** — exact labels, nesting, accelerators | Electron `Menu.buildFromTemplate`, Wails `menu.NewMenu()`/`AddText`, command palettes, context menus | Menu paths (`File › Export › PDF…`) and shortcuts are gold |
| **Keyboard shortcuts** | Menu accelerators (`CmdOrCtrl+K`), `keydown`/hotkey handlers, keymap files | The shortcut cheat sheet; convert `CmdOrCtrl` to `⌘` (mac) / `Ctrl` (win/linux) |
| **UI labels & copy** | i18n/locale files (`en.json`), component JSX/Svelte/Vue templates | Use exact wording so learners can find things |
| **Screens / views / routes** | Router config, page components, window creation | The UI tour and "finding your way around" |
| **Settings & preferences** — names, defaults, allowed values, effects | Settings schema, config defaults, preference dialogs, `electron-store` defaults, Viper/config structs | Setting cards with real defaults |
| **Limits & rules** | Validation code, constants (`MAX_FILE_SIZE`), accepted file types | "Good to know" callouts; nobody else documents these |
| **Error & warning messages** | `throw`/`errors.New`/`dialog.showErrorBox`/toast calls, i18n error keys | The troubleshooting module — explain each common one |
| **Import/export formats & integrations** | File dialogs' `filters`, parsers, exporters, OAuth/API clients | Workflows involving the outside world |
| **Where data lives** | `app.getPath('userData')`, `os.UserConfigDir()`, default library paths | Backups, sync, moving machines |
| **CLI flags / launch options** | `process.argv` parsing, `flag`/`cobra`, protocol handlers | Power-user section |
| **Platform differences** | `process.platform`, `runtime.GOOS` branches | Platform-specific tabs and keys |
| **What's new** | CHANGELOG, release notes | Highlight recent features; skip removed ones |

**Accuracy rules**
- Copy every label, shortcut, setting name and message **exactly**. If the UI says "Preferences…" don't write "Settings".
- Only teach features reachable by a user on the default build. Skip debug menus, dev-only flags, disabled feature flags, commented-out or unreferenced code.
- If behavior depends on platform, say so (use platform tabs or platform-aware keys).
- Don't guess at *why* a feature exists — describe what it does and when it's useful.

**Group features by the user's goals, not by code structure.** Cluster the inventory into 3–6 *jobs* the user is trying to get done (e.g. "capture ideas", "organize", "share", "stay safe"). Those jobs become the workflow modules.

---

## Module arc

| # | Module | Purpose | Hero element |
|---|---|---|---|
| 1 | **What this app is for — and how it thinks** | The problem it solves, the core objects and how they relate. End with "what you'll be able to do by the end". | Pattern cards for core objects; **UI tour** of the main window |
| 2 | **Your first win** | The single most important workflow, end to end, in 4–6 steps. The learner should be able to do it right after. | **Flow animation** of the workflow; step cards with menu paths; *try-it checklist* |
| 3–5 | **Workflow modules** (one per job) | Each teaches one job: the main path, the faster path, and the power features that help. | Action ↔ result blocks, screenshots, shortcuts, setting cards |
| n-1 | **When things go wrong** | The most common error messages and confusing states, what they mean, and how to recover. Where data lives; backups. | **Error cards**; "spot the mistake" workflow challenge |
| n | **Power moves & feature map** | Shortcuts cheat sheet, CLI/launch options, integrations, then a **searchable feature map** of *every* feature with how to reach it. | **Shortcut list**; **feature map** |

The feature map is how the course covers "everything" without becoming a manual: modules teach the important 20% deeply; the map lists 100% briefly, linking back to the module that teaches each feature.

Adapt freely: a single-purpose utility might need 4 modules; a large creative app might need 7–8. Don't create a module for a job the app barely supports.

**Module 1 opening:** start from the learner's world, not the app's. "You've got notes scattered across email, sticky notes and your phone…" — then introduce the app as the answer, then the tour.

---

## Required elements (every end-user course)

1. **Course hero** (`00-cover.html`) — title, one-line promise, chips for time/modules/version/platforms.
2. **UI tour** — at least one screenshot with numbered hotspots (Module 1). Use real screenshots when available (see `screenshots.md`).
3. **Flow animation** — at least one, tracing a workflow through the app's parts from the user's point of view (You → Editor → Export dialog → Your disk).
4. **Action ↔ result blocks** — at least one per workflow module: what the user does on the left, what happens (visibly and behind the scenes, in plain words) on the right.
5. **Platform-aware keys** — every shortcut uses `<kbd data-mac="⌘" data-win="Ctrl">Ctrl</kbd>` so it adapts to the learner's OS.
6. **Quizzes** — one per module, scenario-based (see below).
7. **Glossary tooltips** — app concepts and general computing terms, first use per module.
8. **Feature map** — in the final module.

Strongly recommended: group chat (the app's panels or features "talking" about who handles what — great for "where do I do X?" confusion), try-it checklists after each workflow, error cards, setting cards, menu paths for every command mentioned.

**Code blocks are rare in this mode.** Use them only when the user genuinely types something: CLI commands (`.terminal`), config files they edit by hand, formulas/markup/query syntax the app accepts. Never show the app's source code.

---

## Quizzes that test using the app

Gold standard: a realistic situation and a choice of what to do.
- "You need to send a colleague just the notes tagged #q3, as one PDF. What's the fastest route?"
- "You changed a setting and now the app looks wrong. Where do you undo it?"
- "Sam sees *'This note was changed outside Driftwood. Reload?'* — what probably happened?"
- "Which of these can the app NOT do?" (tests the boundaries — valuable and rarely taught)

Don't quiz: exact menu positions, default values, keyboard shortcuts by rote — those belong in the cheat sheet.

---

## Mapping from the original (internals) elements

| Internals element | End-user equivalent |
|---|---|
| Code ↔ English translation | **Action ↔ result block** (`.action-result`); code↔English only for config files/formulas users type |
| Group chat between components | Chat between the app's **panels/features** or between **you and the app** |
| Data flow between services | **Workflow flow**: You → UI area → dialog → file/cloud |
| Architecture diagram | **UI map** (`.arch-diagram` with zones = window regions) or a UI tour |
| Spot the bug | **Spot the mistake** in a workflow (`.bug-code.steps`) |
| File tree of the repo | File tree of **where the user's data lives** |
