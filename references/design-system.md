# Design System Reference

> **When to read this:** Phase 3, when writing module HTML. Everything here is already implemented in `styles.css` — this file tells you which tokens and conventions to use so modules stay consistent. Never write CSS in modules.

## Table of Contents
1. Principles
2. Color Tokens
3. Light & Dark Mode
4. Typography
5. Spacing & Layout
6. Surfaces, Borders & Shadows
7. Motion
8. The Page Shell
9. Responsive Behavior
10. Syntax Highlighting

---

## 1. Principles

- **A beautiful handbook, not a slide deck.** Warm neutrals, one confident accent, generous whitespace, crisp 1px borders and soft layered shadows.
- **Tokens only.** In inline styles (e.g. chat avatar colors), use `var(--color-actor-2)` etc. Never hex values in modules — they break dark mode.
- **Visual first.** At least 50% of every screen is non-paragraph content.
- **Accessible by default.** Every interactive element is keyboard-reachable, focus rings are visible, motion respects `prefers-reduced-motion`, text meets contrast in both themes.

## 2. Color Tokens

| Token | Use |
|---|---|
| `--color-bg`, `--color-bg-alt` | Page background, subtle alternate band |
| `--color-surface`, `--color-surface-2`, `--color-surface-sunken` | Cards; secondary panels; wells / inputs |
| `--color-border`, `--color-border-light` | Card borders; dividers |
| `--color-text`, `--color-text-secondary`, `--color-text-muted` | Body; supporting text; labels & meta |
| `--color-accent` | **The** brand color for the course — set once in `_base.html` |
| `--color-accent-hover`, `--color-accent-light`, `--color-accent-muted`, `--color-accent-text`, `--color-accent-ring` | Derived automatically with `color-mix()` — never set these |
| `--color-success`, `--color-error`, `--color-info`, `--color-warning` (+ `-light`) | Feedback and callouts |
| `--color-actor-1` … `--color-actor-6` | Characters in chats, flows and diagrams (vermillion, teal, plum, gold, forest, rose) |
| `--color-bg-code`, `--color-code-text`, `--color-code-muted` | Code blocks (dark in both themes) |

**Accent choices** (pick one per course in `_base.html`): vermillion `#D94F30` (default), coral `#E06B56`, teal `#1F7A8C`, amber `#C98A1B`, forest `#2D8B55`, indigo `#4F5BD5`, rose `#C2577E`. Match the product: if the app has a brand color, choose the nearest option. Never purple gradients.

**Actor colors:** assign each recurring character one actor color and keep it for the whole course (the Sidebar is always teal, etc.).

## 3. Light & Dark Mode

Both themes are built in. `_base.html` applies the learner's saved choice or their OS preference before first paint; the moon/sun button in the top bar toggles it. All tokens are redefined for dark mode, so modules written with tokens work in both automatically.

Things that are **not** themed and must stay readable on both: screenshots (they're whatever the app looked like — capture in the app's light theme unless it's dark-only) and code blocks (always dark).

## 4. Typography

| Role | Font | Token |
|---|---|---|
| Display — hero, module & screen titles, quiz questions | **Bricolage Grotesque** (variable, 400–800) | `--font-display` |
| Body | **Geist** | `--font-body` |
| Code, labels, eyebrows, meta | **JetBrains Mono** | `--font-mono` |

Loaded once from Google Fonts in `_base.html`, with system-font fallbacks. Never use Inter, Roboto, Arial or Space Grotesk.

Scale (`--text-xs` … `--text-6xl`); headings above `2xl` are fluid (`clamp()`), so they shrink on small screens without breakpoints.

| Element | Class | Notes |
|---|---|---|
| Hero title | `.hero-title` | 6xl, 800, tight tracking; `<em>` = accent |
| Module eyebrow | `.module-number` | "MODULE 01 ——" mono label |
| Module title | `.module-title` | 5xl, balanced wrapping |
| Module subtitle | `.module-subtitle` | xl, secondary color, ≤ 52ch |
| Screen heading | `.screen-heading` | 3xl, 700 |
| Lead paragraph | `.lead` | lg, secondary color |
| Labels | `.element-label` | mono, uppercase, tracked |

## 5. Spacing & Layout

- Spacing scale `--space-1` (4px) … `--space-24` (96px).
- Reading column `--content-width: 760px`; wide column `--content-width-wide: 1040px` via `.wide-block`.
- Modules are separated by a hairline border and generous padding; no alternating backgrounds needed.
- Keep 3–4 short text blocks per screen at most; `.screen` elements are spaced `--space-16` apart.

## 6. Surfaces, Borders & Shadows

- Cards: `--color-surface` + 1px `--color-border` + `--shadow-sm`, radius `--radius-lg` (16px).
- Hover lift: `--shadow-md` and `translateY(-2px…-3px)`.
- Shadows are warm-tinted and layered (`--shadow-xs` … `--shadow-xl`); in dark mode they're neutral and deeper.
- Radii: `--radius-xs` 6 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 22 · `full`.

## 7. Motion

- Easing `--ease-out` for entrances, `--ease-spring` for playful pops (hotspots, checkmarks).
- Scroll reveal: add `animate-in`; cascade children with a `stagger-children` parent.
- All motion is disabled under `prefers-reduced-motion` (content shows immediately; chats/flows skip their delays).
- No scroll-snapping — the page scrolls freely.

## 8. The Page Shell

Generated by `_base.html` + `main.js`; nothing to write per module:
- **Top bar:** course title, current module, % progress, platform switch (only when the course uses platform-aware keys/tabs), theme toggle, progress line.
- **Sidebar:** numbered table of contents built from `.module-title`s; the current module is highlighted; modules get a ✓ once scrolled to the end (remembered per browser). On screens < 1200px it's a slide-over drawer behind the ☰ button.
- **Up-next card** at the end of every module, and a "Course complete" card at the end.
- **Keyboard:** `N` / `P` next/previous module, `Esc` closes the drawer and tooltips.
- **Print:** chrome is hidden and every module starts on a new page.

## 9. Responsive Behavior

- ≥ 1200px: persistent sidebar.
- ≤ 768px: two-column blocks (translation, action↔result, error body, compare) stack; flow-actor connector line hides; hotspots shrink.
- ≤ 640px: platform switch hides from the top bar (auto-detection still applies).
- ≤ 480px: tighter card padding; flow steps stack vertically.
- There must never be horizontal page scroll; code wraps.

## 10. Syntax Highlighting

Catppuccin-inspired on `--color-bg-code`:

| Class | Color | For |
|---|---|---|
| `.code-keyword` | purple | `if`, `return`, `const`, `func` |
| `.code-string` | green | strings |
| `.code-function` | blue | function/method names |
| `.code-type` | pink | type names |
| `.code-comment` | gray italic | comments |
| `.code-number` | peach | numbers |
| `.code-property` / `.code-attr` | yellow | object keys, attributes |
| `.code-operator` | teal | `=`, `=>`, `:=` |
| `.code-tag` | red-pink | HTML/JSX tags |
| `.code-value` | green | attribute values |

Highlight sparingly and accurately — a few correct colors beat many wrong ones.
