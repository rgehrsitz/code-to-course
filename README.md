# Project to Course

A Claude Code skill that turns a project repository into a beautiful, interactive HTML course **for the people who use it**.

- **Apps** (Electron, Wails, Tauri, web, CLI) → an **end-user course**: how to use the app and get the most out of every feature, with real screenshots, guided UI tours, platform-aware keyboard shortcuts, settings, troubleshooting, and a searchable feature map.
- **Libraries, SDKs and developer tools** → a **developer-onboarding course**: the mental model, the public API, idiomatic usage, configuration, errors, and pitfalls — built from real examples and tests.
- **Any codebase, on request** → the original **"how the code works"** course for non-technical builders.

<img width="720" alt="Course cover and sidebar, light mode" src="docs/preview-light.png" />
<img width="720" alt="UI tour with hotspots, dark mode" src="docs/preview-dark.png" />

## Why build a course from the code?

Because the code is the most accurate manual that exists. It knows the exact menu labels, the real defaults and limits, every error message, and the shortcuts nobody documented. The skill reads it, then teaches in the learner's language — tasks and workflows for users, APIs and patterns for developers.

## What the course looks like

The output is a small **directory** (`index.html` + CSS/JS + screenshots) that opens in any browser, works offline except for Google Fonts, and needs no build tools to view.

**Shell**
- Sidebar table of contents with per-module completion ✓, reading progress, "Up next" cards
- Light and dark mode (follows the OS, with a toggle), print-friendly, keyboard navigation (`N` / `P`)
- Fully responsive; respects reduced-motion settings

**End-user elements**
- **UI tours** — real screenshots with numbered hotspots, highlight regions and a step-through panel
- **Platform-aware shortcuts** — `⌘` on macOS, `Ctrl` on Windows/Linux, switchable from the top bar
- **Menu paths**, **action ↔ result** blocks, **setting cards** with real defaults, **error explainers**
- **Try-it checklists** that remember progress, and a **searchable feature map** of everything the app can do

**Developer elements**
- **Code ↔ English** translations, **API cards** with parameter tables, **do / don't** comparisons, language tabs that stay in sync

**Shared**
- Scenario quizzes that test *doing*, not remembering · group-chat and step-by-step flow animations · drag-and-drop matching · glossary tooltips · copyable code and terminal blocks

Open [`examples/component-gallery/index.html`](examples/component-gallery/index.html) to see every element in a sample course.

## How to use

### Install as a Claude Code skill

```bash
git clone https://github.com/rgehrsitz/code-to-course ~/.claude/skills/project-to-course
```

Then, in Claude Code inside any project:

- *"Make a course for the users of this app"*
- *"Turn this library into an onboarding course for developers"*
- *"Create a user training course from https://github.com/owner/repo"*
- *"Explain this codebase interactively"* (internals mode)

Claude picks the mode from the project (you can also name it), analyzes the code, captures screenshots when it can run the app, and builds the course.

### Screenshots for desktop apps

For **Electron** apps Claude launches the app with Playwright; for **Wails** (and other web-based UIs) it uses the dev server (`wails dev` → `http://localhost:34115`). Either way `references/capture.cjs` takes the screenshots and computes hotspot positions from the real element positions. If the app can't run in Claude's environment, the course uses clearly labeled illustrations, and you can drop real screenshots into `course/screenshots/` and re-run `build.sh`. Details: [`references/screenshots.md`](references/screenshots.md).

## Design philosophy

- **Teach jobs, not menus.** Modules follow what learners are trying to get done; exhaustive coverage lives in the feature map.
- **Accuracy is the product.** Labels, shortcuts, defaults, messages and code are copied exactly from the source.
- **Show, don't tell.** Every screen is at least half visual; max 2–3 sentences per text block.
- **Quizzes test doing.** "Sam needs to send just the #q3 notes as one PDF — fastest route?", not "Which menu is Export in?"
- **Fresh metaphors.** Each concept gets its own — never "restaurant".

## Skill structure

```
SKILL.md                         # Main instructions: mode selection, phases, build steps
references/
├── audience-end-user.md         # End-user mode: what to extract, module arc, required elements
├── audience-library.md          # Library mode
├── audience-internals.md        # Internals ("how the code works") mode
├── screenshots.md               # Getting screenshots of Electron / Wails / web apps
├── capture.cjs                  # Playwright capture + hotspot coordinate script
├── content-philosophy.md        # Accuracy, visual density, metaphors, tooltips, quizzes
├── interactive-elements.md      # HTML patterns for every element
├── design-system.md             # Tokens, typography, theming, layout
├── gotchas.md                   # Review checklist
├── module-brief-template.md     # Briefs for parallel module writing
├── styles.css · main.js         # Pre-built design system + engines (copied verbatim)
└── _base.html · _footer.html · build.sh
examples/component-gallery/      # Sample course showing every element (bash preview.sh to rebuild)
```

---

Forked from the original codebase-to-course skill by [Zara](https://x.com/zarazhangrui), built with Claude Code.
