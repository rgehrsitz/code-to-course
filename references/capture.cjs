#!/usr/bin/env node
/**
 * PROJECT-TO-COURSE — SCREENSHOT CAPTURE
 *
 * Drives a running app with Playwright, takes screenshots for the course,
 * and computes UI-tour hotspot coordinates (as % of the image) from real
 * element positions, so markers land exactly on the controls they describe.
 *
 * Usage (see references/screenshots.md for the full guide):
 *   node capture.cjs shots.json
 *
 * shots.json:
 * {
 *   "target":   { "url": "http://localhost:34115" }            // Wails dev server, Vite renderer, any web UI
 *            or { "electron": ".", "args": [], "env": {} },    // Electron app dir (package.json "main")
 *   "outDir":   "course-name/screenshots",
 *   "viewport": { "width": 1280, "height": 800 },              // optional
 *   "scale":    2,                                             // optional deviceScaleFactor (url mode)
 *   "initScript": "stubs.js",                                  // optional: runs before page scripts (mock window.go / preload APIs)
 *   "shots": [
 *     {
 *       "name": "01-main-window",
 *       "steps": [                                             // optional, run in order before the shot
 *         { "click": "text=New Note" },
 *         { "fill": ["input[name=title]", "Trip packing list"] },
 *         { "press": "Enter" },
 *         { "hover": ".note-list li >> nth=0" },
 *         { "wait": 500 },
 *         { "waitFor": ".editor" },
 *         { "eval": "document.body.classList.add('demo')" }
 *       ],
 *       "clip": ".settings-dialog",                            // optional: screenshot one element instead of the window
 *       "hotspots": [
 *         { "selector": "button:has-text('New Note')", "title": "New Note", "desc": "Creates a blank note." }
 *       ]
 *     }
 *   ]
 * }
 *
 * Output: one PNG per shot, plus <outDir>/hotspots.json containing, per shot,
 * ready-to-paste --x / --y marker positions and data-region boxes.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function loadPlaywright() {
  for (const mod of ['playwright', '@playwright/test', 'playwright-core']) {
    try { return require(mod); } catch (e) { /* try next */ }
  }
  console.error('Playwright not found. Install it in the app repo (npm i -D playwright) ' +
    'or run with NODE_PATH="$(npm root -g)" if it is installed globally.');
  process.exit(1);
}

const pct = (v, total) => (Math.round((v / total) * 1000) / 10) + '%';

async function runSteps(page, steps) {
  for (const s of steps || []) {
    if (s.click) await page.click(s.click);
    else if (s.dblclick) await page.dblclick(s.dblclick);
    else if (s.rightclick) await page.click(s.rightclick, { button: 'right' });
    else if (s.fill) await page.fill(s.fill[0], s.fill[1]);
    else if (s.type) await page.type(s.type[0], s.type[1]);
    else if (s.press) await page.keyboard.press(s.press);
    else if (s.hover) await page.hover(s.hover);
    else if (s.waitFor) await page.waitForSelector(s.waitFor);
    else if (s.wait) await page.waitForTimeout(s.wait);
    else if (s.eval) await page.evaluate(s.eval);
    else if (s.goto) await page.goto(s.goto);
    else console.warn('  unknown step', JSON.stringify(s));
  }
}

async function main() {
  const cfgPath = process.argv[2];
  if (!cfgPath) { console.error('Usage: node capture.cjs shots.json'); process.exit(1); }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const baseDir = path.dirname(path.resolve(cfgPath));
  const outDir = path.resolve(baseDir, cfg.outDir || 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });
  const viewport = cfg.viewport || { width: 1280, height: 800 };
  const initScript = cfg.initScript ? fs.readFileSync(path.resolve(baseDir, cfg.initScript), 'utf8') : null;

  const pw = loadPlaywright();
  let page, closer;

  if (cfg.target && cfg.target.electron) {
    if (!pw._electron) { console.error('This Playwright build has no Electron support.'); process.exit(1); }
    const appDir = path.resolve(baseDir, cfg.target.electron);
    // Use the app's own Electron binary (the `electron` package exports its path).
    let executablePath = cfg.target.executablePath;
    if (!executablePath) {
      try { executablePath = require(require.resolve('electron', { paths: [appDir] })); } catch (e) { /* let Playwright look */ }
    }
    const app = await pw._electron.launch({
      executablePath,
      args: [appDir].concat(cfg.target.args || []),
      cwd: appDir,
      env: Object.assign({}, process.env, cfg.target.env || {})
    });
    page = await app.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    // Resize the real BrowserWindow so screenshots have a predictable size.
    await app.evaluate(({ BrowserWindow }, vp) => {
      const w = BrowserWindow.getAllWindows()[0];
      if (w) w.setContentSize(vp.width, vp.height);
    }, viewport).catch(() => {});
    if (initScript) await page.evaluate(initScript);
    closer = () => app.close();
  } else if (cfg.target && cfg.target.url) {
    const browser = await pw.chromium.launch();
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: cfg.scale || 2, colorScheme: cfg.colorScheme || 'light' });
    if (initScript) await ctx.addInitScript({ content: initScript });
    page = await ctx.newPage();
    await page.goto(cfg.target.url);
    await page.waitForLoadState('networkidle').catch(() => {});
    closer = () => browser.close();
  } else {
    console.error('shots.json needs target.url or target.electron'); process.exit(1);
  }

  const report = {};
  for (const shot of cfg.shots || []) {
    process.stdout.write('• ' + shot.name + ' … ');
    try {
      await runSteps(page, shot.steps);
      await page.waitForTimeout(shot.settle != null ? shot.settle : 300);
      const file = path.join(outDir, shot.name + '.png');

      // Frame = the area the PNG shows; hotspot percentages are relative to it.
      let frame;
      if (shot.clip) {
        const loc = page.locator(shot.clip).first();
        frame = await loc.boundingBox();
        await loc.screenshot({ path: file });
      } else {
        const size = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
        frame = { x: 0, y: 0, width: size.width, height: size.height };
        await page.screenshot({ path: file });
      }

      const spots = [];
      for (const h of shot.hotspots || []) {
        const box = await page.locator(h.selector).first().boundingBox({ timeout: 3000 }).catch(() => null);
        if (!box) { spots.push(Object.assign({}, h, { error: 'selector not found or not visible' })); continue; }
        const rx = box.x - frame.x, ry = box.y - frame.y;
        // Marker sits on the element's top-right corner so it never hides the label.
        const mx = Math.min(frame.width - 6, rx + box.width), my = Math.max(6, ry);
        spots.push({
          title: h.title || '',
          desc: h.desc || '',
          x: pct(mx, frame.width),
          y: pct(my, frame.height),
          region: [pct(rx, frame.width), pct(ry, frame.height), pct(box.width, frame.width), pct(box.height, frame.height)].join(','),
          html: '<button class="hotspot" style="--x:' + pct(mx, frame.width) + ';--y:' + pct(my, frame.height) +
            '" data-title="' + (h.title || '').replace(/"/g, '&quot;') + '" data-desc="' + (h.desc || '').replace(/"/g, '&quot;') +
            '" data-region="' + [pct(rx, frame.width), pct(ry, frame.height), pct(box.width, frame.width), pct(box.height, frame.height)].join(',') + '"></button>'
        });
      }
      report[shot.name] = { file: path.relative(baseDir, file), size: frame, hotspots: spots };
      console.log('ok' + (spots.length ? ' (' + spots.length + ' hotspots)' : ''));
    } catch (e) {
      report[shot.name] = { error: String(e && e.message || e) };
      console.log('FAILED — ' + (e && e.message || e));
    }
  }

  fs.writeFileSync(path.join(outDir, 'hotspots.json'), JSON.stringify(report, null, 2));
  console.log('Wrote ' + path.join(outDir, 'hotspots.json'));
  await closer();
}

main().catch(e => { console.error(e); process.exit(1); });
