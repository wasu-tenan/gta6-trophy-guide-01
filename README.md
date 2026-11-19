# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/wasu-tenan/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/wasu-tenan/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Ledger — offline guide and tracker for all 55 GTA VI PS5 trophies (1 platinum, 2 gold, 6 silver, 46 bronze), with checklist, filters, spoiler setting, roadmap and missables.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or just open `app/index.html` directly in a desktop browser. No build step, no install, no network: every file the app loads lives under `app/`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=2mmz0hmg&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

## What it does

- **Checklist over all 55 official trophies** — exact names, descriptions and grades from the official list (Exophase / PSNProfiles, November 2026), with a guide for each.
- **Saved progress** — ticks and count counters persist in `localStorage`; export progress as JSON and import it back; reset when you start over.
- **Filters** — by grade, by kind (story / missions / activities / collectibles / combat / exploration / misc), text search, earned/unearned, missable-only.
- **Spoiler setting** — on by default: the 12 story trophies stay covered until you earn them.
- **Roadmap to the platinum** — four ordered phases (story first, then time-sensitive side content, then grind/collectibles, then cleanup) with per-phase progress and per-PSN-target counters (250 stunts, 100 vehicles, 20 races, 50 challenges, 100 WAiNK locations, 3 card sets, and more).
- **Missables** — the one trophy published guides flag as possibly missable (Positive Mental Attitude: meditate in Chapter 1, at Jason's house) with its warning; everything else is reported safe, with the reasoning given.
- **Honest sourcing** — every guide cites Exophase and PSNProfiles, plus PowerPyx and SixShore where they add a fact. Where a location or trigger could not be verified, the guide says so plainly instead of inventing it.

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide itself.
- `app/data/trophies.json` — the 55 trophies: official name, description and grade, plus kind, roadmap phase, PSN count target, missable flag, guide and sources.
- `main.ts` — the make.fun entrypoint: copies `app/` and `screenshots/` to `/output` and writes `dossier.json` (set `MAKEFUN_OUTPUT_DIR` to override `/output`).
- `screenshots/` — four real renders of the app at 1280×800.
- `shots.json` — which view each screenshot shows.

## Sources

- Exophase — Grand Theft Auto VI Trophies (PS5): the official list (names, descriptions, grades).
- PSNProfiles — Grand Theft Auto VI trophies: grades and PSN count targets.
- PowerPyx — GTA 6 Trophy Guide and Roadmap: the missable flag, time estimates, and count facts (18 meditations, 80 challenges, 130 stunt jumps, 39 gang operations).
- SixShore — GTA 6 Trophy and Achievement List: the 12 story trophies, all hidden, none missable.

Guides are this entry's own words, written from the official descriptions and PSN targets. No Rockstar logo or official artwork is used anywhere; all visuals are original CSS. Trophy names and descriptions are quoted as PlayStation publishes them.

## License

MIT — see [LICENSE](LICENSE).
