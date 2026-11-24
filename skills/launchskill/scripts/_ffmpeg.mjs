/**
 * Shared FFmpeg discovery helper (Zero External Dependencies).
 * Finds global FFmpeg OR Remotion's bundled `@remotion/compositor-*` binary
 * and injects its dynamic library directory (`PATH` / `DYLD_LIBRARY_PATH` / `LD_LIBRARY_PATH`)
 * so bundled FFmpeg shared libraries load cleanly on Windows, macOS, and Linux.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function buildEnvForBinary(binPath) {
  if (binPath === "ffmpeg") return process.env;
  const libDir = path.dirname(binPath);
  if (process.platform === "win32") {
    const env = { ...process.env };
    const pathKey = Object.keys(env).find((k) => k.toLowerCase() === "path") || "PATH";
    env[pathKey] = `${libDir};${env[pathKey] || ""}`;
    return env;
  }
  if (process.platform === "darwin") {
    const prev = process.env.DYLD_LIBRARY_PATH;
    return { ...process.env, DYLD_LIBRARY_PATH: prev ? `${libDir}:${prev}` : libDir };
  }
  const prev = process.env.LD_LIBRARY_PATH;
  return { ...process.env, LD_LIBRARY_PATH: prev ? `${libDir}:${prev}` : libDir };
}

function canExecute(bin, env) {
  const probe = spawnSync(bin, ["-version"], {
    stdio: "ignore",
    env,
    shell: false,
  });
  return probe.status === 0;
}

/**
 * Cross-platform install hint displayed when FFmpeg is missing.
 */
export const FFMPEG_INSTALL_HINT = [
  "FFmpeg not found on PATH or in node_modules/@remotion/compositor-*.",
  "Install FFmpeg and retry:",
  "  • macOS:         brew install ffmpeg",
  "  • Ubuntu/Debian: sudo apt-get install ffmpeg",
  "  • Windows:       winget install Gyan.FFmpeg",
  "  • Or run inside a Remotion workspace (`npm install`) or set FFMPEG_PATH=/path/to/ffmpeg",
].join("\n");

/**
 * Returns `{ bin, env }` if a working FFmpeg binary is available, or `null`.
 */
export function findFfmpeg() {
  const candidates = [];

  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    const stat = fs.statSync(process.env.FFMPEG_PATH);
    if (stat.isFile()) candidates.push(process.env.FFMPEG_PATH);
  }
  candidates.push("ffmpeg");

  const binName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const searchRoots = [
    process.cwd(),
    path.resolve(process.cwd(), "demo"),
    path.resolve(process.cwd(), ".."),
  ];

  for (const root of searchRoots) {
    const remotionDir = path.join(root, "node_modules", "@remotion");
    if (!fs.existsSync(remotionDir)) continue;
    for (const entry of fs.readdirSync(remotionDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith("compositor-")) continue;
      const candidate = path.join(remotionDir, entry.name, binName);
      if (fs.existsSync(candidate)) candidates.push(candidate);
    }
  }

  for (const bin of candidates) {
    const env = buildEnvForBinary(bin);
    if (canExecute(bin, env)) {
      return { bin, env };
    }
  }
  return null;
}
