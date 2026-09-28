# Screenshots for End-User Courses

> **When to read this:** Phase 1.5, end-user mode only. Real screenshots are the single biggest quality lever for an app course — learners need to *recognize* what they see on screen.

Try the sources below **in order**. Stop at the first that works. Budget: if building/launching the app fails after ~3 focused attempts, fall back to the next option rather than sinking time into the build.

---

## Option 1 — Screenshots the user already has

Check, in this order:
1. A folder the user pointed you to
2. `docs/`, `screenshots/`, `assets/`, `media/`, `.github/` in the repo — and images referenced from the README
3. Store-listing or website images in the repo (`build/`, `resources/`, `website/`)

Copy the useful ones into `course-name/screenshots/` with descriptive, ordered names (`01-main-window.png`). Check each is **current** — compare visible labels with the code; skip images showing UI that no longer exists.

To place hotspots on a supplied image, estimate positions as percentages of the image's width/height (open it with Read to look at it). Put markers at a **corner** of the control, not its center, so they don't hide its label.

---

## Option 2 — Capture them yourself with `capture.cjs`

`references/capture.cjs` drives the app with Playwright, saves PNGs, and writes `hotspots.json` with **exact** `--x/--y` marker positions and highlight regions computed from real element positions — ready to paste into `.hotspot` buttons.

### Prerequisites
- Node 18+, and Playwright available to Node: `npm i -D playwright` in the app repo (don't commit it — or install in a scratch dir and run with `NODE_PATH="$(npm root -g)"` for a global install). Use a preinstalled Chromium if the environment provides one; don't download browsers unnecessarily.
- The app's own dependencies installed (`npm ci` / `go mod download` …).
- **Linux without a display** (CI, cloud containers): prefix Electron runs with `xvfb-run -a`.

### A. Electron apps

1. Install and build: `npm ci`, then the project's build step if the main process or renderer must be compiled first (look at `package.json` scripts: `build`, `compile`, `electron-vite build`, `tsc`…).
2. Write `shots.json` next to the course (not in the app repo):
   ```json
   {
     "target": { "electron": "../my-app", "args": ["--no-sandbox"] },
     "outDir": "screenshots",
     "viewport": { "width": 1280, "height": 800 },
     "shots": [
       { "name": "01-main-window",
         "hotspots": [
           { "selector": "button:has-text('New Note')", "title": "New Note", "desc": "Creates a blank note in the selected notebook." },
           { "selector": "[data-testid=search]", "title": "Quick search", "desc": "Searches the text of every note." }
         ] },
       { "name": "02-settings", "steps": [ { "press": "Control+Comma" }, { "waitFor": ".settings-dialog" } ],
         "clip": ".settings-dialog" }
     ]
   }
   ```
   `target.electron` is the directory whose `package.json` `main` points at the main process (use the built output directory if the project compiles it). The script uses the app's own `electron` package automatically.
3. Run: `xvfb-run -a node path/to/references/capture.cjs shots.json` (omit `xvfb-run` on macOS/Windows or when a display exists).

**Electron gotchas**
- Apps showing a first-run wizard, login or update prompt: add `steps` to dismiss them, or pass an env var/flag the app supports (check the code for `--skip-onboarding`-style switches or env checks).
- Use an **isolated profile** so you don't touch real user data: most apps honour `--user-data-dir=/tmp/course-profile` (Electron's standard switch) — add it to `args`.
- Native menus (the OS menu bar) are **not** part of the page and can't be screenshotted this way. Teach menu commands with `.menu-path` instead.
- Native dialogs (open/save) block automation; don't trigger them.

### B. Wails apps

Wails renders the frontend in a webview; its dev mode also serves it to a normal browser **with Go bindings working**.

1. Requirements: Go, the Wails CLI (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`, or `wails3` for v3 projects — check `wails.json`/`go.mod`), frontend deps (`cd frontend && npm ci`). On Linux, building also needs the WebKitGTK dev packages (`libwebkit2gtk-4.0-dev` or `-4.1-dev`), which may not be installable in a sandbox — if so, use step 4.
2. Start dev mode in the background: `wails dev` (v2) or `wails3 dev` (v3). Read the **browser URL** it prints (v2 default: `http://localhost:34115`).
3. Use `"target": { "url": "http://localhost:34115" }` in `shots.json` and run `node capture.cjs shots.json` (no xvfb needed — this is plain headless Chromium).
4. **If the Go side can't build:** run only the frontend dev server (`cd frontend && npm run dev`, typically Vite on `:5173`) and stub the bindings with an `initScript`, returning realistic sample data shaped like the Go structs:
   ```js
   // stubs.js — referenced as "initScript": "stubs.js"
   window.go = { main: { App: {
     ListNotes: async () => [{ ID: 1, Title: "Trip packing list", Updated: "2 min ago" }],
     GetSettings: async () => ({ AutosaveMs: 800, Theme: "system" })
   } } };
   window.runtime = { EventsOn() {}, EventsOff() {}, EventsEmit() {}, WindowSetTitle() {}, LogInfo() {} };
   ```
   Find the binding names in `frontend/wailsjs/go/**` (v2) or `frontend/bindings/**` (v3).

### C. Other web-based UIs (Tauri, web apps, Electron renderers via Vite)
Same as B.4: start the frontend dev server, point `target.url` at it, stub any native bridge (`window.__TAURI__`, `window.electronAPI` from the preload script) in `initScript`.

### Making good screenshots
- **Realistic sample content.** An empty app teaches nothing. Seed plausible, friendly data (via `steps` that create items, a demo/sample-data flag if the app has one, or stubs). Never capture real personal data, tokens or file paths containing a username.
- **One idea per screenshot.** Use `clip` to capture just a dialog or panel when the whole window is noise.
- **Consistent size.** Keep one viewport (1280×800 is a good default) for all full-window shots.
- **Light theme by default** (`"colorScheme": "light"` in url mode) unless the app is dark-only.
- After capture, **look at every image** (Read it) before using it. Re-capture anything with spinners, toasts, hover artifacts or half-loaded content (add `wait`/`waitFor` steps).

### Using the output
`screenshots/hotspots.json` contains, per shot, a ready-made `html` string for each hotspot:
```html
<button class="hotspot" style="--x:9%;--y:0.8%" data-title="New Note" data-desc="Creates a blank note…" data-region="1%,0.8%,8%,3.9%"></button>
```
Paste these inside the `.app-window-body` of a `.ui-tour` (see `interactive-elements.md` → UI Tour). Put the numbers in the order you want the tour to run.

---

## Option 3 — Illustrations (last resort)

When the app can't be run and no screenshots exist:
- Use `.app-window.is-illustration` (shows an "Illustration" badge) with a **simple, schematic** HTML recreation of the layout — regions labeled with their real names (from the code), not a pixel-perfect fake.
- Prefer teaching with `.menu-path`, `kbd`, `.action-result` and `.step-cards`, which don't need images.
- In your final message, list which screens are illustrations and tell the user exactly how to add real screenshots: drop PNGs into `course-name/screenshots/` with the listed names, or run `capture.cjs` on a machine where the app runs, then re-run `build.sh`.
