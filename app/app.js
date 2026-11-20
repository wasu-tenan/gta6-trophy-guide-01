// Leonida Ledger — a trophy guide and tracker for GTA VI on PS5.
// Loads the official list (data/trophies.json) and the guide notes written for
// it (data/guides.json), keeps progress in this browser, and shows four views:
// the checklist, a five-stage roadmap, the missable trophies, and an about page.
// Everything runs offline from the app's own files.
const STORE_KEY = 'leonida-ledger-v1';
const DEMO_IDS = [2, 3, 4, 5, 8, 16, 20, 21, 28, 35, 42, 44, 46];
const STAGES = [
  { n: 1, title: 'First steps in Leonida', blurb: 'The opening chapters and the first activities worth trying.' },
  { n: 2, title: 'The story unfolds', blurb: 'Chapters 3 and 4, and the trophies tied to their missions.' },
  { n: 3, title: 'Side Leonida', blurb: 'Activities, collectibles and exploring every corner of the state.' },
  { n: 4, title: 'Heat & heists', blurb: 'Robberies, combat and life at four stars and above.' },
  { n: 5, title: 'The long tail & platinum', blurb: 'Character finals, 100% completion and the last one-offs.' },
];
const KIND_LABELS = {
  story: 'Story', activity: 'Activity', combat: 'Combat', exploration: 'Exploration',
  collectible: 'Collectible', misc: 'Misc', completion: 'Completion', platinum: 'Platinum',
};

const params = new URLSearchParams(location.search);
const viewEl = document.getElementById('view');
const detailEl = document.getElementById('detail');

const trophiesDoc = await (await fetch('data/trophies.json')).json();
const guidesDoc = await (await fetch('data/guides.json')).json();
const TROPHIES = trophiesDoc.trophies;
const GUIDES = new Map(guidesDoc.guides.map((g) => [g.id, g]));
const byId = new Map(TROPHIES.map((t) => [t.id, t]));

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
    return {
      earned: new Set(Array.isArray(raw.earned) ? raw.earned : []),
      notes: raw.notes && typeof raw.notes === 'object' ? raw.notes : {},
      spoiler: typeof raw.spoiler === 'boolean' ? raw.spoiler : true,
    };
  } catch {
    return { earned: new Set(), notes: {}, spoiler: true };
  }
}
const state = loadState();
if (params.get('demo') === '1') {
  for (const id of DEMO_IDS) state.earned.add(id);
}
if (params.get('spoiler') === '0') state.spoiler = false;
if (params.get('spoiler') === '1') state.spoiler = true;

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    earned: [...state.earned],
    notes: state.notes,
    spoiler: state.spoiler,
  }));
}

function isHidden(t) {
  return state.spoiler && !state.earned.has(t.id) && GUIDES.get(t.id)?.kind === 'story';
}

function gradeChip(grade) {
  const chip = document.createElement('span');
  chip.className = `grade-chip grade-${grade}`;
  chip.textContent = grade;
  return chip;
}

function trophyCard(t) {
  const guide = GUIDES.get(t.id);
  const card = document.createElement('article');
  card.className = 'card' + (state.earned.has(t.id) ? ' earned' : '');
  if (isHidden(t)) card.classList.add('spoiled');
  const name = document.createElement('h3');
  name.className = 'spoiler-text';
  name.textContent = isHidden(t) ? 'Story trophy' : t.name;
  card.append(name, gradeChip(t.grade));
  const desc = document.createElement('p');
  desc.className = 'desc spoiler-text';
  desc.textContent = isHidden(t) ? 'Hidden until earned.' : t.description;
  card.append(desc);
  if (isHidden(t)) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Story trophy — hidden until earned.';
    card.append(note);
  }
  const row = document.createElement('div');
  row.className = 'chip-row';
  const tick = document.createElement('label');
  tick.className = 'tick';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.has(t.id);
  box.addEventListener('change', (event) => {
    event.stopPropagation();
    if (box.checked) state.earned.add(t.id);
    else state.earned.delete(t.id);
    saveState();
    render();
  });
  tick.append(box, document.createTextNode(state.earned.has(t.id) ? 'Earned' : 'Not earned yet'));
  row.append(tick);
  if (guide?.missable) {
    const flag = document.createElement('span');
    flag.className = 'flag';
    flag.textContent = 'Missable';
    row.append(flag);
  }
  const kind = document.createElement('span');
  kind.className = 'tick';
  kind.textContent = KIND_LABELS[guide?.kind ?? 'misc'];
  row.append(kind);
  card.append(row);
  card.addEventListener('click', () => openDetail(t.id));
  return card;
}

function cardsGrid(list) {
  const grid = document.createElement('div');
  grid.className = 'cards';
  for (const t of list) grid.append(trophyCard(t));
  return grid;
}

function filteredList() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const grade = document.getElementById('grade').value;
  const kind = document.getElementById('kind').value;
  const earnedFilter = document.getElementById('earned-filter').value;
  return TROPHIES.filter((t) => {
    const guide = GUIDES.get(t.id);
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind !== 'all' && guide?.kind !== kind) return false;
    if (earnedFilter === 'earned' && !state.earned.has(t.id)) return false;
    if (earnedFilter === 'todo' && state.earned.has(t.id)) return false;
    if (q && !`${t.name} ${t.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderChecklist() {
  const list = filteredList();
  viewEl.replaceChildren();
  if (list.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match those filters.';
    viewEl.append(p);
    return;
  }
  viewEl.append(cardsGrid(list));
}

function renderRoadmap() {
  viewEl.replaceChildren();
  for (const stage of STAGES) {
    const members = TROPHIES.filter((t) => GUIDES.get(t.id)?.stage === stage.n);
    const got = members.filter((t) => state.earned.has(t.id)).length;
    const section = document.createElement('section');
    section.className = 'stage';
    const h = document.createElement('h2');
    h.textContent = `Stage ${stage.n} — ${stage.title}`;
    const p = document.createElement('p');
    p.textContent = `${stage.blurb} ${got} of ${members.length} earned.`;
    section.append(h, p, cardsGrid(members));
    viewEl.append(section);
  }
}

function renderMissables() {
  const list = TROPHIES.filter((t) => GUIDES.get(t.id)?.missable);
  viewEl.replaceChildren();
  const intro = document.createElement('p');
  intro.textContent = 'Seven trophies are flagged missable: tied to a story strand, a partner moment or a one-time choice that may not come back. Finish them before their window closes — the flags are read from the official descriptions and are not yet checked in the game.';
  viewEl.append(intro, cardsGrid(list));
}

function renderAbout() {
  viewEl.replaceChildren();
  const section = document.createElement('section');
  section.className = 'about';
  section.innerHTML = `
    <h2>How this ledger works</h2>
    <p>The checklist holds the official 55 trophies for Grand Theft Auto VI on PlayStation 5: 1 platinum, 2 gold, 6 silver and 46 bronze. Tick a trophy off and it stays ticked in this browser; export the ticks to a file to back them up, or import them on another device.</p>
    <p>The roadmap orders the hunt into five stages, from the opening chapters to the platinum. The missables view flags the seven trophies tied to a story strand, a partner moment or a one-time choice.</p>
    <p>Every trophy has a guide note written from its official description, with its sources named beside it. Steps labelled own advice are my own suggestions, not yet checked in the game — GTA VI is unreleased, so treat every note as a plan, not a fact.</p>
    <p>The spoiler setting blurs story trophies you have not earned yet, so the ledger will not spoil the plot while you play.</p>
    <h2>Demo links</h2>
    <p>Add <code>?demo=1</code> to seed 13 earned trophies, <code>?spoiler=0</code> to reveal story trophies, or <code>?trophy=17</code> to open one guide on load.</p>`;
  viewEl.append(section);
}

function renderProgress() {
  const total = TROPHIES.length;
  const got = state.earned.size;
  document.getElementById('progress-count').textContent = `${got} of ${total} earned`;
  document.getElementById('progress-fill').style.width = `${(got / total) * 100}%`;
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
    const have = TROPHIES.filter((t) => t.grade === grade && state.earned.has(t.id)).length;
    const all = TROPHIES.filter((t) => t.grade === grade).length;
    return `${grade} ${have}/${all}`;
  });
  document.getElementById('progress-grades').textContent = parts.join(' · ');
}

function currentView() {
  const hash = location.hash.replace(/^#\/?/, '');
  return ['checklist', 'roadmap', 'missables', 'about'].includes(hash) ? hash : 'checklist';
}

function render() {
  renderProgress();
  document.getElementById('spoiler').checked = state.spoiler;
  for (const link of document.querySelectorAll('#tabs a')) {
    link.classList.toggle('active', link.dataset.view === currentView());
  }
  if (currentView() === 'roadmap') renderRoadmap();
  else if (currentView() === 'missables') renderMissables();
  else if (currentView() === 'about') renderAbout();
  else renderChecklist();
}

function openDetail(id) {
  const t = byId.get(id);
  const guide = GUIDES.get(id);
  if (!t || !guide) return;
  document.getElementById('detail-name').textContent = isHidden(t) ? 'Story trophy' : t.name;
  const chip = document.getElementById('detail-grade');
  chip.className = `grade-chip grade-${t.grade}`;
  chip.textContent = t.grade;
  document.getElementById('detail-desc').textContent = isHidden(t)
    ? 'Hidden until earned. Turn the spoiler setting off, or earn this trophy, to read its guide.'
    : t.description;
  document.getElementById('detail-meta').textContent = isHidden(t)
    ? ''
    : `Kind: ${KIND_LABELS[guide.kind]} · Roadmap stage ${guide.stage}${guide.missable ? ' · Missable — finish before its window closes' : ''}`;
  const steps = document.getElementById('detail-steps');
  steps.replaceChildren();
  if (!isHidden(t)) {
    for (const step of guide.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      steps.append(li);
    }
  }
  document.getElementById('detail-sources').textContent = isHidden(t)
    ? ''
    : `Sources: ${guide.sources.join(' · ')}`;
  const note = document.getElementById('detail-note');
  note.value = state.notes[id] ?? '';
  note.oninput = () => {
    state.notes[id] = note.value;
    saveState();
  };
  detailEl.hidden = false;
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('detail-close').addEventListener('click', () => {
  detailEl.hidden = true;
});
document.getElementById('search').addEventListener('input', render);
document.getElementById('grade').addEventListener('change', render);
document.getElementById('kind').addEventListener('change', render);
document.getElementById('earned-filter').addEventListener('change', render);
document.getElementById('spoiler').addEventListener('change', (event) => {
  state.spoiler = event.target.checked;
  saveState();
  render();
});
document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ earned: [...state.earned], notes: state.notes }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import').click());
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    state.earned = new Set((data.earned ?? []).filter((id) => byId.has(id)));
    state.notes = data.notes && typeof data.notes === 'object' ? data.notes : {};
    saveState();
    render();
  } catch {
    alert('That file is not a Leonida Ledger progress export.');
  }
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks and notes?')) return;
  state.earned.clear();
  state.notes = {};
  saveState();
  render();
});
window.addEventListener('hashchange', render);

render();
if (params.get('trophy')) {
  const id = Number(params.get('trophy'));
  if (byId.has(id)) openDetail(id);
}
