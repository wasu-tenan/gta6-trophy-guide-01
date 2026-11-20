// Leonida Ledger — hand-in program for gta6-trophy-guide-01 (Node 22, standard
// library only). It gathers the entry — this folder's app/ and screenshots/ —
// into the output directory and asks the vendored make.fun library to write
// the dossier the judge reads. Run it locally with MAKEFUN_OUTPUT_DIR set:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader runs it with /output as the destination instead. Nothing here
// reaches the network: it only copies local files and writes local JSON.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(name: string): void {
  cpSync(join(repoRoot, name), join(destination, name), { recursive: true });
}

mkdirSync(destination, { recursive: true });
copyTree('app');
mkdirSync(join(destination, 'screenshots'), { recursive: true });
copyTree('screenshots');

// The scorer's own caps, as the kit's gate file states them: the text cap
// shapes the dossier bytes, the rest refuse an entry the scorer would refuse
// (more than 4 screenshots, one over 256 KiB, app/ past 993 entries or 48 MiB).
const dossier = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(destination, 'dossier.json'), dossier);
