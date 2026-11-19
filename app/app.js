// Leonida Ledger — GTA VI trophy guide & tracker.
// Plain static app: reads data/trophies.json once, keeps progress in localStorage,
// never makes a network request of its own. Views are hash routes; a trophy's
// full guide opens in a side panel. Demo mode (?demo=13) seeds 13 earned
// trophies in memory only, for screenshots, and never writes to storage.
const STORE_KEY = 'leonida-ledger-v1';
const DEMO_EARNED = [2, 3, 4, 8, 15, 16, 20, 21, 35, 44, 46, 52, 53];
const DEMO_COUNTERS = { 15: 250, 16: 9, 31: 23, 32: 18, 35: 100, 42: 19, 52: 250000, 53: 100000 };
const STORY = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
const PHASES = [
  { n: 1, title: 'Phase 1 — Story first', when: '~60–80 hours', text: 'Play the story in order, all five chapters. The 12 story trophies pop automatically as chapters and named missions complete. Do the Chapter 1 meditation for Positive Mental Attitude the first time it is offered (see Missables). Start counting stunts and scanning vehicles as you travel.' },
  { n: 2, title: 'Phase 2 — Time-sensitive side content', when: 'during & after the story', text: 'Side strands that unlock as the story progresses: the final missions for Andy, Kenton, Billy, Randy and Tyrone, Bret\'s unique-animal hunt, 8 Strangers & Freaks strands, and every meditation spot. Finish the meditation set before the story ends.' },
  { n: 3, title: 'Phase 3 — Grind & collectibles', when: '~100 hours', text: 'The long counts, in the open world after the story: 250 stunts, 42 shooting-range golds, 14 drone races, 20 race wins, 3 card sets, 100 WAiNK tags, 50 challenges, 100 vehicles, 52 areas, all 9 gangs, $250,000 laundered, $100,000 spent, 8 garages, 10 Scooter Bros registrations.' },
  { n: 4, title: 'Phase 4 — Cleanup & one-offs', when: '~10 hours', text: 'Everything left: the 100% checklist gold (A Long Road), the platinum, and the one-off trophies — wanted-level escapes, shop and vault robberies, the Ocean Beach cocktail, the showroom smash, bowling, and the vague ones whose triggers the guides have not pinned down yet.' },
];

const params = new URLSearchParams(location.search);
const demo = params.get('demo') === '13';

let store = { earned: [], counters: {}, spoilers: true };
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null');
  if (saved && typeof saved === 'object') store = { ...store, ...saved };
} catch { /* corrupted save: start fresh */ }

const earned = new Set(demo ? DEMO_EARNED : (store.earned || []).filter(Number.isInteger));
const counters = demo ? { ...DEMO_COUNTERS } : (store.counters || {});
let spoilers = demo ? true : store.spoilers !== false;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

const $ = (id) => document.getElementById(id);
const view = $('view');
const detail = $('detail');
const q = $('q'), gradeSel = $('grade'), kindSel = $('kind'), statusSel = $('status');
const missableOnly = $('missableOnly'), spoilersBox = $('spoilers');
spoilersBox.checked = spoilers;
if (demo) $('demoBanner').hidden = false;

function save() {
  if (demo) return;
  localStorage.setItem(STORE_KEY, JSON.stringify({
    earned: [...earned], counters, spoilers,
  }));
}

function isHidden(t) { return spoilers && STORY.has(t.id) && !earned.has(t.id); }
function shownName(t) { return isHidden(t) ? 'Hidden story trophy' : t.name; }
function shownDesc(t) { return isHidden(t) ? 'Complete the story to reveal this trophy. Its name and description are hidden until earned.' : t.description; }
function fmt(n) { return n.toLocaleString('en-US'); }

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = Math.round((done / total) * 100);
  $('barFill').style.width = pct + '%';
  $('progressText').textContent = done + ' of ' + total + ' earned — ' + pct + '% to the platinum';
  const byGrade = {};
  for (const t of trophies) if (earned.has(t.id)) byGrade[t.grade] = (byGrade[t.grade] || 0) + 1;
  $('gradeText').textContent = 'Platinum ' + (byGrade.platinum || 0) + '/1 · Gold ' + (byGrade.gold || 0) + '/2 · Silver ' + (byGrade.silver || 0) + '/6 · Bronze ' + (byGrade.bronze || 0) + '/46';
}

function gradeTag(t) {
  const s = document.createElement('span');
  s.className = 'tag ' + t.grade;
  s.textContent = t.grade;
  return s;
}

function card(t) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'card' + (earned.has(t.id) ? ' earned' : '');
  const row = document.createElement('div');
  row.className = 'row';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', 'Earned: ' + shownName(t));
  box.addEventListener('click', (e) => e.stopPropagation());
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    save(); renderProgress(); render();
  });
  const body = document.createElement('div');
  const h = document.createElement('h3');
  h.textContent = shownName(t);
  const d = document.createElement('p');
  d.className = 'desc';
  d.textContent = shownDesc(t);
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append(gradeTag(t));
  const kind = document.createElement('span');
  kind.className = 'tag'; kind.textContent = t.kind;
  meta.append(kind);
  if (t.missable) { const m = document.createElement('span'); m.className = 'tag miss'; m.textContent = 'missable'; meta.append(m); }
  if (t.hidden === true) { const htag = document.createElement('span'); htag.className = 'tag hiddenT'; htag.textContent = 'hidden'; meta.append(htag); }
  body.append(h, d, meta);
  if (t.target != null) {
    const c = document.createElement('div');
    c.className = 'counter';
    const label = document.createElement('span');
    label.textContent = fmt(counters[t.id] || 0) + ' / ' + fmt(t.target) + ' ' + (t.target_label || '');
    const input = document.createElement('input');
    input.type = 'number'; input.min = '0'; input.max = String(t.target);
    input.value = String(counters[t.id] || 0);
    input.setAttribute('aria-label', 'Count for ' + t.name);
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('change', () => {
      const v = Math.max(0, Math.min(t.target, Number(input.value) || 0));
      counters[t.id] = v;
      if (v >= t.target) earned.add(t.id);
      save(); renderProgress(); render();
    });
    c.append(label, input);
    body.append(c);
  }
  row.append(box, body);
  b.append(row);
  b.addEventListener('click', () => { location.hash = '#/trophy/' + t.id; });
  return b;
}

function filtered() {
  const needle = q.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeSel.value !== 'all' && t.grade !== gradeSel.value) return false;
    if (kindSel.value !== 'all' && t.kind !== kindSel.value) return false;
    if (statusSel.value === 'earned' && !earned.has(t.id)) return false;
    if (statusSel.value === 'unearned' && earned.has(t.id)) return false;
    if (missableOnly.checked && !t.missable) return false;
    if (needle && !(t.name.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle) || t.guide.toLowerCase().includes(needle))) return false;
    return true;
  });
}

function renderChecklist() {
  const list = filtered();
  const head = document.createElement('p');
  head.className = 'countLine';
  head.textContent = 'Showing ' + list.length + ' of 55 trophies · ' + earned.size + ' earned';
  const grid = document.createElement('div');
  grid.className = 'cards';
  if (!list.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match these filters.';
    view.replaceChildren(head, p);
    return;
  }
  for (const t of list) grid.append(card(t));
  view.replaceChildren(head, grid);
}

function renderRoadmap() {
  const frag = document.createDocumentFragment();
  for (const ph of PHASES) {
    const members = trophies.filter((t) => t.phase === ph.n);
    const done = members.filter((t) => earned.has(t.id)).length;
    const box = document.createElement('section');
    box.className = 'phase';
    const h = document.createElement('h2');
    h.textContent = ph.title;
    const when = document.createElement('span');
    when.className = 'when'; when.textContent = ph.when;
    h.append(when);
    const p = document.createElement('p');
    p.textContent = ph.text;
    const prog = document.createElement('p');
    prog.textContent = done + ' of ' + members.length + ' trophies in this phase earned.';
    const ul = document.createElement('ul');
    for (const t of members) {
      const li = document.createElement('li');
      const count = t.target != null ? ' — ' + fmt(counters[t.id] || 0) + '/' + fmt(t.target) + ' ' + (t.target_label || '') : '';
      li.textContent = (earned.has(t.id) ? '✓ ' : '○ ') + shownName(t) + count;
      ul.append(li);
    }
    box.append(h, p, prog, ul);
    frag.append(box);
  }
  view.replaceChildren(frag);
}

function renderMissables() {
  const frag = document.createDocumentFragment();
  const warn = document.createElement('section');
  warn.className = 'warn';
  const h = document.createElement('h2');
  h.textContent = 'Possibly missable: 1 trophy';
  const p1 = document.createElement('p');
  p1.textContent = 'Positive Mental Attitude — meditate at every spot across Leonida. PowerPyx flags it because the first meditation can be missed: there is a meditation at Jason\'s house during Chapter 1. Do it the first time the game offers it, and keep a manual save from before Chapter 1 so you have a way back. There is no mission replay, so a missed first meditation cannot be redone in the same playthrough.';
  const p2 = document.createElement('p');
  p2.textContent = 'PowerPyx counts 18 meditations across 10 spot locations; 15 of 18 count toward the 100% checklist, but this trophy needs every spot.';
  warn.append(h, p1, p2);
  const safe = document.createElement('section');
  safe.className = 'safe';
  const h2 = document.createElement('h2');
  h2.textContent = 'Everything else: safe';
  const p3 = document.createElement('p');
  p3.textContent = 'The published launch guides flag no other missable. Story trophies cannot be missed — they pop automatically as chapters and missions complete — and free-roam continues after the story, so the grind and collectibles stay available. As a precaution, keep manual saves at story milestones anyway, since missions cannot be replayed.';
  safe.append(h2, p3);
  const grid = document.createElement('div');
  grid.className = 'cards';
  for (const t of trophies.filter((t) => t.missable)) grid.append(card(t));
  frag.append(warn, safe, grid);
  view.replaceChildren(frag);
}

function renderSources() {
  const frag = document.createDocumentFragment();
  const box = document.createElement('section');
  box.className = 'phase';
  const h = document.createElement('h2');
  h.textContent = 'The list at a glance';
  const table = document.createElement('table');
  table.className = 'stats';
  const rows = [
    ['Trophies', '55 — 1 platinum, 2 gold, 6 silver, 46 bronze'],
    ['Hidden on PSN', '28 of 55 (the 12 story trophies confirmed hidden; per-trophy status for the rest not confirmed)'],
    ['Online trophies', '0 — all offline single-player'],
    ['Possibly missable', '1 — Positive Mental Attitude'],
    ['Time to platinum', '~200 hours (PowerPyx); 250+ hours (Push Square)'],
    ['Difficulty', '4/10 (PowerPyx)'],
    ['Playthroughs', '1 minimum; no mission replay, free-roam after the story'],
  ];
  for (const [k, v] of rows) {
    const tr = document.createElement('tr');
    const th = document.createElement('th'); th.textContent = k;
    const td = document.createElement('td'); td.textContent = v;
    tr.append(th, td); table.append(tr);
  }
  const h2 = document.createElement('h2');
  h2.textContent = 'Sources';
  const list = document.createElement('div');
  list.className = 'srcList';
  // Source addresses come from the trophies' own source lists in data/trophies.json;
  // they are shown as plain text, never as links, and the app fetches nothing.
  const seen = new Set();
  const notes = {
    'exophase.com': 'Exophase — Grand Theft Auto VI Trophies (PS5): names, descriptions, grades.',
    'psnprofiles.com': 'PSNProfiles — Grand Theft Auto VI trophies: grades and PSN count targets.',
    'powerpyx.com': 'PowerPyx — GTA 6 Trophy Guide & Roadmap: the single missable flag, the ~200-hour estimate, 18 meditations / 10 spots, 80 challenges, 130 stunt jumps, 39 gang operations.',
    'sixshore.com': 'SixShore — GTA 6 Trophy and Achievement List: 12 story trophies, all hidden, none missable; 27 visible / 28 hidden.',
  };
  for (const t of trophies) for (const s of t.sources) {
    if (seen.has(s)) continue;
    seen.add(s);
    const host = Object.keys(notes).find((h) => s.includes(h)) || '';
    const p = document.createElement('p');
    p.textContent = (notes[host] || 'Source: ') + ' ' + s;
    list.append(p);
  }
  const h3 = document.createElement('h2');
  h3.textContent = 'Method — what we did not do';
  const p = document.createElement('p');
  p.textContent = 'Every guide is written in this entry\'s own words from the official descriptions and the PSN count targets. No guide text was copied from any other site. Where a location or trigger could not be verified in a source we could check, the guide says so plainly instead of inventing it. No Rockstar logo or official artwork is used; all visuals are original CSS. The app makes no network requests.';
  box.append(h, table, h2, list, h3, p);
  frag.append(box);
  view.replaceChildren(frag);
}

function openDetail(id) {
  const t = byId.get(id);
  if (!t) { detail.hidden = true; return; }
  detail.replaceChildren();
  const close = document.createElement('button');
  close.type = 'button'; close.className = 'closeBtn'; close.textContent = 'Close ✕';
  close.addEventListener('click', () => { detail.hidden = true; location.hash = '#/checklist'; });
  const h = document.createElement('h2');
  h.textContent = shownName(t);
  const d = document.createElement('p');
  d.className = 'desc'; d.textContent = shownDesc(t);
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append(gradeTag(t));
  for (const label of [t.kind, 'phase ' + t.phase, earned.has(t.id) ? 'earned ✓' : 'not earned yet']) {
    const s = document.createElement('span'); s.className = 'tag'; s.textContent = label; meta.append(s);
  }
  if (t.missable) { const m = document.createElement('span'); m.className = 'tag miss'; m.textContent = 'missable'; meta.append(m); }
  detail.append(close, h, d, meta);
  if (t.target != null) {
    const c = document.createElement('p');
    c.textContent = 'Your count: ' + fmt(counters[t.id] || 0) + ' of ' + fmt(t.target) + ' ' + (t.target_label || '') + '. Change it on the checklist card.';
    detail.append(c);
  }
  const gh = document.createElement('h3'); gh.textContent = 'Guide';
  const gp = document.createElement('p'); gp.textContent = t.guide;
  const sh = document.createElement('h3'); sh.textContent = 'Sources';
  const sp = document.createElement('p'); sp.className = 'srcs';
  sp.textContent = t.sources.join(' · ');
  detail.append(gh, gp, sh, sp);
  detail.hidden = false;
}

function route() {
  const hash = location.hash || '#/checklist';
  const parts = hash.replace(/^#\//, '').split('/');
  const viewName = parts[0] || 'checklist';
  document.querySelectorAll('.tabs a').forEach((a) => {
    a.classList.toggle('active', a.dataset.view === viewName || (viewName === 'trophy' && a.dataset.view === 'checklist'));
  });
  $('filters').style.display = viewName === 'checklist' ? '' : 'none';
  if (viewName === 'trophy') { renderChecklist(); openDetail(Number(parts[1])); }
  else { detail.hidden = true; }
  if (viewName === 'roadmap') renderRoadmap();
  else if (viewName === 'missables') renderMissables();
  else if (viewName === 'sources') renderSources();
  else renderChecklist();
}

function render() { route(); }

[q, gradeSel, kindSel, statusSel, missableOnly].forEach((el) => el.addEventListener('input', renderChecklist));
spoilersBox.addEventListener('change', () => { spoilers = spoilersBox.checked; save(); renderProgress(); render(); });
window.addEventListener('hashchange', route);

$('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ earned: [...earned], counters, spoilers }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  $('toolMsg').textContent = 'Progress exported.';
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = (data.earned || data || []).filter((n) => Number.isInteger(n) && byId.has(n));
    earned.clear(); ids.forEach((n) => earned.add(n));
    Object.assign(counters, data.counters || {});
    save(); renderProgress(); render();
    $('toolMsg').textContent = 'Progress imported: ' + earned.size + ' earned.';
  } catch {
    $('toolMsg').textContent = 'That file could not be read as progress JSON.';
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset all ticks and counters?')) return;
  earned.clear();
  for (const k of Object.keys(counters)) delete counters[k];
  save(); renderProgress(); render();
  $('toolMsg').textContent = 'Progress reset.';
});

renderProgress();
render();
