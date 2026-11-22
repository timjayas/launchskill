#!/usr/bin/env node
/**
 * What Ships Launch Reference Researcher (Zero External NPM Dependencies)
 *
 * Queries https://whatships.com (3,300+ curated startup launch videos from X) via its
 * free, unauthenticated Remote MCP JSON-RPC 2.0 endpoint (`https://whatships.com/mcp`)
 * with automatic fallback to `https://whatships.com/search-index.json`.
 *
 * Use BEFORE storyboarding to study real, high-performing X launch hooks, runtime
 * sweet spots, and comparable launches in the user's category.
 *
 * Usage:
 *   node scripts/search-whatships.mjs --query "agent canvas" --limit 6
 *   node scripts/search-whatships.mjs --query "design system" --category Design --limit 5
 *   node scripts/search-whatships.mjs --tools --query "motion" --limit 8
 *   node scripts/search-whatships.mjs --studios --limit 10
 *   node scripts/search-whatships.mjs --query "devtools" --dry-run
 */

const MCP_URL = "https://whatships.com/mcp";
const SEARCH_INDEX_URL = "https://whatships.com/search-index.json";

function parseArgs(argv) {
  const opts = {
    query: "",
    category: "",
    limit: 6,
    mode: "videos", // "videos" | "tools" | "studios"
    json: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === "--query" || a === "-q") && argv[i + 1]) opts.query = argv[++i];
    else if ((a === "--category" || a === "-c") && argv[i + 1]) opts.category = argv[++i];
    else if ((a === "--limit" || a === "-n") && argv[i + 1]) opts.limit = Math.max(1, Math.min(50, Number(argv[++i]) || 6));
    else if (a === "--tools") opts.mode = "tools";
    else if (a === "--studios") opts.mode = "studios";
    else if (a === "--json") opts.json = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (!a.startsWith("-") && !opts.query) opts.query = a;
  }
  return opts;
}

async function callMcpTool(name, args) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    signal: AbortSignal.timeout(15_000),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  if (!res.ok) {
    throw new Error(`What Ships MCP HTTP ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  // Handle Streamable HTTP SSE or plain JSON-RPC
  let payload;
  if (contentType.includes("text/event-stream")) {
    const dataLines = raw
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .filter(Boolean);
    payload = JSON.parse(dataLines[dataLines.length - 1]);
  } else {
    payload = JSON.parse(raw);
  }

  if (payload.error) {
    throw new Error(`MCP error: ${payload.error.message || JSON.stringify(payload.error)}`);
  }

  const textBlock = payload.result?.content?.find((c) => c.type === "text")?.text;
  if (!textBlock) return payload.result;
  try {
    return JSON.parse(textBlock);
  } catch {
    return textBlock;
  }
}

async function fallbackSearchIndex(opts) {
  const res = await fetch(SEARCH_INDEX_URL, {
    signal: AbortSignal.timeout(15_000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`search-index.json HTTP ${res.status}`);
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.videos || data.items || [];
  const q = opts.query.toLowerCase();
  const cat = opts.category.toLowerCase();

  return items
    .filter((item) => {
      const hay = JSON.stringify(item).toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (cat && !String(item.category || "").toLowerCase().includes(cat)) return false;
      return true;
    })
    .slice(0, opts.limit);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const toolName =
    opts.mode === "tools"
      ? "list_tools"
      : opts.mode === "studios"
        ? "list_studios"
        : "search_videos";

  const mcpArgs =
    opts.mode === "videos"
      ? {
          ...(opts.query ? { query: opts.query } : {}),
          ...(opts.category ? { category: opts.category } : {}),
          limit: opts.limit,
        }
      : {
          ...(opts.query ? { query: opts.query } : {}),
          limit: opts.limit,
        };

  if (opts.dryRun) {
    console.log(`What Ships Research Plan (${MCP_URL}):`);
    console.log(`  Tool : ${toolName}`);
    console.log(`  Args : ${JSON.stringify(mcpArgs)}`);
    console.log(`  Fallback: ${SEARCH_INDEX_URL}`);
    console.log("Dry-run enabled; skipped network call.");
    return;
  }

  let data;
  try {
    data = await callMcpTool(toolName, mcpArgs);
  } catch (mcpErr) {
    if (opts.mode === "videos") {
      try {
        data = await fallbackSearchIndex(opts);
      } catch (fallbackErr) {
        console.error(`Unable to reach whatships.com (offline or blocked): ${mcpErr.message}; ${fallbackErr.message}`);
        process.exit(1);
      }
    } else {
      console.error(`Unable to reach whatships.com MCP: ${mcpErr.message}`);
      process.exit(1);
    }
  }

  if (opts.json || typeof data === "string") {
    console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
    return;
  }

  const rows = Array.isArray(data) ? data : data?.videos || data?.tools || data?.studios || data?.results || [];
  console.log(`What Ships (${opts.mode}) — ${rows.length} matches:\n`);
  for (const item of rows.slice(0, opts.limit)) {
    const title = item.title || item.name || item.slug || "Untitled";
    const meta = [item.company, item.category, item.duration, item.views ? `${item.views} views` : ""]
      .filter(Boolean)
      .join(" · ");
    const url = item.url || (item.slug ? `https://whatships.com/videos/${item.slug}/` : "");
    console.log(`- ${title}`);
    if (meta) console.log(`  ${meta}`);
    if (url) console.log(`  ${url}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
