# Leonida Ledger — GTA VI Trophy Guide & Tracker

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/wasu-tenan/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/wasu-tenan/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 trophies of **Grand Theft Auto VI** on PlayStation 5 — built for the [gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

A paper ledger for Leonida. Open `app/index.html` (or run `node serve.ts` and visit <http://localhost:8080>) and you get:

- **Checklist** — all 55 trophies with their official names, descriptions and grades (1 platinum, 2 gold, 6 silver, 46 bronze). Tick one off and it stays ticked in your browser, with export, import and reset.
- **Roadmap** — the hunt ordered into five stages, from the opening chapters to the platinum, each with its earned count.
- **Missables** — the 7 trophies tied to a story strand, a partner moment or a one-time choice, flagged before their window closes.
- **Guides** — every trophy has a guide note written from its official description, with its sources named beside it. Steps labelled own advice are my own suggestions.
- **Spoiler setting** — story trophies you have not earned stay blurred until you earn them, so the ledger never spoils the plot.
- **Search and filters** — by name or mission, grade, kind and earned state, plus a per-trophy note field.

## Honesty note

GTA VI is unreleased, so nothing in the guides is checked in the game yet. Every note is built from the official trophy list (names, descriptions, grades) plus clearly labelled own advice. Where a step cites a trailer, it is named; where it is my own suggestion, it says so.

## Files

- `app/` — the guide itself: `index.html`, `style.css`, `app.js`, plus `app/data/trophies.json` (the official list, untouched) and `app/data/guides.json` (the guide notes).
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — four renders of the app: checklist with a guide open, roadmap, missables, and the spoiler setting at work.
- `shots.json` — which views the screenshots were taken of.

## Run it

```sh
node serve.ts            # serves app/ on http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```
