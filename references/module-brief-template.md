# Module Brief Template

> **When to read this:** Phase 2.5 (complex projects). Fill in one brief per module and save it to `course-name/briefs/0N-slug.md`. A brief gives a writing agent everything it needs to write one module **without reading the repository or SKILL.md** — so pre-extract every exact string, snippet and screenshot it will use.

---

## Module N: [Title]

### Course context
- **Mode:** end-user / library / internals
- **Audience in one line:** [e.g. "Office staff using Driftwood daily; no technical background"]
- **Accent & actor colors:** [e.g. accent vermillion; Sidebar = actor-2 teal, Editor = actor-3 plum]

### Teaching arc
- **Metaphor:** [fresh and specific — never "restaurant"]
- **Opening hook:** [one sentence from the learner's world / something they already do]
- **Key insight:** [the one thing they should walk away with]
- **Why should I care?:** [what they can do better after this module]

### Source material (pre-extracted, copy exactly)

**Exact UI strings / API names** (end-user & library):
- Menu paths: `File › Export › PDF…` (from src/main/menu.ts:42)
- Shortcuts: New note = `CmdOrCtrl+N` → `<kbd data-mac="⌘" data-win="Ctrl">Ctrl</kbd><kbd>N</kbd>`
- Settings: `Autosave delay` — default `800` ms (src/config/defaults.ts:3)
- Error messages: `Could not save "%s": %s` (src/main/save.ts:88) → example: `Could not save "Trip packing list": EACCES permission denied`
- Signatures: `doc.export(format, options?) → Promise<Uint8Array>` (src/document.ts:120)

**Screenshots** (end-user):
- `screenshots/01-main-window.png` — alt: "…" — hotspots (from hotspots.json):
  `<button class="hotspot" style="--x:9%;--y:1.6%" data-title="New Note" data-desc="…" data-region="…"></button>`
- Mark any mock-up as an illustration.

**Code snippets** (library / internals, and config files users edit):

File: examples/export.ts (lines 12–18)
```
[paste exact code]
```

### Elements to build
Tick what this module needs, with enough detail to build it.
- [ ] **Hero visual:** [UI tour / flow animation / diagram — details]
- [ ] **Action ↔ result** — steps: …
- [ ] **Code ↔ English** — which snippet
- [ ] **Quiz** — N questions; angle of each: …
- [ ] **Group chat** — actors (+ colors); message sequence: …
- [ ] **Flow animation** — actors; steps: …
- [ ] **Shortcut list / setting cards / error cards** — items: …
- [ ] **Try-it checklist** — id + items
- [ ] **Feature map** — categories; items with how-to-reach + module links
- [ ] **Other** — [pattern cards, do/don't, API card, drag-and-drop…]
- [ ] **Glossary terms** to define on first use: …

### Reference sections the writer needs
- `references/interactive-elements.md` → [section names only, e.g. "UI Tour", "Keys & Shortcuts", "Multiple-Choice Quiz"]
- `references/content-philosophy.md` → always
- `references/gotchas.md` → always
- `references/audience-<mode>.md` → "Who the learner is" and "Quizzes" sections

### Connections
- **Previous module:** [title — what it covered]
- **Next module:** [title — what it will cover] (the "Up next" card is automatic; this is for narrative transitions)
- **Terminology to keep consistent:** [e.g. always "notebook", never "folder", in prose]
