# Interactive Elements Reference

HTML patterns for every element a course can use. **Read only the sections you need.**

> **Wiring:** all CSS and JS live in `styles.css` and `main.js`, copied verbatim into every course. Modules contain markup only — never `<style>` or `<script>`. Every engine auto-initializes by scanning for the class names and `data-*` attributes shown here; buttons are bound automatically (inline `onclick` also still works). Colors come from tokens (`var(--color-actor-2)`), never hex values.

Tags: **[all]** any mode · **[user]** end-user mode · **[lib]** library mode · **[int]** internals mode

## Table of Contents
**Structure:** Module Skeleton · Course Hero · Wide Blocks
**Teaching:** Code Blocks & Terminal · Code ↔ English Translation · Action ↔ Result · Callouts · Pattern Cards · Numbered Step Cards · Flow Steps · Icon Rows · File Tree · Badge List · Glossary Tooltips · Tabs
**Interactive:** Multiple-Choice Quiz · Scenario Quiz · Drag-and-Drop · Group Chat · Flow Animation · Architecture / UI Map · Spot the Bug / Mistake · Layer Toggle
**End-user:** Keys & Shortcuts · Menu Paths · App Window · UI Tour · Setting Cards · Error Cards · Try-It Checklist · Feature Map
**Library:** API Card · Do / Don't Comparison

---

## Module Skeleton  [all]

```html
<section class="module" id="module-2">
  <div class="module-content">
    <header class="module-header animate-in">
      <span class="module-number">02</span><span class="module-meta">7 min</span>
      <h1 class="module-title">From idea to exported PDF</h1>
      <p class="module-subtitle">The core workflow, end to end.</p>
    </header>

    <section class="screen animate-in">
      <h2 class="screen-heading">One idea per screen</h2>
      <p class="lead">Optional larger intro sentence.</p>
      <!-- elements -->
    </section>
  </div>
</section>
```
- `id` is `module-N` in file order. The sidebar, top-bar title, progress and the "Up next" card at the end of each module are generated from `.module-title` — don't write them.
- `.module-meta` is optional (reading time, or "reference").
- `.screen-subheading` (h3) is available for a second level.
- Add `animate-in` to screens/headers for scroll reveal; wrap card grids in `stagger-children` to cascade them.

## Course Hero  [all]

Put in `modules/00-cover.html` (outside any `.module`, so it isn't in the table of contents).
```html
<header class="course-hero" id="top">
  <div class="course-hero-inner">
    <span class="hero-eyebrow">Interactive course</span>
    <h1 class="hero-title">Get more out of <em>Driftwood</em></h1>
    <p class="hero-subtitle">One sentence promise: what the learner can do after this course.</p>
    <div class="hero-meta">
      <span class="hero-chip">⏱ 25 minutes</span>
      <span class="hero-chip">🧭 5 modules</span>
      <span class="hero-chip">🖥 v2.4 · macOS / Windows / Linux</span>
    </div>
    <div class="hero-cta">
      <a class="btn btn-primary btn-lg" href="#module-1">Start the course →</a>
    </div>
    <!-- optional: <div class="hero-visual"><div class="app-window">…</div></div> -->
  </div>
</header>
```
`<em>` in the title renders in the accent color. Library courses: use an install chip, e.g. `<span class="hero-chip"><code>npm i driftwood</code></span>`.

## Wide Blocks  [all]

Content is 760px wide. Add `wide-block` to a screenshot, tour, feature map or diagram to let it break out to 1040px:
```html
<div class="ui-tour wide-block">…</div>
```

---

## Code Blocks & Terminal  [all]

Standalone code with a file header. A copy button is added automatically.
```html
<div class="code-block">
  <div class="code-header"><span class="code-file">src/config/defaults.ts</span><span class="code-lang">ts</span></div>
  <pre><code><span class="code-keyword">export const</span> <span class="code-property">AUTOSAVE_MS</span> = <span class="code-number">800</span>;</code></pre>
</div>
```
Terminal — `.prompt` and `.output` spans are excluded from what gets copied:
```html
<div class="terminal">
  <div class="code-header">Terminal</div>
  <pre><span class="prompt">$ </span>driftwood open "Trip packing list"
<span class="output">Opened in existing window.</span></pre>
</div>
```
Syntax classes: `code-keyword`, `code-string`, `code-function`, `code-comment`, `code-number`, `code-property`, `code-operator`, `code-type`, `code-tag`, `code-attr`, `code-value`. Wrap lines in `<span class="code-line">`; add `hl` to highlight one (`<span class="code-line hl">`). Escape `<`, `>` and `&` in code. Add `data-no-copy` to suppress the copy button. Code wraps — there is never a horizontal scrollbar.

Inline code in prose: `<code>untitled.md</code>` (styled as a chip).

## Code ↔ English Translation  [int] [lib] (end-user: only for things users type)

Real code on the left, plain-English line-by-line on the right.
```html
<div class="translation-block animate-in">
  <div class="translation-code">
    <span class="translation-label">Code</span>
    <span class="translation-file">examples/export.ts</span>
    <pre><code><span class="code-line"><span class="code-keyword">const</span> doc = <span class="code-keyword">await</span> driftwood.<span class="code-function">open</span>(<span class="code-string">"notes/trip.md"</span>);</span>
<span class="code-line hl"><span class="code-keyword">const</span> pdf = <span class="code-keyword">await</span> doc.<span class="code-function">export</span>(<span class="code-string">"pdf"</span>);</span></code></pre>
  </div>
  <div class="translation-english">
    <span class="translation-label">Plain English</span>
    <div class="translation-lines">
      <p class="tl">Load a note from disk and wait until it's ready.</p>
      <p class="tl">Render it to PDF — the same renderer the app uses.</p>
    </div>
  </div>
</div>
```
- One English line per 1–2 code lines. Explain the *why*, not just the *what*.
- `translation-file` is optional (shows the source path).

## Action ↔ Result  [user]

The end-user equivalent of a translation block: what you do, and what happens.
```html
<div class="action-result animate-in">
  <div class="action-col">
    <div class="action-col-label">You do</div>
    <ol class="action-steps">
      <li>Select the <strong>Travel</strong> notebook</li>
      <li>Choose <span class="menu-path"><span>File</span><span>New Note</span></span></li>
    </ol>
  </div>
  <div class="action-col">
    <div class="action-col-label">What happens</div>
    <ol class="action-steps">
      <li>The notebook becomes the destination folder</li>
      <li>A new file appears in it, named after your title</li>
    </ol>
  </div>
</div>
```
Labels can be changed ("You type" / "You see"). Rows should correspond one-to-one.

## Callouts  [all]

Max two per module.
```html
<div class="callout callout-accent">
  <div class="callout-icon">💡</div>
  <div class="callout-content">
    <strong class="callout-title">Why this matters</strong>
    <p>One or two sentences.</p>
  </div>
</div>
```
Variants: `callout-accent` (key insight), `callout-info` (good to know), `callout-tip` (pro tip, green), `callout-caution` (heads-up, amber), `callout-warning` (common mistake / data loss, red).

## Pattern Cards  [all]

Grid of concepts, features or core objects.
```html
<div class="pattern-cards stagger-children">
  <div class="pattern-card animate-in">
    <div class="pattern-icon">📓</div>
    <h4 class="pattern-title">Notebooks</h4>
    <p class="pattern-desc">Folders for grouping notes — like drawers in a filing cabinet.</p>
  </div>
  <!-- 2–6 cards -->
</div>
```
Optional per-card color: `style="--color-accent: var(--color-actor-2)"` on `.pattern-card` tints its icon.

## Numbered Step Cards  [all]

A vertical timeline for sequences. Steps can contain screenshots or code.
```html
<div class="step-cards">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-body">
      <strong>Create the note</strong>
      <p>Press <span class="keys"><kbd data-mac="⌘" data-win="Ctrl">Ctrl</kbd><kbd>N</kbd></span>.</p>
    </div>
  </div>
</div>
```

## Flow Steps  [all]

Compact horizontal sequence (stacks on mobile).
```html
<div class="flow-steps">
  <div class="flow-step"><div class="flow-step-num">1</div><p>Type</p></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-step-num">2</div><p>Pause 0.8s</p></div>
  <div class="flow-arrow">→</div>
  <div class="flow-step"><div class="flow-step-num">3</div><p>Saved</p></div>
</div>
```

## Icon Rows  [all]

```html
<div class="icon-rows">
  <div class="icon-row">
    <div class="icon-circle">🍎</div>
    <div><strong>macOS 12+</strong><p>Apple silicon and Intel</p></div>
  </div>
</div>
```

## File Tree  [all]

Internals: the repo. End-user: where the user's data lives. Library: the package layout they import from.
```html
<div class="file-tree">
  <div class="ft-folder"><span class="ft-name">Driftwood/</span><span class="ft-desc">Your library</span>
    <div class="ft-children">
      <div class="ft-folder"><span class="ft-name">Travel/</span><span class="ft-desc">A notebook is a folder</span></div>
      <div class="ft-file"><span class="ft-name">Ideas.md</span><span class="ft-desc">A note is a file</span></div>
    </div>
  </div>
</div>
```

## Badge List  [all]

Flags, permissions, config keys with one-line meanings.
```html
<div class="badge-list">
  <div class="badge-item"><code class="badge-code">--safe-mode</code><span class="badge-desc">Starts without plugins</span></div>
</div>
```

## Glossary Tooltips  [all]

```html
<span class="term" data-definition="A simple text format where # makes a heading. Any editor can open it.">Markdown</span>
```
- Shows on hover, keyboard focus or tap; title is the term's text (override with `data-term="…"`).
- First use per module only. 1–2 sentences, everyday language, a metaphor when it helps.
- Density depends on mode — see the audience file.

## Tabs  [all]

Generic tabs. Panels pair with tabs by order.
```html
<div class="tabs" data-tab-group="platform">
  <div class="tab-list">
    <button class="tab" data-tab="mac">macOS</button>
    <button class="tab" data-tab="win">Windows</button>
    <button class="tab" data-tab="linux">Linux</button>
  </div>
  <div class="tab-panel"><p>…</p></div>
  <div class="tab-panel"><p>…</p></div>
  <div class="tab-panel"><p>…</p></div>
</div>
```
- `data-tab-group` syncs every tabs block sharing the name (choose Python once, every code sample switches).
- `data-tab-group="platform"` with keys `mac` / `win` / `linux` also follows the learner's OS and the top-bar platform switch.
- Library courses with several languages: `data-tab-group="lang"` with `data-tab="python"`, `data-tab="go"`, … Put a `.code-block` directly inside each `.tab-panel`.

---

## Multiple-Choice Quiz  [all]

```html
<div class="quiz-container" id="quiz-module3">
  <div class="quiz-question-block"
       data-correct="b"
       data-explanation-right="Because notes are plain files, any folder-sync tool works."
       data-explanation-wrong="There's no account system — notes are ordinary files you can sync yourself.">
    <h3 class="quiz-question">You want your notes on a second laptop. What's the simplest route?</h3>
    <div class="quiz-options">
      <button class="quiz-option" data-value="a"><div class="quiz-option-radio"></div><span>Export everything as PDF</span></button>
      <button class="quiz-option" data-value="b"><div class="quiz-option-radio"></div><span>Keep the library in a synced folder</span></button>
      <button class="quiz-option" data-value="c"><div class="quiz-option-radio"></div><span>Sign in on both machines</span></button>
    </div>
    <div class="quiz-feedback"></div>
  </div>
  <!-- 3–5 question blocks -->
  <button class="quiz-check-btn">Check answers</button>
  <button class="quiz-reset-btn">Try again</button>
</div>
```
- Letters (A, B, C) and ✓/✕ marks are drawn automatically in `.quiz-option-radio`.
- Change the "Check your understanding" label with `data-label="…"` on `.quiz-container`.
- Explanations can contain simple HTML (`<code>`, `<strong>`). Use `&quot;` for quotes inside attributes.

## Scenario Quiz  [all]

Same as above; wrap the question in a scenario:
```html
<div class="quiz-question-block" data-correct="a" data-explanation-right="…" data-explanation-wrong="…">
  <div class="scenario-block">
    <div class="scenario-context">
      <span class="scenario-label">Scenario</span>
      <p>Sam's laptop died mid-save. When they reopen the app, a note shows an older version…</p>
    </div>
  </div>
  <h3 class="quiz-question">What should Sam do first?</h3>
  <div class="quiz-options">…</div>
  <div class="quiz-feedback"></div>
</div>
```

## Drag-and-Drop Matching  [all]

Works with mouse drag, and with tap-a-chip-then-tap-a-target (touch and keyboard).
```html
<div class="dnd-container" id="dnd-2">
  <p class="dnd-instructions">Drag each feature onto the job it does best — or tap a feature, then a job.</p>
  <div class="dnd-chips">
    <div class="dnd-chip" data-answer="tags">Tags</div>
    <div class="dnd-chip" data-answer="notebooks">Notebooks</div>
  </div>
  <div class="dnd-zones">
    <div class="dnd-zone" data-correct="notebooks">
      <p class="dnd-zone-label">Keep work and personal notes apart</p>
      <div class="dnd-zone-target">Drop here</div>
    </div>
    <div class="dnd-zone" data-correct="tags">
      <p class="dnd-zone-label">Mark everything that's still to-do, across projects</p>
      <div class="dnd-zone-target">Drop here</div>
    </div>
  </div>
  <button class="btn btn-primary dnd-check-btn">Check matches</button>
  <button class="btn btn-ghost dnd-reset-btn">Reset</button>
</div>
```

## Group Chat Animation  [all]

Actors "talking" in a messenger-style thread, revealed one message at a time.
```html
<div class="chat-window" id="chat-module2">
  <div class="chat-header">#main-window <span class="chat-members">3 members</span></div>
  <div class="chat-messages">
    <div class="chat-message me" data-sender="you">
      <div class="chat-avatar" style="background: var(--color-actor-1)">Y</div>
      <div class="chat-bubble"><span class="chat-sender">You</span><p>Where did my shopping list go?</p></div>
    </div>
    <div class="chat-message" data-sender="sidebar">
      <div class="chat-avatar" style="background: var(--color-actor-2)">S</div>
      <div class="chat-bubble"><span class="chat-sender" style="color: var(--color-actor-2)">Sidebar</span><p>It's in Recipes — click that notebook.</p></div>
    </div>
  </div>
  <div class="chat-typing" style="display:none">
    <div class="chat-avatar">?</div>
    <div class="chat-typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
  </div>
  <div class="chat-controls">
    <button class="btn btn-primary chat-next-btn">Next message</button>
    <button class="btn chat-all-btn">Play all</button>
    <button class="btn btn-ghost chat-reset-btn">Replay</button>
    <span class="chat-progress"></span>
  </div>
</div>
```
- `me` on a message right-aligns it in the accent color — use it for "You" (end-user) or "Your code" (library).
- `.chat-header` is optional. Messages start hidden automatically.
- Actor colors: `--color-actor-1` … `--color-actor-6`; keep each actor's color consistent across the course.

## Flow Animation  [all]

Step-by-step highlight of actors with a packet travelling between them.
```html
<div class="flow-animation" data-steps='[
  {"highlight":"flow-you","label":"You choose File › Export › PDF"},
  {"highlight":"flow-app","label":"The app renders your note","packet":true,"from":"you","to":"app"},
  {"highlight":"flow-disk","label":"The PDF is saved where you chose","packet":true,"from":"app","to":"disk"}
]'>
  <div class="flow-actors">
    <div class="flow-actor" id="flow-you"><div class="flow-actor-icon">🙂</div><span>You</span></div>
    <div class="flow-actor" id="flow-app"><div class="flow-actor-icon">🪵</div><span>Driftwood</span></div>
    <div class="flow-actor" id="flow-disk"><div class="flow-actor-icon">💾</div><span>Your disk</span></div>
  </div>
  <div class="flow-step-label">Press Play or Next step to begin</div>
  <div class="flow-controls">
    <button class="btn btn-primary flow-play-btn">▶ Play</button>
    <button class="btn flow-next-btn">Next step</button>
    <button class="btn btn-ghost flow-reset-btn">Restart</button>
    <span class="flow-progress"></span>
  </div>
</div>
```
- Actor ids are `flow-<name>`. In steps, `highlight` is the full id; `from`/`to` are the `<name>` part (full ids also work).
- 3–5 actors; 3–8 steps. Progress dots are added automatically.
- **Never put a raw apostrophe in `data-steps`** — the attribute is single-quoted. Write "the users file" → "the user&apos;s file", or rephrase.

## Architecture / UI Map  [all]

Clickable components grouped in zones; clicking shows a description. Internals: services. End-user: regions of the window. Library: public types.
```html
<div class="arch-diagram">
  <div class="arch-zone">
    <div class="arch-zone-label">Main window</div>
    <div class="arch-component" data-desc="Switch between notebooks and tags."><div class="arch-icon">🗂</div><span>Sidebar</span></div>
    <div class="arch-component" data-desc="Where you write. Saves automatically."><div class="arch-icon">✍️</div><span>Editor</span></div>
  </div>
  <div class="arch-description">Click any part to learn what it does.</div>
</div>
```

## Spot the Bug / Spot the Mistake  [all]

Code version (internals, library):
```html
<div class="bug-challenge">
  <h3>Which line leaks a connection?</h3>
  <div class="bug-code">
    <div class="bug-line" onclick="checkBugLine(this, false)" data-hint="Opening is fine."><span class="line-num">1</span><code>client, err := driftwood.Open(path)</code></div>
    <div class="bug-line" onclick="checkBugLine(this, true)" data-explanation="The early return skips client.Close(). Use defer right after Open."><span class="line-num">2</span><code>if err != nil { return err }</code></div>
  </div>
  <div class="bug-feedback"></div>
</div>
```
Workflow version (end-user) — add `steps` to `.bug-code` for a light, prose style:
```html
<div class="bug-code steps">
  <div class="bug-line" onclick="checkBugLine(this, true)" data-explanation="Delete only after confirming the copy works."><span class="line-num">2</span><code>Delete the library folder from the old laptop</code></div>
</div>
```

## Layer Toggle  [int]

Prefer **Tabs** for new courses. Legacy pattern (still supported):
```html
<div class="layer-demo">
  <div class="layer-tabs">
    <button class="layer-tab active" onclick="showLayer('layer-html', this)" data-desc="Raw structure">HTML</button>
    <button class="layer-tab" onclick="showLayer('layer-css', this)" data-desc="Now styled">+ CSS</button>
  </div>
  <div class="layer-viewport">
    <div class="layer" id="layer-html" style="display:block">…</div>
    <div class="layer" id="layer-css" style="display:none">…</div>
  </div>
  <p class="layer-description">Raw structure</p>
</div>
```

---

## Keys & Shortcuts  [user] [lib]

Platform-aware keys: the label switches with the learner's OS (auto-detected, and changeable with the top-bar switch, which appears automatically when a course uses these attributes).
```html
<span class="keys"><kbd data-mac="⌘" data-win="Ctrl">Ctrl</kbd><kbd data-mac="⇧" data-win="Shift">Shift</kbd><kbd>M</kbd></span>
```
- Linux falls back to `data-win` unless `data-linux` is given. Use the mac symbols ⌘ ⌥ ⇧ ⌃ and Windows words Ctrl / Alt / Shift.
- Electron `CmdOrCtrl` → `data-mac="⌘" data-win="Ctrl"`. `Alt` → `data-mac="⌥" data-win="Alt"`.
- Platform-only content: `<p data-platform-only="mac">…</p>` (space-separate several: `"win linux"`).

Shortcut cheat sheet:
```html
<div class="shortcut-list">
  <div class="shortcut"><span class="shortcut-desc">Quick search</span><span class="keys"><kbd data-mac="⌘" data-win="Ctrl">Ctrl</kbd><kbd>K</kbd></span></div>
</div>
```

## Menu Paths  [user]

Always show commands as their exact menu path:
```html
<span class="menu-path"><span>File</span><span>Export</span><span>PDF…</span></span>
```
Separators are drawn automatically. Copy the labels exactly, including the ellipsis. Works for Settings panes too: `Settings › Editor › Autosave`.

## App Window  [user]

A framed screenshot.
```html
<div class="app-window">
  <div class="app-window-bar"><span class="app-window-title">Driftwood — All Notes</span></div>
  <div class="app-window-body">
    <img src="screenshots/01-main-window.png" alt="Main window: sidebar on the left, note list, and editor">
  </div>
  <div class="app-window-caption">Optional caption.</div>
</div>
```
- `is-illustration` on `.app-window` adds an "Illustration" badge — required when the body is an HTML mock-up rather than a real screenshot.
- For a clipped dialog/panel screenshot, the frame is still appropriate; set the title to the dialog's name.

## UI Tour  [user]

A screenshot with numbered hotspots and an explanation panel with Start / Next / Back.
```html
<div class="ui-tour wide-block" data-title="The main window" data-intro="Six areas do all the work. Click a marker or press Start.">
  <div class="app-window">
    <div class="app-window-bar"><span class="app-window-title">Driftwood</span></div>
    <div class="app-window-body">
      <img src="screenshots/01-main-window.png" alt="Driftwood main window">
      <button class="hotspot" style="--x:9%;--y:1.6%" data-title="New Note"
              data-desc="Creates a blank note. Shortcut: <kbd data-mac='⌘' data-win='Ctrl'>Ctrl</kbd> <kbd>N</kbd>"
              data-region="1%,0.5%,8%,4.2%"></button>
      <!-- more hotspots, in tour order -->
    </div>
  </div>
</div>
```
- `--x` / `--y`: marker position as % of the image. `data-region`: optional highlight box `x,y,width,height` in % (dims the rest of the screenshot). `capture.cjs` generates both — see `screenshots.md`.
- Place markers at a control's corner, not its center, so they don't cover its label.
- Markers are numbered automatically; the panel is generated. `data-desc` may contain simple HTML — use **single quotes** for attributes inside it (the outer attribute is double-quoted). Platform-aware `<kbd>` keys work there too.
- 4–8 hotspots per tour.

## Setting Cards  [user] [lib]

```html
<div class="setting-list">
  <div class="setting-card">
    <span class="setting-name">Autosave delay</span>
    <span class="setting-default">800 ms</span>
    <span class="setting-where"><span class="menu-path"><span>Settings</span><span>Editor</span></span></span>
    <p class="setting-effect">How long the app waits after you stop typing before saving. <strong>Lower it</strong> if your laptop battery is unreliable.</p>
  </div>
</div>
```
Defaults must come from the code. Only include settings worth changing — the feature map can list the rest.

## Error Cards  [user] [lib]

```html
<div class="error-card">
  <div class="error-message">Could not save "Trip packing list": EACCES permission denied</div>
  <div class="error-body">
    <div><h4>What it means</h4>Your computer refused to let the app write to the library folder.</div>
    <div><h4>How to fix it</h4>Choose <span class="menu-path"><span>Settings</span><span>Library</span><span>Change…</span></span> and pick a folder in Documents.</div>
  </div>
</div>
```
Add `is-warning` for warnings/confirmations. The message text must match the app's exactly (placeholders like `%s` become a realistic example). Library mode: the message is the error type/code, e.g. `ErrRateLimited (HTTP 429)`.

## Try-It Checklist  [user] [lib]

A short hands-on task list; ticks persist in the learner's browser.
```html
<div class="try-it" id="tryit-first-note">
  <div class="try-it-header"><span class="try-it-title">Try it in the app</span></div>
  <ul>
    <li><label><input type="checkbox"><span>Create a note called "Test drive"</span></label></li>
    <li><label><input type="checkbox"><span>Export it as a PDF</span></label></li>
  </ul>
</div>
```
Give each checklist a unique `id`. 2–5 items. Place after a workflow is taught.

## Feature Map  [user] [lib]

Searchable, filterable map of every feature (or every public API) — the final module's centerpiece.
```html
<div class="feature-map wide-block">
  <div class="feature-map-controls">
    <input class="feature-search" type="search" placeholder="Search features…" aria-label="Search features">
    <button class="feature-filter" data-filter="all">All</button>
    <button class="feature-filter" data-filter="write">Writing</button>
    <button class="feature-filter" data-filter="share">Sharing</button>
  </div>
  <div class="feature-grid">
    <div class="feature-item" data-category="share" data-tags="pdf print">
      <span class="feature-name">Export as PDF</span>
      <span class="feature-how"><span class="menu-path"><span>File</span><span>Export</span><span>PDF…</span></span> · <a href="#module-2">Module 2</a></span>
    </div>
  </div>
</div>
```
- `data-category` may hold several space-separated categories; `data-tags` adds hidden search words (synonyms users might type).
- Every item says **how to reach it** (menu path, shortcut, or API name) and links to the module that teaches it, if any.

---

## API Card  [lib]

```html
<div class="api-card">
  <div class="api-signature"><span class="api-kind">method</span>doc.export(format: "pdf" | "html", options?: ExportOptions): Promise&lt;Uint8Array&gt;</div>
  <div class="api-body">
    <p class="api-summary">Renders the document. Throws <code>ExportError</code> if an image can't be read.</p>
    <table class="param-table">
      <thead><tr><th>Parameter</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>format</td><td>Output type.</td></tr>
        <tr><td>options.theme<span class="optional">optional</span></td><td>Theme name. Default <code>"paper"</code>.</td></tr>
      </tbody>
    </table>
    <p class="api-returns"><strong>Returns</strong>The file contents as bytes.</p>
  </div>
</div>
```
`api-kind`: function, method, class, type, interface, const, hook, command. The signature is copied exactly from source (escape `<` `>`).

## Do / Don't Comparison  [lib] (also [user] for workflows)

```html
<div class="compare">
  <div class="compare-col dont">
    <div class="compare-label">Don't</div>
    <div class="code-block"><pre><code>doc.export(<span class="code-string">"pdf"</span>);  <span class="code-comment">// no await</span></code></pre></div>
    <p>You get a Promise, not the bytes.</p>
  </div>
  <div class="compare-col do">
    <div class="compare-label">Do</div>
    <div class="code-block"><pre><code><span class="code-keyword">await</span> doc.export(<span class="code-string">"pdf"</span>);</code></pre></div>
    <p>Wait for rendering to finish.</p>
  </div>
</div>
```
For end-user workflows, replace the code block with `<p>` text.
