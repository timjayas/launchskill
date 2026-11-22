#!/usr/bin/env node
/**
 * Motion-Boundary + Contact-Sheet Visual QA Script (Zero External Dependencies)
 *
 * Renders:
 *   1) 5 Strategic Hero Stills (Hook, Product, Macro, Midpoint/Chapter, CTA)
 *   2) Cut-Boundary Triplets (`cut - 1`, `cut`, `cut + 2`) for every major edit boundary
 *      to catch ghosting, snap-pops, unloaded fonts, or stray blur on hard cuts.
 *   3) An HTML contact sheet (`contact-sheet.html`) for rapid visual inspection.
 *
 * Usage:
 *   node scripts/qa-frames.mjs --comp SaasLaunch --fps 30 --duration 720 --cuts 75,390,540,600
 *   node scripts/qa-frames.mjs --comp KineticStudioLaunch --fps 30 --duration 723 --cuts 82,205,327,450,545,641 --dry-run
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const opts = {
    comp: "",
    fps: 30,
    duration: 720,
    cuts: [],
    heroes: [],
    out: path.join("out", "qa"),
    gl: "angle",
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--comp" && argv[i + 1]) opts.comp = argv[++i];
    else if (arg === "--fps" && argv[i + 1]) opts.fps = Number(argv[++i]);
    else if (arg === "--duration" && argv[i + 1]) opts.duration = Number(argv[++i]);
    else if (arg === "--cuts" && argv[i + 1]) {
      opts.cuts = argv[++i].split(",").map((s) => Math.round(Number(s.trim()))).filter(Number.isFinite);
    } else if (arg === "--heroes" && argv[i + 1]) {
      opts.heroes = argv[++i].split(",").map((s) => Math.round(Number(s.trim()))).filter(Number.isFinite);
    } else if (arg === "--out" && argv[i + 1]) opts.out = argv[++i];
    else if (arg === "--gl" && argv[i + 1]) opts.gl = argv[++i];
    else if (arg === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

function buildPlan(opts) {
  const maxFrame = Math.max(1, opts.duration - 1);
  const clamp = (f) => Math.max(0, Math.min(maxFrame, Math.round(f)));

  const heroFrames =
    opts.heroes.length > 0
      ? opts.heroes.map((f, i) => ({
          id: `hero-${String(i + 1).padStart(2, "0")}`,
          label: `Hero #${i + 1}`,
          frame: clamp(f),
          group: "hero",
        }))
      : [
          { id: "hero-01-hook", label: "01 Hook (0.4s)", frame: clamp(opts.fps * 0.4), group: "hero" },
          { id: "hero-02-product", label: "02 Product Reveal (~22%)", frame: clamp(opts.duration * 0.22), group: "hero" },
          { id: "hero-03-macro", label: "03 Macro Interaction (~42%)", frame: clamp(opts.duration * 0.42), group: "hero" },
          { id: "hero-04-chapter", label: "04 Midpoint / Theme Flip (~64%)", frame: clamp(opts.duration * 0.64), group: "hero" },
          { id: "hero-05-cta", label: "05 CTA End-Card (~90%)", frame: clamp(opts.duration * 0.9), group: "hero" },
        ];

  const boundaryFrames = [];
  opts.cuts.forEach((cut, idx) => {
    const tag = `cut-${String(idx + 1).padStart(2, "0")}`;
    const triplet = [
      { suffix: "pre", offset: -1, desc: `Cut #${idx + 1} (cut - 1)` },
      { suffix: "on", offset: 0, desc: `Cut #${idx + 1} (cut)` },
      { suffix: "post", offset: 2, desc: `Cut #${idx + 1} (cut + 2)` },
    ];
    for (const item of triplet) {
      boundaryFrames.push({
        id: `${tag}-${item.suffix}`,
        label: item.desc,
        frame: clamp(cut + item.offset),
        group: "boundary",
      });
    }
  });

  return [...heroFrames, ...boundaryFrames];
}

const SAFE_COMP_RE = /^[A-Za-z0-9_-]+$/;
const ALLOWED_GL = new Set(["angle", "egl", "swiftshader", "vulkan", "swangle", "angle-egl"]);

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveRemotionCli() {
  let dir = process.cwd();
  for (let depth = 0; depth < 6; depth++) {
    const candidate = path.join(dir, "node_modules", "@remotion", "cli", "remotion-cli.js");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function writeContactSheet(outDir, comp, fps, items) {
  const safeComp = escapeHtml(comp);
  const cards = items
    .map(
      (item) => `
      <figure class="card ${escapeHtml(item.group)}">
        <img src="./${escapeHtml(item.id)}.png" alt="${escapeHtml(item.label)}" loading="lazy" />
        <figcaption>
          <strong>${escapeHtml(item.label)}</strong>
          <span>f=${item.frame} (${(item.frame / fps).toFixed(2)}s)</span>
        </figcaption>
      </figure>`
    )
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Visual QA Contact Sheet — ${safeComp}</title>
  <style>
    body { margin: 0; padding: 32px; background: #09090b; color: #fafafa; font-family: system-ui, sans-serif; }
    h1 { margin: 0 0 8px; font-size: 22px; }
    p { margin: 0 0 24px; color: #a1a1aa; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; }
    .card { margin: 0; background: #141418; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; }
    .card.boundary { border-color: rgba(56,189,248,0.32); }
    .card img { width: 100%; display: block; aspect-ratio: 16 / 9; object-fit: cover; background: #000; }
    figcaption { padding: 10px 14px; display: flex; justify-content: space-between; font-size: 13px; color: #e4e4e7; }
    figcaption span { font-family: ui-monospace, monospace; color: #a1a1aa; }
  </style>
</head>
<body>
  <h1>Motion-Boundary Visual QA — ${safeComp}</h1>
  <p>Inspect hero frames for fonts, 360px legibility, and safe zones; inspect blue-bordered triplets (cut-1, cut, cut+2) for ghosting, snap-pops, or stray rest blur.</p>
  <div class="grid">${cards}</div>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, "contact-sheet.html"), html, "utf8");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.comp) {
    console.error(
      "Usage: node scripts/qa-frames.mjs --comp <CompositionId> [--fps 30] [--duration 720] [--cuts f1,f2,...] [--heroes f1,...] [--out out/qa] [--gl angle] [--dry-run]"
    );
    process.exit(1);
  }

  if (!SAFE_COMP_RE.test(opts.comp)) {
    console.error(`Invalid --comp identifier: "${opts.comp}". Allowed characters: A-Z, a-z, 0-9, _, -.`);
    process.exit(1);
  }
  if (!ALLOWED_GL.has(opts.gl)) {
    console.error(`Invalid --gl renderer: "${opts.gl}". Allowed: ${[...ALLOWED_GL].join(", ")}.`);
    process.exit(1);
  }
  if (!Number.isFinite(opts.fps) || opts.fps <= 0 || opts.fps > 240) {
    console.error(`Invalid --fps value: ${opts.fps}`);
    process.exit(1);
  }
  if (!Number.isFinite(opts.duration) || opts.duration < 1 || opts.duration > 100000) {
    console.error(`Invalid --duration value: ${opts.duration}`);
    process.exit(1);
  }

  const outDir = path.resolve(process.cwd(), opts.out);
  const plan = buildPlan(opts);

  console.log(`QA Plan for ${opts.comp} (${plan.length} stills -> ${outDir}):`);
  for (const item of plan) {
    console.log(`  - ${item.id.padEnd(20)} frame=${String(item.frame).padStart(4)}  (${item.label})`);
  }

  if (opts.dryRun) {
    console.log("Dry-run enabled; skipping Remotion CLI execution.");
    return;
  }

  const remotionCli = resolveRemotionCli();
  if (!remotionCli) {
    console.error(
      "Could not locate local node_modules/@remotion/cli/remotion-cli.js. Run inside a Remotion project after `npm install`."
    );
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const item of plan) {
    const outFile = path.join(outDir, `${item.id}.png`);
    const args = [
      remotionCli,
      "still",
      opts.comp,
      outFile,
      `--frame=${item.frame}`,
      `--gl=${opts.gl}`,
    ];
    const res = spawnSync(process.execPath, args, {
      stdio: "inherit",
      shell: false,
    });
    if (res.status !== 0) {
      console.error(`Failed rendering ${item.id} at frame ${item.frame}`);
      process.exit(res.status ?? 1);
    }
  }

  writeContactSheet(outDir, opts.comp, opts.fps, plan);
  console.log(`\n✓ Contact sheet ready: ${path.join(outDir, "contact-sheet.html")}`);
}

main();
