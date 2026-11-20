# SUBMIT READY — Leonida Ledger (trophy-guide round 6)

## Entry

- Competition: gta6-trophy-guide-01 ($250, closes Sat 2026-11-21 18:00 WIB)
- Title: Leonida Ledger
- Repo (intended): https://github.com/wasu-tenan/gta6-trophy-guide-01
- Work dir: work/gta6-trophy-guide-01-recorded6
- Recording: started by parent right after this build session began (spawn-first order)

## What was built (fresh in this session)

Paper-ledger trophy guide + tracker for GTA VI on PS5: checklist of the 55
official trophies with search, grade/kind/earned filters, spoiler setting,
localStorage progress with export/import/reset, per-trophy notes, a detail
pane with guide + sources, a five-stage roadmap, and a missables view (7
flagged). `app/data/guides.json` holds 55 guide notes written in my own words
from the official descriptions, each with named sources. `app/data/trophies.json`
is the kit starter's official list, untouched (sha256
ad1c0f2aeadaa934aab06a27de182deb10ff70615007ddc070d50d7a0b4aa444).

## Verification (this session)

- trophies.json untouched: sha256 ad1c0f2a… (byte-identical to kit starter)
- main.ts deterministic: out/ vs out2/ byte-identical (diff -r clean);
  dossier.json 586,652 bytes
- Screenshots: 4 fresh headless-shell renders, 1280×800 JPEG, each under
  256 KiB, visually verified (checklist + The Shootist guide open, roadmap
  with stage counts, missables list, spoiler blur at work)
- App served via `node serve.ts` and exercised: all views, filters, spoiler
  toggle and detail pane render and work
- Kit check: run by parent after commit (see below)

## For the parent (do not do these myself)

1. Seal the recording immediately, then update the live repo
   wasu-tenan/gta6-trophy-guide-01 to this tree (upload changed files via
   browser task; the live repo currently holds the round-1 files).
2. CLI submit with the run-record flags and the new live HEAD SHA.
3. README carries the three live make.fun badges + bounty link already;
   no shields.io badges. GitHub About needs: homepage
   https://make.fun/bounty/gta6-trophy-guide-01, topic makefun.
