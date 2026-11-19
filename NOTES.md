# NOTES — Leonida Ledger (gta6-trophy-guide-01, recorded build)

## What was built

An offline static web app, "Leonida Ledger", a GTA VI trophy guide and tracker
in `app/` (entrypoint `main.ts`, Node 22, stdlib only). This build was done in a
recorded session (recording id `01a1f4fc-d7f3-75d4-bfd1-b972cc193d4e`); all code
and guide wording below were authored in this session.

- **Checklist over all 55 official trophies** — names, descriptions and grades
  taken verbatim from the kit starter's `app/data/trophies.json` (verified
  identical triples, see below). Grades: 1 platinum, 2 gold, 6 silver, 46 bronze.
- **Saved progress** in `localStorage` (ticks + per-target counters), with
  export/import of progress as JSON and a reset button.
- **Filters**: grade, kind (story / missions / activities / collectibles /
  combat / exploration / misc), text search, earned/unearned, missable-only.
- **Spoiler setting** (default ON): the 12 story trophies show as "Hidden story
  trophy" until earned; turning it off reveals their names.
- **Roadmap to platinum**: 4 ordered phases (story first → time-sensitive side
  content → grind/collectibles → cleanup) with per-phase progress and per-PSN-target
  counters (250 stunts, 100 vehicles, 20 races, 50 challenges, 100 WAiNK locations,
  3 card sets, 42 shooting-range challenges, 14 drone-race locations, 18 meditation
  spots, 52 areas, 9 gangs, 8 garages, 10 Scooter Bros vehicles, $250,000 / $100,000).
- **Missables**: exactly one trophy is flagged possibly missable — Positive Mental
  Attitude (meditate at every spot; PowerPyx flags it because a first meditation in
  Chapter 1, at Jason's house, can be missed). The Missables view gives the Chapter 1
  warning, the manual-save precaution, and states the published guides flag nothing
  else; story trophies cannot be missed.
- **A guide for every trophy, in this entry's own words**, each citing its sources
  (Exophase for name/description/grade; PSNProfiles for grade/count target;
  PowerPyx and SixShore where they add a fact). Where a location or trigger could not
  be verified in a source we could check, the guide says plainly that it is not
  pinned down instead of inventing it.
- **Sources & Method view**: the list at a glance (55 / 28 hidden / 0 online /
  1 missable / ~200h), full source list with plain-text addresses (read from the
  trophies' own source lists), and an explicit "what we did not do" section.
- **No network anywhere**: the only fetch is the local `data/trophies.json`; source
  addresses appear only as plain text, never as links or fetched resources. All
  visuals are original CSS; no logo, no artwork, no external fonts/images/scripts.
- `main.ts` written in this session with the starter's behaviour (copy `app/` +
  `screenshots/` to `/output`, `buildDossier` with the same caps);
  `vendor/makefun-frontend.ts` byte-for-byte untouched (diffed against the kit).
- `serve.ts` kept, with one fix: the starter server crashed (uncaught
  `new URL('//', …)` throw) when a client requested `//`, which Chromium does;
  it now answers 400 instead of dying.
- `shots.json` describes the 4 screenshots (view + seed of 13 earned, via `?demo=13`,
  an in-memory-only demo mode that never writes to storage).

## Sources used

- Exophase, Grand Theft Auto VI Trophies (PS5) — names, descriptions, grades.
  https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles, Grand Theft Auto VI trophies — grades and PSN count targets.
  https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- PowerPyx, GTA 6 Trophy Guide & Roadmap — verified by web search 2026-11-20:
  ~200 hours, difficulty 4/10, 1 possibly missable (Positive Mental Attitude,
  first meditation in Chapter 1 at Jason's house), 5 chapters / 60–80h story,
  18 meditations across 10 spots (15 of 18 for 100%), 80 challenges (50 for the
  trophy, 70 for 100%), 130 stunt-jump locations, 39 illegal gang operation
  locations, no mission replay, free-roam after the story, cheats disable trophies.
  https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- SixShore, GTA 6 Trophy and Achievement List — 12 story trophies, all hidden,
  none missable; 27 visible / 28 hidden.
  https://sixshore.com/gta-6/guides/trophies-and-achievements/

## Honest limitations

- **Per-trophy hidden flags**: 28 of 55 are hidden on PSN, but per-trophy hidden
  status could only be confirmed for the 12 story trophies (SixShore: all hidden).
  `trophies.json` therefore sets `hidden: true` only for those 12 and `hidden: null`
  elsewhere, with a `hidden_note` explaining the gap. The app badges only the
  confirmed 12.
- **Missables**: only Positive Mental Attitude is flagged, following the published
  launch guides (PowerPyx / SixShore). No other missable is claimed; the game is a
  day old and no guide we could check pins down any other timing risk.
- **Vague trophies**: the descriptions of Challenging Tank, Personal Best, Actions
  Speak Louder, Bad Luck I Guess, The Truth Is Out There, Catch Me If You Can and
  Capital Offense give no usable instruction; their guides say so and give only
  the plain reading of the description. No location or step was invented.
- **Screenshots are true renders**: taken with Playwright Core + the Chromium
  headless shell already installed in this VM
  (`~/.cache/ms-playwright/chromium_headless_shell-1148`), served from `serve.ts`,
  progress seeded to 13 of 55 earned via `?demo=13`. Zero console errors and zero
  external requests during the render (checked by the screenshot script).
- **Counts in guides** (250 stunts etc.) come from the official descriptions and
  the starter hints / PSNProfiles targets; they were not verified by playing the game.
- No kit CLI command was run in this session (no login/record/submit/init), no
  push was made, and `~/.makefun` was not touched, per the task.

## Verification (all run locally, 2026-11-20)

- `trophies.json`: 55 entries; name/description/grade triples byte-identical to the
  kit starter's file, in order; grades 1/2/6/46; every guide non-blank; every trophy
  carries sources; 50,010 bytes (≤ 2 MiB).
- Served with `node serve.ts`: `/`, `/app.js`, `/style.css`, `/data/trophies.json`
  all HTTP 200. `node --check app/app.js` passes; JSON parses. A `//` request
  returns 400 and the server stays up.
- External-reference grep: no `https://` anywhere in `app/` except the plain-text
  citation addresses inside `app/data/trophies.json`; no `@import` or `url(` in
  CSS/HTML/JS; `index.html` references only local `style.css` and `app.js`;
  the only `fetch` is `data/trophies.json`.
- Browser check (Chromium headless shell): 8 story trophies masked with spoilers
  ON (12 story − 4 earned in the demo); spoiler OFF reveals story names
  (Paradise Lost, Vice City, Baby!); search "stunt" filters to 1 trophy
  (Cunning Stunts); Sources view renders 7 stat rows and cites PowerPyx;
  export/import controls present; **zero console errors, zero external requests**.
- `main.ts` run TWICE with `MAKEFUN_OUTPUT_DIR` to two different dirs:
  `diff -r` clean — **outputs byte-identical**. Each output contains `app/`,
  `screenshots/` (4 files) and `dossier.json` (875,893 bytes, ≤ 1.5 MiB;
  dossier text 79,123 bytes, ≤ 163,840).
- Screenshots: all 1280×800 JPEG, quality 82 — 1-cover.jpg 154,519 B,
  2-roadmap.jpg 117,967 B, 3-detail.jpg 174,725 B, 4-missables.jpg 146,663 B
  (each ≤ 256 KiB). Views: cover checklist with 13/55 seeded; roadmap phases;
  trophy detail/guide pane (Positive Mental Attitude); missables view.
  Visually inspected.
- Gate limits: `app/` 6 entries, 78,009 bytes (≤ 993 / 48 MiB); `index.html`
  3,431 bytes (≤ 1 MiB); 4 screenshots (3–4); dossier as above; longest app
  path 22 bytes (≤ 1000).
- `vendor/makefun-frontend.ts`: diff against the kit copy is empty.
- `.makefun/owner.json` contains exactly
  `{"wallet":"HUKLK39fU8yRN7ZcKzZctTv61dVrHDeKBgGuZWixzT5M"}` (agent wallet;
  Bos's personal wallet is not used anywhere; a repo-wide grep finds no `H9Zi`).
