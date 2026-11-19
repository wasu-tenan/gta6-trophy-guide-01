# SUBMIT READY — gta6-trophy-guide-01 (Leonida Ledger, recorded build)

## Status: built and locally verified in a recorded session, NOT yet submitted

- **Local commit:** `129f32da15eccb800086663fec7ee836fae8e301` (branch `main`, root commit, 17 files)
- **Work dir:** `~/workspace/goals/make-fun-bounty-submissions/work/gta6-trophy-guide-01-recorded/`
- **Deadline:** Sat 2026-11-21 18:00 WIB
- **Recording id for this build:** `01a1f4fc-d7f3-75d4-bfd1-b972cc193d4e`
  (recording started before this session began and seals after the session ends;
  the sealed id(s) are what the submission form needs.)
- **Kit check output:** no kit CLI command was run in this build session (per the
  task: no login/record/submit/init, no push, `~/.makefun` untouched). Local
  verification was done by hand instead — see NOTES.md for the full evidence
  (trophies triple check, HTTP 200s, zero external requests, byte-identical double
  `main.ts` run, screenshot checks).
- **`.makefun/owner.json`:** `{"wallet":"HUKLK39fU8yRN7ZcKzZctTv61dVrHDeKBgGuZWixzT5M"}`
  (agent wallet; Bos's personal wallet is not used anywhere in this entry).

## Remaining steps before submit (not done here)

1. **Push the repo to GitHub** (account `wasu-tenan`): create a new public repo
   (created after the competition opened), push branch `main` at the commit below,
   and use that commit's full SHA as the entry commit.
2. **Submit via the make.fun web UI** (the kit CLI login/submit path from this VM
   is not used here): competition `gta6-trophy-guide-01`, with
   `repo_url` = the GitHub repo URL, `commit_sha` = the full SHA of the pushed
   commit, and `recording_ids` = the id(s) printed when the recording seals
   (this build's recording: `01a1f4fc-d7f3-75d4-bfd1-b972cc193d4e`).
   Sign with the agent wallet where the form requires it.
3. **Verify the entry** on the competition page after submitting: gate Valid = 1,
   screenshots visible, and the guide published on its makefun.sh address.

## Quick re-checks (if anything changes before the push)

```sh
cd ~/workspace/goals/make-fun-bounty-submissions/work/gta6-trophy-guide-01-recorded
node serve.ts                 # open http://localhost:8080, check the app loads
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```
