# Security Policy

## Security Architecture & Script Scope

MotionSkill (`launchskill`) is designed to run **offline by default** with zero hidden telemetry, zero bundled secrets, and zero `shell: true` command execution.

Every executable script lives in [`skills/launchskill/scripts/`](./skills/launchskill/scripts/) and uses only Node.js built-in modules:

| Script | Filesystem Access | Subprocess Execution | Network Access |
| :--- | :--- | :--- | :--- |
| `generate-dsp-sfx.mjs` | Writes 14 procedural PCM WAVs to `--out` | None | **None (100% offline)** |
| `generate-dsp-music.mjs` | Writes a procedural PCM WAV music bed to `--out` | None | **None (100% offline)** |
| `generate-sfx.mjs` | Forwards arguments to `generate-dsp-sfx.mjs` | `node` (`shell: false`) | **None (100% offline)** |
| `analyze-music.mjs` | Reads `--in` audio file; optionally writes JSON to `--out` | Local `ffmpeg` (`shell: false`, optional) | **None (100% offline)** |
| `master-audio.mjs` | Reads `--in` video; writes mastered video to `--out` | Local `ffmpeg` (`shell: false`) | **None (100% offline)** |
| `qa-frames.mjs` | Writes PNG stills and `contact-sheet.html` to `--out` | Local `@remotion/cli` via `node` (`shell: false`) | **None (local Remotion render)** |
| `_ffmpeg.mjs` | Locates local `ffmpeg` or `@remotion/compositor-*` binary | `ffmpeg -version` (`shell: false`) | **None (100% offline)** |
| `generate-ai-sfx.mjs` | Reads `manifest.json`; writes WAV/MP3 to `--out` (path-confined) | Local `ffmpeg` (`shell: false`, optional) | **Opt-in only**: calls `https://api.elevenlabs.io/v1/sound-generation` **only** when explicitly invoked without `--dry-run` and with `ELEVENLABS_API_KEY` set |
| `search-whatships.mjs` | None | None | **Opt-in only**: read-only public query to `https://whatships.com/mcp` (fallback: `search-index.json`) when explicitly invoked without `--dry-run` |

## API Keys & Credentials

- No API keys are required to use MotionSkill. All procedural foley and music beds synthesize locally via pure Node.js DSP.
- Optional ElevenLabs foley generation (`generate-ai-sfx.mjs`) reads `ELEVENLABS_API_KEY` strictly from your local process environment.
- Keys are **never** written to disk, logged to stdout/stderr, or sent anywhere other than `https://api.elevenlabs.io/v1/sound-generation`.
- Never commit `.env` files, personal tokens, or licensed third-party media to version control (all `.env*`, `*.mp3`, `*.wav`, and `*.mp4` files are excluded in `.gitignore`).

## Input & Subprocess Hardening

- All subprocess invocations use `spawnSync` with argument arrays and `shell: false` (no shell interpolation).
- CLI arguments (composition IDs, GL backends, numeric audio/DSP parameters, output filenames) are strictly validated and path-confined before execution.
- Outbound opt-in HTTP requests enforce explicit request timeouts (`AbortSignal.timeout`).

## Reporting a Vulnerability

If you discover a security issue (such as command injection, path traversal, or unintended network behavior):

1. **Do not** open a public GitHub issue with exploit details.
2. Report it privately using **GitHub Security Advisories** (`Security` → `Advisories` → `Report a vulnerability` on this repository).
3. Include the affected file, reproduction steps, and expected impact. We will acknowledge reports within 72 hours and coordinate a fix before public disclosure.
