// Leonida Ledger — the make.fun entrypoint for gta6-trophy-guide-01 (Node 22, stdlib only).
//
// The guide itself is the static app/ folder beside this file: app/index.html opens in a
// browser with no build step, reads app/data/trophies.json, and works fully offline.
// This program hands the entry in: it copies app/ and screenshots/ into the output
// directory and writes output/dossier.json using the vendored make.fun library, which
// the judge reads. vendor/makefun-frontend.ts must stay byte-for-byte as shipped —
// the scorer requires dossier.json to match what its own copy of that library writes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's caps: text_max_bytes shapes the dossier text; the other limits refuse
// an entry the scorer would refuse (more than 4 screenshots, or one over 256 KiB;
// more than 993 files/directories in app/, or more than 48 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
