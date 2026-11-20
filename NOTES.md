# Leonida Ledger — notes

## Design

A paper ledger: warm paper background, ink text, serif type, a coloured grade
chip per trophy. Four views under hash routes — Checklist, Roadmap, Missables,
About — with a detail pane that opens between the tabs and the content, so a
trophy's guide and sources sit beside the list.

## Data

- `app/data/trophies.json` is the kit starter's official list (55 trophies,
  2026-11-18). It is untouched: byte-identical to the starter.
- `app/data/guides.json` is new, written for this entry: 55 guides keyed by
  trophy id, each with a kind, a roadmap stage (1–5), a missable flag and
  steps with named sources. Every step is composed from the official
  description plus clearly labelled own advice; nothing is checked in the
  game yet, and the notes say so.

## Kinds and stages

Kinds: story 17, activity 20, combat 4, exploration 3, collectible 5,
misc 4, completion 1, platinum 1. Roadmap stages: 1 (8 trophies), 2 (8),
3 (14), 4 (13), 5 (12). Missable flags (7): ids 22, 23, 24, 26, 27
(character final missions), 33 (partner moment) and 48 (one-time choice).
Each flag carries its reason in the guide note.

## Screenshots

Four 1280×800 renders from the app's own code in the Playwright headless
shell, taken with `?demo=1` (13 trophies seeded earned) so the progress and
filters read at a glance:

1. `1-checklist.jpg` — checklist with The Shootist's guide and sources open.
2. `2-roadmap.jpg` — roadmap with stage counts.
3. `3-missables.jpg` — the seven missable trophies.
4. `4-spoiler.jpg` — spoiler mode on: story trophies blurred until earned.

## Determinism

`main.ts` copies `app/` and `screenshots/` and writes `dossier.json` with
the vendored `buildDossier`. Running it twice into two directories gives
byte-identical output (checked with `diff -r`).

## What is not mine

`vendor/makefun-frontend.ts`, `serve.ts` and `LICENSE` are the kit starter's,
unchanged. `app/data/trophies.json` is the kit starter's official list,
unchanged.
