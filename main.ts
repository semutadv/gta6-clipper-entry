// gta6-clipper-01 entry (Node 22, standard library only).
// The entry is the YouTube video itself: this program validates VIDEO.json
// in the bot directory and then copies it to the output directory, where the
// grader reads it and resolves the video's view count through the YouTube
// Data API.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Report a failure as one structured JSON line on stderr and exit 1.
function fail(code: string, message: string): never {
  console.error(JSON.stringify({ ok: false, error: code, message }));
  process.exit(1);
}

// The grader accepts the three canonical YouTube URL shapes for a video:
// a watch URL, a Shorts URL, or a youtu.be short link.
function isYouTubeUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  if (parsed.hostname === 'youtu.be') return parsed.pathname.length > 1;
  if (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
    if (parsed.pathname === '/watch') return parsed.searchParams.has('v');
    return /^\/shorts\/[^/]+/.test(parsed.pathname);
  }
  return false;
}

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const destPath = join(OUTPUT_DIR, 'VIDEO.json');

// Validate before copying: VIDEO.json must exist, parse as JSON, and carry
// a "url" field that points at a YouTube video.
let raw: string;
try {
  raw = readFileSync(sourcePath, 'utf8');
} catch (err) {
  fail('read_failed', `VIDEO.json could not be read from ${sourcePath}: ${(err as Error).message}`);
}

let data: unknown;
try {
  data = JSON.parse(raw);
} catch (err) {
  fail('invalid_json', `VIDEO.json is not valid JSON: ${(err as Error).message}`);
}

const url = (data as { url?: unknown } | null)?.url;
if (!isYouTubeUrl(url)) {
  fail('invalid_url', 'VIDEO.json field "url" must be a YouTube watch, shorts, or youtu.be URL.');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(sourcePath, destPath);
} catch (err) {
  fail('copy_failed', `VIDEO.json could not be copied to ${destPath}: ${(err as Error).message}`);
}

console.log(JSON.stringify({ ok: true, copied: destPath, url }));
