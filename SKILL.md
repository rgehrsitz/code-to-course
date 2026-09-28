---
name: code-to-course
description: "Turn any project repository into a beautiful, interactive HTML course for the people who USE it. For desktop/web applications (Electron, Wails, Tauri, web apps, CLIs) it builds an end-user course on how to use and get the most out of every feature; for libraries, SDKs and frameworks it builds a developer-onboarding course on how to use the public API well. It can also teach a codebase's internals when explicitly asked. Trigger on: 'turn this into a course', 'make a course for my users', 'user training for this app', 'teach people how to use this', 'onboarding course', 'tutorial for this library', 'interactive guide to this project', 'explain this codebase interactively', 'codebase walkthrough', 'make a course from this project'. Produces a self-contained course directory (index.html + assets) with a sidebar table of contents, dark mode, screenshot tours with hotspots, platform-aware keyboard shortcuts, quizzes, animations and a searchable feature map."
---

# Code-to-Course

Transform a project repository into a stunning, interactive course. The output is a **directory** containing a pre-built `styles.css`, `main.js`, per-module HTML files, optional screenshots, and an assembled `index.html` that opens directly in a browser (only external dependency: Google Fonts).

The code is the **source of truth**, not necessarily the **subject**. Reading the code lets the course state facts that ordinary docs miss — exact menu labels, real defaults and limits, every error message, hidden shortcuts — but what the course *teaches* depends on who it is for.

## First-Run Welcome

If the skill is triggered without a project, introduce yourself:

> **I can turn a project into an interactive course for the people who use it.**
>
> - **An app** (desktop, web or CLI) → a course that teaches users every feature, with screenshot tours and real shortcuts
> - **A library or SDK** → a course that teaches developers how to use its API well
> - **Any codebase** → on request, a course on how the code itself works
>
> Point me at a local folder, a GitHub link, or say "this project".

If the user provides a GitHub link, clone it first (`git clone <url> /tmp/<repo-name>`). "This project" means the current working directory.

---

## Step 0: Choose the Course Mode

Decide the mode before anything else. It determines the audience, the curriculum arc and which reference file you load.

| Mode | Pick it when | Audience | Load |
|---|---|---|---|
| **End-user** | The project ships something people *run*: a desktop app (Electron, Wails, Tauri, Qt…), web app, mobile app, game, or a CLI whose users aren't its developers | People who use the product — assume **no technical background** | `references/audience-end-user.md` |
| **Library** | The project is *imported or called by other code*: a library, SDK, framework, API client, plugin system, developer CLI/tool | Developers integrating it — assume **general programming fluency, zero knowledge of this project** | `references/audience-library.md` |
| **Internals** | **Only** when the user explicitly asks how the code works / wants to understand or contribute to the codebase | Non-technical "vibe coders" learning how software works | `references/audience-internals.md` |

**Detection signals:** `electron`/`wails.json`/`tauri.conf.json`/`main` window code/UI components → end-user. `exports`/`main` in a package with no UI, `setup.py`/`pyproject` library layout, `go.mod` with no `main` package, `lib/`, public API docs → library. A repo can be both (an app with a plugin API): default to end-user and add one module on extending it, unless the user says otherwise.

If the user's request already names the audience ("for my users", "for developers integrating this"), follow it. If it is genuinely ambiguous *and* the user is present, ask one question: *"Who is this course for — people using the app, or developers building with it?"* Otherwise pick using the signals above and say which mode you chose in your final message.

### One optional question about goals

For end-user and library courses, the author usually knows their users better than the code does. If the user is present, you may ask **one** short question before building: *"Anything I should know about who uses this and what they most need to do? (Optional — I'll infer it from the code otherwise.)"* Never block on it; if there's no answer, infer and proceed. Do **not** present the curriculum for approval — just build it.

---

## Phase 1: Analysis

Read the mode's reference file now — it lists exactly what to extract. For every mode:

- Read the README, docs folder, CHANGELOG / release notes and the main entry points first. They tell you what the author *intends* to be a feature; the code tells you what's *true*.
- **Never invent features.** Only teach what exists in the code on the default branch. Skip anything behind a disabled feature flag, marked experimental/internal, or dead code. If unsure whether something is user-facing, leave it out or mark it as advanced.
- **Copy exact strings.** Menu labels, button text, settings names, error messages, CLI flags, function signatures — copy them verbatim from the source (i18n files, menu templates, component JSX, argument parsers). An exact label the learner can find on screen is worth more than a paraphrase.
- Note the **product version** (package.json / wails.json / tags) — the course cover shows it.

## Phase 1.5: Screenshots (end-user mode)

End-user courses are much better with real screenshots. Read `references/screenshots.md` and follow it in order: use screenshots the user supplied → capture them yourself with `references/capture.cjs` (works for Electron apps and for Wails / web UIs via their dev server) → fall back to clearly-labeled HTML illustrations. Never spend more than a few attempts fighting a build; fall back and tell the user how to supply screenshots.

Library and internals courses don't need screenshots.

## Phase 2: Curriculum Design

Use the module arc from the mode's reference file. General rules for all modes:

- **4–7 modules.** Fewer, better modules beat many thin ones. Very feature-rich apps may use up to 8, with the final one being the reference/feature map.
- Every module answers **"why should I care?"** before "how does it work?" — in terms of what the learner can *do* afterwards.
- Each module: 3–6 **screens** (sub-sections), at least one **quiz**, at least one **hero visual** (tour, animation, diagram), and **glossary tooltips** on every term the audience might not know.
- **Required across the course** — each mode's reference lists its mandatory elements (e.g. end-user: a UI tour, a workflow flow animation, platform-aware shortcuts, a feature map).
- Fresh metaphor per concept; never "restaurant" (see `references/content-philosophy.md`).

**Choose a build path:**
- **Simple project** (≤5 modules, one main workflow) → Phase 3 Sequential.
- **Complex project** (6+ modules, many features or services) → Phase 2.5 then Phase 3 Parallel.

### Phase 2.5: Module Briefs (complex projects only)

Write one brief per module to `course-name/briefs/0N-slug.md` using `references/module-brief-template.md`, following `references/content-philosophy.md`. Briefs carry everything a writing agent needs — pre-extracted exact labels, snippets, screenshots with hotspot coordinates, and the interactive elements to build — so writing agents never read the repository.

---

## Phase 3: Build the Course

The course is a **directory**. CSS and JS are pre-built — never regenerate them. You write only HTML content.

```
course-name/
  styles.css        ← copied verbatim from references/styles.css
  main.js           ← copied verbatim from references/main.js
  _base.html        ← customized shell (title + accent color)
  _footer.html      ← copied verbatim from references/_footer.html
  build.sh          ← copied verbatim from references/build.sh
  build.ps1         ← copied verbatim from references/build.ps1 (Windows)
  screenshots/      ← PNGs (end-user mode), referenced as screenshots/NN-name.png
  briefs/           ← complex projects only; delete after build
  modules/
    00-cover.html   ← course hero (recommended)
    01-slug.html
    ...
  index.html        ← assembled by build.sh / build.ps1 — never write by hand
```

**Step 1 — Setup.** Create the directory and copy these verbatim (use `cp`, or Read + Write; never retype them): `references/styles.css`, `references/main.js`, `references/_footer.html`, `references/build.sh`, `references/build.ps1`.

**Step 2 — Customize `_base.html`.** Copy `references/_base.html` to `course-name/_base.html` with exactly two substitutions:
- Both `COURSE_TITLE` → the course title (e.g. "Getting the most out of Driftwood")
- `ACCENT_COLOR` → one hex color from the list in the file's comment (pick one that suits the product; all other shades derive from it)

The sidebar table of contents, progress, dark mode, platform switch and "up next" links are generated automatically by `main.js` from the modules — don't write them.

**Step 3 — Write modules.** Each module file contains only markup (no `<html>`, `<head>`, `<style>` or `<script>`). The structure:

```html
<section class="module" id="module-1">
  <div class="module-content">
    <header class="module-header animate-in">
      <span class="module-number">01</span><span class="module-meta">6 min</span>
      <h1 class="module-title">Meet the app</h1>
      <p class="module-subtitle">One line on what this module unlocks.</p>
    </header>
    <section class="screen animate-in">
      <h2 class="screen-heading">One idea per screen</h2>
      ...
    </section>
  </div>
</section>
```

Write `modules/00-cover.html` with a `.course-hero` (see the Course Hero pattern). Use HTML patterns from `references/interactive-elements.md` — read only the sections you need. Follow `references/design-system.md` for visual conventions.

- **Sequential path:** read `references/content-philosophy.md` and `references/gotchas.md`, then write modules one at a time.
- **Parallel path:** dispatch modules to subagents in batches of up to 3. Each receives its brief, `content-philosophy.md`, `gotchas.md`, and only the listed sections of `interactive-elements.md`. Afterwards, check consistency in the main context (terminology, tone, transitions, accent usage).

**Step 4 — Assemble.** `cd course-name && bash build.sh` → produces `index.html`. Where Bash isn't available (native Windows), run `powershell -NoProfile -ExecutionPolicy Bypass -File course-name\build.ps1` instead — it produces the identical file.

**Critical rules**
- Never regenerate `styles.css` or `main.js`; never add `<style>`/`<script>` in modules.
- Module ids are `module-1`, `module-2`, … in file order.
- `data-steps` JSON on flow animations must not contain raw apostrophes (see gotchas).
- Every screenshot `<img>` needs meaningful `alt` text.

## Phase 4: Review and Open

Run `build.sh` (or `build.ps1`), then check the result:
- If Playwright/Chromium is available, open `index.html`, check the browser console for errors, and screenshot a few modules in light and dark mode to catch layout problems.
- Walk through `references/gotchas.md`.
- Tell the user: which mode you chose and why, where the course is, what screenshots are real vs illustrations (and how to replace illustrations), and invite feedback.

---

## Design Identity

The look is a **modern, warm product-docs aesthetic** — think a beautifully designed handbook, not a slide deck. Full tokens in `references/design-system.md`. Non-negotiables:

- **Warm neutrals** in light mode (paper-like off-white, warm grays) and a matching **warm dark mode** — both are built in; never hard-code colors in modules, use tokens.
- **One confident accent** (vermillion by default). No purple gradients.
- **Typography with personality:** Bricolage Grotesque for display, Geist for body, JetBrains Mono for code and labels. Never Inter, Roboto, Arial or Space Grotesk.
- **Generous whitespace**, max 2–3 sentences per text block, at least 50% visual per screen.
- **Depth without harshness:** 1px warm borders plus soft layered shadows.
- **Dark IDE-style code blocks** with Catppuccin-inspired highlighting.

## Reference Files

Read each only when you reach its phase.

- `references/audience-end-user.md` — end-user mode: what to extract, module arc, required elements, quiz style, tone. (Step 0)
- `references/audience-library.md` — library mode: same, for developer onboarding. (Step 0)
- `references/audience-internals.md` — internals mode (the original "how the code works" course). (Step 0, only on request)
- `references/screenshots.md` — how to get screenshots of Electron / Wails / web apps, and hotspot coordinates. (Phase 1.5)
- `references/capture.cjs` — Playwright capture script used by `screenshots.md`.
- `references/content-philosophy.md` — visual density, metaphors, tooltips, quiz design, accuracy rules. (Phases 2.5–3)
- `references/module-brief-template.md` — brief template for the parallel path. (Phase 2.5)
- `references/interactive-elements.md` — HTML patterns for every element. (Phase 3)
- `references/design-system.md` — tokens, typography, layout, theming rules. (Phase 3)
- `references/gotchas.md` — failure checklist. (Phases 3–4)
