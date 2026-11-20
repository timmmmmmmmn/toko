// Toko: de winkel voor al onze apps. In de Android-app (window.TokoNative) installeert, opent en werkt
// Toko apps zelf bij; in een browser zijn het gewone downloads en links.

const native = window.TokoNative || null;
const glassUi = !!(native?.glassUi && native.glassUi());
// Glisse (glisse.js, zie glisse/ in Notities): null als het toestel het niet aankan, dan blijft alles zoals het was.
const glisse = document.documentElement.classList.contains('glisse')
  ? import('./glisse.js').then((g) => (g.kan() ? g : null)).catch(() => null).then((g) => {
    if (!g) document.documentElement.classList.remove('glisse');
    return g;
  })
  : Promise.resolve(null);
if (glassUi) document.documentElement.classList.add('glass');

const API = location.protocol === 'file:' ? 'https://toko.timvanbergen.nl' : '';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const ICONS = {
  compass: 'M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18zM15.5 8.5l-2 5-5 2 2-5z',
  grid: 'M5 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM15 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM5 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM15 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13zM15.5 15.5 20 20',
  close: 'M6 6l12 12M18 6 6 18',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
  globe: 'M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z',
  contrast: 'M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18zM12 3v18',
  check: 'M5 12.5l4.5 4.5L19 7',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  info: 'M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0-18zM12 11v6M12 7.5h.01',
  basket: 'M4 10h16l-1.6 9.2a1 1 0 0 1-1 .8H6.6a1 1 0 0 1-1-.8zM8 10l3-6M16 10l-3-6M9 14v3M15 14v3M12 14v3',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
};
function icon(name, cls = '') {
  return `<svg class="i${name === 'more' ? ' dots' : ''}${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name] || ''}"/></svg>`;
}
function fillIcons(root = document) {
  $$('[data-icon]', root).forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
}

const SOORTEN = ['Spellen', 'Productiviteit', 'Sociaal', 'Muziek en tv', 'Hulpmiddelen'];
const state = { apps: [], web: [], hier: {}, tab: 'ontdek', soort: '', zoek: '', bezig: {}, open: null, geladen: false };

// ---------- Kleine hulpjes ----------

function haptic(kind = 'tick') {
  try { native?.haptic(kind); } catch (e) {}
}

let toastTimer;
function toast(text, action) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(text)}</span>`;
  if (action) {
    const b = document.createElement('button');
    b.textContent = action.label;
    b.onclick = () => { el.hidden = true; action.run(); };
    el.appendChild(b);
  }
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, action ? 6000 : 2800);
}

const isPhone = () => matchMedia('(max-width: 759px)').matches;
const isAndroid = /Android/.test(navigator.userAgent);

function vergelijk(a, b) {
  const x = String(a || '0').split('.').map(Number), y = String(b || '0').split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d;
  }
  return 0;
}
const mb = (n) => (n ? (n / 1048576 < 10 ? (n / 1048576).toFixed(1).replace('.', ',') : Math.round(n / 1048576)) + ' MB' : '');
const datum = (d) => (d ? new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

// ---------- Gegevens ----------

async function laad({ stil = false } = {}) {
  const dot = $('#sync');
  dot.className = 'sync-dot busy';
  $('#refresh').classList.add('draait');
  try {
    const r = await fetch(API + '/api/android', { cache: 'no-cache' });
    if (!r.ok) throw new Error();
    const d = await r.json();
    state.apps = d.apps;
    state.web = d.web;
    try { localStorage.setItem('toko-catalogus', JSON.stringify(d)); } catch (e) {}
    dot.className = 'sync-dot';
    dot.title = 'Bijgewerkt';
  } catch (e) {
    dot.className = 'sync-dot err';
    dot.title = 'Geen verbinding';
    if (!stil) toast('Kon Toko niet bijwerken. Heb je internet?');
  }
  $('#refresh').classList.remove('draait');
  state.geladen = true;
  kijk();
  render();
}

// Wat staat er op deze telefoon (alleen in de app)
function kijk() {
  if (!native) return;
  try {
    state.hier = JSON.parse(native.installed(JSON.stringify(state.apps.map((a) => a.pakket))) || '{}');
  } catch (e) {
    state.hier = {};
  }
}

function stand(app) {
  if (app.url) return 'web';
  if (state.bezig[app.id] !== undefined) return 'bezig';
  if (!native) return app.versie ? 'download' : 'geen';
  const h = state.hier[app.pakket];
  if (h) return app.versie && vergelijk(app.versie, h.naam) > 0 ? 'update' : 'ok';
  return app.versie ? 'niet' : 'geen';
}
const updates = () => state.apps.filter((a) => stand(a) === 'update');

// ---------- Weergave ----------

function ico(app, cls = '') {
  const img = app.url ? (['rotterdam', 'shane'].includes(app.id) ? `/img/app/${app.id}.png` : null) : `/img/app/${app.id}.png`;
  return `<span class="ico${cls ? ' ' + cls : ''}" style="--c:${esc(app.kleur)}">${img ? `<img src="${img}" alt="" loading="lazy">` : `<span>${esc(app.naam[0])}</span>`}</span>`;
}

function knop(app, groot = false) {
  const s = stand(app), cls = `btn ${groot ? 'big' : 'small'}`;
  if (s === 'web') return `<a class="${cls} soft" href="${esc(app.url)}" target="_blank" rel="noopener" data-stop>Spelen</a>`;
  if (s === 'geen') return `<button class="${cls}" disabled data-stop>Binnenkort</button>`;
  if (s === 'download') return `<a class="${cls} ${groot ? 'primary' : 'soft'}" href="${esc(app.apk)}" data-stop data-download="${esc(app.id)}">${groot ? icon('download') : ''}<span>${isAndroid ? 'Downloaden' : 'Download (Android)'}</span></a>`;
  if (s === 'bezig') {
    const p = state.bezig[app.id];
    const tekst = p < 0 ? 'Installeren…' : `${Math.round(p * 100)}%`;
    return `<button class="${cls} bezig${p < 0 ? ' onbekend' : ''}" style="--p:${Math.max(0, p) * 100}%" disabled data-stop data-bezig="${esc(app.id)}"><span>${tekst}</span></button>`;
  }
  if (s === 'update') return `<button class="${cls} primary" data-actie="installeer" data-id="${esc(app.id)}" data-stop><span>Bijwerken</span></button>`;
  if (s === 'ok' && app.id === 'toko') return `<button class="${cls}" disabled data-stop>Actueel</button>`;
  if (s === 'ok') return `<button class="${cls} soft" data-actie="open" data-id="${esc(app.id)}" data-stop><span>Openen</span></button>`;
  return `<button class="${cls} primary" data-actie="installeer" data-id="${esc(app.id)}" data-stop><span>Installeren</span></button>`;
}

function rij(app) {
  const s = stand(app);
  let sub = esc(app.kort);
  if (s === 'update') sub = `<span class="new">Versie ${esc(app.versie)}</span> · ${esc(mb(app.grootte))}`;
  return `<div class="app-row" data-id="${esc(app.id)}" role="button" tabindex="0">${ico(app)}
    <span class="app-main"><span class="app-name">${esc(app.naam)}</span><span class="app-sub">${sub}</span></span>${knop(app)}</div>`;
}

function filter(list) {
  const q = state.zoek.trim().toLowerCase();
  return list.filter((a) => (!state.soort || a.soort === state.soort) &&
    (!q || `${a.naam} ${a.kort} ${a.tekst} ${a.soort}`.toLowerCase().includes(q)));
}

function renderChips() {
  const el = $('#chips');
  el.hidden = state.tab !== 'ontdek';
  el.innerHTML = [['', 'Alles'], ...SOORTEN.map((s) => [s, s])]
    .map(([v, t]) => `<button class="chip" type="button" data-soort="${esc(v)}" aria-pressed="${state.soort === v}">${esc(t)}</button>`).join('');
}

function leeg(ic, titel, tekst) {
  return `<div class="list-empty">${icon(ic)}<b>${esc(titel)}</b>${tekst ? `<span>${tekst}</span>` : ''}</div>`;
}

function renderOntdek() {
  const apps = filter(state.apps), web = filter(state.web);
  let html = '';
  if (!state.zoek && !state.soort) {
    // elke dag een andere app uitgelicht
    const met = state.apps.filter((a) => a.beeld);
    const uit = met[Math.floor(Date.now() / 86400000) % Math.max(1, met.length)];
    if (uit) {
      html += `<div class="hero" role="button" tabindex="0" data-id="${esc(uit.id)}"><img class="hero-img" src="/img/beeld/${esc(uit.beeld)}" alt="">
        <span class="hero-foot">${ico(uit, 'small')}<span class="app-main"><span class="hero-kicker">Uitgelicht</span><span class="app-name">${esc(uit.naam)}</span><span class="app-sub">${esc(uit.kort)}</span></span>${knop(uit)}</span></div>`;
    }
  }
  if (apps.length) html += `<div class="list-h">${native || isAndroid ? 'Apps' : 'Android-apps'}</div><div class="rows grid">${apps.map(rij).join('')}</div>`;
  if (web.length) html += `<div class="list-h">In de browser</div><div class="rows grid">${web.map(rij).join('')}</div>`;
  if (!apps.length && !web.length) html = leeg('search', 'Niets gevonden', state.zoek ? `Geen apps met “${esc(state.zoek)}”.` : '');
  return html;
}

function renderMijn() {
  if (!native) {
    return `<div class="list-empty">${icon('phone')}<b>Toko op je telefoon</b><span>Met de Android-app van Toko installeer je alles met één tik en worden je apps vanzelf bijgewerkt.</span>
      ${toko() ? knop(toko(), true).replace('btn big', 'btn') : ''}</div>`;
  }
  const op = state.apps.filter((a) => ['ok', 'update'].includes(stand(a)) || (state.bezig[a.id] !== undefined && state.hier[a.pakket]));
  const niet = state.apps.filter((a) => !op.includes(a));
  let html = '';
  html += op.length ? `<div class="list-h">Op deze telefoon</div><div class="rows grid">${op.map(rij).join('')}</div>` : '';
  html += niet.length ? `<div class="list-h">Nog niet geïnstalleerd</div><div class="rows grid">${niet.map(rij).join('')}</div>` : '';
  return html || leeg('basket', 'Nog niets', 'Er staan nog geen apps uit Toko op deze telefoon.');
}

function renderUpdates() {
  if (!native) return leeg('download', 'Updates gaan vanzelf', 'In de Toko-app zie je hier welke apps een nieuwe versie hebben.');
  const lijst = updates();
  const bezig = state.apps.filter((a) => state.bezig[a.id] !== undefined && !lijst.includes(a));
  if (!lijst.length && !bezig.length) return leeg('check', 'Alles is bijgewerkt', 'Je hebt overal de nieuwste versie.');
  return `<div class="list-h"><span>${lijst.length === 1 ? '1 update' : `${lijst.length} updates`}</span>${lijst.length > 1 ? '<button type="button" data-actie="alles">Alles bijwerken</button>' : ''}</div>
    <div class="rows">${[...lijst, ...bezig].map(rij).join('')}</div>`;
}

const toko = () => state.apps.find((a) => a.id === 'toko');

function render() {
  renderChips();
  const list = $('#list');
  if (!state.geladen) list.innerHTML = '';
  else if (!state.apps.length) list.innerHTML = leeg('basket', 'Toko kon niet laden', 'Controleer je internetverbinding en tik op vernieuwen.');
  else list.innerHTML = state.tab === 'apps' ? renderMijn() : state.tab === 'updates' ? renderUpdates() : renderOntdek();
  const n = updates().length;
  $('#badge').hidden = !n;
  $('#badge').textContent = n;
  renderNav();
  if (state.open) vulDetail();
}

function renderNav() {
  const tabs = ['ontdek', 'apps', 'updates', 'meer'];
  $$('#navPill [data-nav]').forEach((b) => b.setAttribute('aria-current', String(b.dataset.nav === state.tab)));
  $('#navInd').style.transform = `translateX(${tabs.indexOf(state.tab) * 100}%)`;
  syncGlassBar();
}

function setTab(t) {
  state.tab = t;
  $('#list').scrollTop = 0;
  render();
}

// Alleen de knoppen bijwerken tijdens een download (niet de hele lijst, dan blijft scrollen rustig)
function renderKnoppen(id) {
  const app = state.apps.find((a) => a.id === id);
  if (!app) return;
  $$(`.app-row[data-id="${id}"] .btn, .hero[data-id="${id}"] .btn`).forEach((b) => { b.outerHTML = knop(app); });
  if (state.open === id) $('#dKnop').innerHTML = knop(app, true);
}

// ---------- Detail ----------

function detail(id) {
  const app = [...state.apps, ...state.web].find((a) => a.id === id);
  if (!app) return;
  haptic();
  state.open = id;
  openSheet('', '');
  vulDetail();
}

function vulDetail() {
  const app = [...state.apps, ...state.web].find((a) => a.id === state.open);
  if (!app) return;
  const s = stand(app), h = state.hier[app.pakket];
  const meta = [app.soort, app.versie && `versie ${app.versie}`, mb(app.grootte)].filter(Boolean).join(' · ');
  const tweede = native && ['ok', 'update'].includes(s) && app.id !== 'toko'
    ? `<button class="btn big" data-actie="${s === 'update' ? 'open' : 'verwijder'}" data-id="${esc(app.id)}">${s === 'update' ? 'Openen' : 'Verwijderen'}</button>` : '';
  const feiten = [
    app.versie && ['Nieuwste versie', esc(app.versie)],
    h && ['Op deze telefoon', esc(h.naam)],
    app.datum && ['Bijgewerkt', esc(datum(app.datum))],
    app.grootte && ['Grootte', esc(mb(app.grootte))],
    ['Gemaakt door', 'Tim van Bergen'],
  ].filter(Boolean);
  const body = $('#sheetBody');
  body.innerHTML = `
    <div class="d-kop">${ico(app, 'big')}<div><h2 class="d-naam">${esc(app.naam)}</h2><div class="d-meta">${esc(meta)}</div></div></div>
    <div class="d-acties"><span id="dKnop" style="display:contents">${knop(app, true)}</span>${tweede}</div>
    ${app.beeld ? `<img class="d-beeld" src="/img/beeld/${esc(app.beeld)}" alt="">` : ''}
    <p class="d-tekst">${esc(app.tekst)}</p>
    ${app.notities ? `<div class="group"><h3>Wat is er nieuw</h3><p>${esc(app.notities)}</p></div>` : ''}
    ${app.url ? '' : `<div class="group"><h3>Informatie</h3><dl class="feiten">${feiten.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`}
    <div class="group links">
      ${app.site || app.url ? `<a class="btn small" href="${esc(app.site || app.url)}" target="_blank" rel="noopener">${icon('globe')}Website</a>` : ''}
      ${app.bron ? `<a class="btn small" href="${esc(app.bron)}" target="_blank" rel="noopener">${icon('code')}Broncode</a>` : ''}
    </div>
    ${!native && !app.url ? `<p class="uitleg">Android vraagt de eerste keer of je apps van buiten de Play Store mag installeren. Met de Toko-app gaat dat daarna vanzelf.</p>` : ''}`;
  $('#sheetTitle').textContent = '';
}

// ---------- Installeren ----------

function installeer(id) {
  const app = state.apps.find((a) => a.id === id);
  if (!app || !native || state.bezig[id] !== undefined) return;
  haptic('confirm');
  state.bezig[id] = 0;
  renderKnoppen(id);
  try {
    native.install(app.id, app.apk, app.pakket, app.naam);
  } catch (e) {
    delete state.bezig[id];
    toast('Installeren lukte niet');
    render();
  }
}

// De app meldt de voortgang (0–1, of -1 als Android aan het installeren is) en de uitkomst.
window.tokoVoortgang = (id, p) => {
  if (state.bezig[id] === undefined) return;
  state.bezig[id] = p;
  renderKnoppen(id);
};
window.tokoKlaar = (id, ok, bericht) => {
  delete state.bezig[id];
  const app = state.apps.find((a) => a.id === id);
  kijk();
  render();
  if (ok) {
    haptic('confirm');
    toast(`${app?.naam || 'De app'} is ${bericht === 'bijgewerkt' ? 'bijgewerkt' : 'geïnstalleerd'}`, app && app.id !== 'toko' ? { label: 'Openen', run: () => native.open(app.pakket) } : null);
  } else if (bericht) {
    haptic('reject');
    toast(bericht);
  }
};
window.tokoToast = toast;
// Iets geïnstalleerd of verwijderd (ook buiten Toko om)
window.tokoVeranderd = () => { kijk(); render(); };

async function allesBijwerken() {
  const lijst = updates();
  // Toko zelf als laatste: die start opnieuw na het bijwerken
  lijst.sort((a, b) => (a.id === 'toko') - (b.id === 'toko'));
  for (const app of lijst) installeer(app.id);
}

function openApp(id) {
  const app = state.apps.find((a) => a.id === id);
  if (!app) return;
  haptic();
  if (!native.open(app.pakket)) toast('Openen lukte niet');
}

function verwijder(id) {
  const app = state.apps.find((a) => a.id === id);
  if (!app) return;
  haptic('long');
  native.uninstall(app.pakket);
}

// ---------- Paneel en menu ----------

function openSheet(title, html) {
  closeMenu();
  $('#sheetTitle').textContent = title;
  const body = $('#sheetBody');
  body.innerHTML = html;
  body.scrollTop = 0;
  const wasOpen = !$('#sheetBack').hidden;
  $('#sheetBack').hidden = false;
  if (!wasOpen) history.pushState({ sheet: true }, '');
  syncGlassBar();
  return body;
}

function closeSheet(fromHistory = false) {
  if ($('#sheetBack').hidden) return;
  $('#sheetBack').hidden = true;
  state.open = null;
  syncGlassBar();
  if (!fromHistory && history.state?.sheet) history.back();
}

let menuPicks = new Map();
function menu(from, rows) {
  rows = rows.filter(Boolean).map((r, i) => ({ ...r, id: r.id || String(i) }));
  menuPicks = new Map(rows.filter((r) => r.run).map((r) => [r.id, r.run]));
  haptic();
  const box = from.getBoundingClientRect();
  if (native?.glassMenu) {
    try {
      const dark = document.documentElement.dataset.theme === 'donker';
      const items = rows.map(({ run, icon: name, ...r }) => ({ ...r, ...(name ? { icon: ICONS[name] } : {}) }));
      if (native.glassMenu(JSON.stringify({ x: box.left, y: box.top, w: box.width, h: box.height, dark, items }))) return;
    } catch (e) { /* dan het gewone menu */ }
  }
  closeMenu();
  const back = document.createElement('div');
  back.className = 'menu-back';
  const el = document.createElement('div');
  el.className = 'menu';
  el.setAttribute('role', 'menu');
  const checks = rows.some((r) => r.checked !== undefined);
  el.innerHTML = rows.map((r) => {
    if (r.separator) return '<hr>';
    return `<button role="menuitem" data-id="${esc(r.id)}"${r.disabled ? ' disabled' : ''}>
      ${checks ? `<span class="ck-mark">${r.checked ? '✓' : ''}</span>` : ''}${r.icon ? icon(r.icon) : ''}
      <span>${esc(r.title)}${r.subtitle ? `<small>${esc(r.subtitle)}</small>` : ''}</span></button>`;
  }).join('');
  document.body.append(back, el);
  const w = el.offsetWidth, h = el.offsetHeight;
  let left = Math.max(12, Math.min(box.right - w, innerWidth - w - 12));
  let top = box.top - h - 8;
  if (top < 12) top = box.bottom + 6;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  back.onclick = closeMenu;
  el.onclick = (e) => {
    const b = e.target.closest('button[data-id]');
    if (!b) return;
    closeMenu();
    menuPicks.get(b.dataset.id)?.();
  };
}
function closeMenu() {
  $$('.menu, .menu-back').forEach((e) => e.remove());
}
window.tokoGlassPick = (id) => menuPicks.get(id)?.();

function meerMenu(from) {
  const pref = (() => { try { return localStorage.getItem('theme') || 'systeem'; } catch (e) { return 'systeem'; } })();
  menu(from, [
    { title: 'Weergave', subtitle: { systeem: 'Systeem', licht: 'Licht', donker: 'Donker' }[pref], icon: 'contrast', run: weergave },
    native && { title: 'Controleren op updates', icon: 'refresh', run: () => { laad(); native.checkForUpdate(); } },
    { title: 'Toko voor Lumia', subtitle: 'Windows 10 Mobile', icon: 'phone', run: () => window.open('/lumia/', '_blank') },
    { separator: true },
    { title: 'Broncode', icon: 'code', run: () => window.open('https://github.com/timmmmmmmmn/toko', '_blank') },
    { title: 'Over Toko', icon: 'info', run: over },
  ]);
}

function weergave() {
  const pref = (() => { try { return localStorage.getItem('theme') || 'systeem'; } catch (e) { return 'systeem'; } })();
  const body = openSheet('Weergave', `<div class="group" style="border:0"><div class="seg" id="themeSeg" role="radiogroup">
    ${[['systeem', 'Systeem'], ['licht', 'Licht'], ['donker', 'Donker']].map(([v, t]) => `<button type="button" role="radio" data-theme="${v}" aria-checked="${pref === v}">${t}</button>`).join('')}
    </div></div>`);
  glisseMod?.segmenten($('#themeSeg', body));
  body.onclick = (e) => {
    const b = e.target.closest('[data-theme]');
    if (!b) return;
    theme(b.dataset.theme);
    $$('[data-theme]', body).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    haptic();
  };
}

function theme(p) {
  try { localStorage.setItem('theme', p); } catch (e) {}
  const dark = p === 'donker' || (p === 'systeem' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'donker' : 'licht';
  try { native?.setDark(dark); } catch (e) {}
  syncGlassBar();
}

function over() {
  const versie = native ? native.appVersion() : '';
  openSheet('Over Toko', `<div class="d-kop"><span class="ico big" style="--c:#56CBF5"><img src="/img/app/toko.png" alt=""></span>
    <div><h2 class="d-naam">Toko</h2><div class="d-meta">${versie ? `Versie ${esc(versie)} · ` : ''}Tim van Bergen</div></div></div>
    <p class="d-tekst">Toko is de winkel voor alle apps die ik maak. Installeren, openen en bijwerken gaat hier met één tik; Toko kijkt zelf of er nieuwe versies zijn.</p>
    <p class="uitleg">Alle apps komen rechtstreeks van GitHub, waar ook de broncode staat. Play Protect kan waarschuwen omdat ze niet uit de Play Store komen.</p>
    <div class="group links"><a class="btn small" href="https://timvanbergen.nl/" target="_blank" rel="noopener">${icon('globe')}timvanbergen.nl</a>
    <a class="btn small" href="https://github.com/timmmmmmmmn/toko" target="_blank" rel="noopener">${icon('code')}Broncode</a></div>`);
}

// Terug-knop van Android: eerst menu of paneel sluiten
window.tokoBack = () => {
  if ($('.menu')) { closeMenu(); return true; }
  if (!$('#sheetBack').hidden) { closeSheet(); return true; }
  if (state.zoek) { $('#search').value = ''; state.zoek = ''; render(); return true; }
  if (state.tab !== 'ontdek') { setTab('ontdek'); return true; }
  return false;
};
addEventListener('popstate', () => closeSheet(true));

// ---------- Glazen navigatie in de Android-app ----------

let barFrame = 0;
let glisseBar = null;
let glisseMod = null;
function syncGlassBar() {
  // Zolang Glisse nog laadt geen native balk, anders flitst die even.
  const wacht = document.documentElement.classList.contains('glisse') && !glisseBar;
  if (!(glassUi || glisseBar) || wacht || barFrame) return;
  barFrame = requestAnimationFrame(() => {
    barFrame = 0;
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    };
    const names = { ontdek: 'compass', apps: 'grid', updates: 'download', meer: 'more' };
    const titels = { ontdek: 'Ontdek', apps: 'Mijn apps', updates: 'Updates', meer: 'Meer' };
    const tabs = Object.keys(names).map((id) => ({ id, title: titels[id], icon: ICONS[names[id]] }));
    const bar = { pill: box($('#navPill')), add: box($('#navAdd')), tabs, active: state.tab, dark: document.documentElement.dataset.theme === 'donker', visible: $('#sheetBack').hidden };
    if (glisseBar) {
      return glisseBar.update({ ...bar, tabs: tabs.map((t) => ({ ...t, svg: icon(names[t.id]) })), addSvg: icon('search'), addLabel: 'Zoeken' });
    }
    try {
      native.glassBar(JSON.stringify(bar));
    } catch (e) {}
  });
}

window.tokoGlassNav = (id) => (id === 'add' ? zoeken() : navTo(id, $(`#navPill [data-nav="${id}"]`)));

glisse.then((g) => {
  if (g) {
    glisseBar = g.balk({
      onNav: window.tokoGlassNav,
      z: 20,
      onStop: () => {
        glisseBar = glisseMod = null;
        document.documentElement.classList.remove('glisse');
        syncGlassBar();
      },
    });
    glisseMod = g;
  }
  syncGlassBar();
});

function navTo(id, from) {
  haptic();
  if (id === 'meer') return meerMenu(from || $('#navPill [data-nav="meer"]'));
  setTab(id);
}

function zoeken() {
  haptic();
  if (state.tab !== 'ontdek') setTab('ontdek');
  $('#list').scrollTop = 0;
  $('#search').focus();
}

// ---------- Gebeurtenissen ----------

fillIcons();
$('#navPill').addEventListener('click', (e) => {
  const b = e.target.closest('[data-nav]');
  if (b) navTo(b.dataset.nav, b);
});
$('#navAdd').addEventListener('click', zoeken);
$('#refresh').addEventListener('click', () => { haptic(); laad(); });
$('#chips').addEventListener('click', (e) => {
  const b = e.target.closest('[data-soort]');
  if (!b) return;
  haptic();
  state.soort = state.soort === b.dataset.soort ? '' : b.dataset.soort;
  render();
});
$('#search').addEventListener('input', (e) => { state.zoek = e.target.value; render(); });

function klik(e) {
  const a = e.target.closest('[data-actie]');
  if (a) {
    e.stopPropagation();
    const id = a.dataset.id;
    if (a.dataset.actie === 'installeer') installeer(id);
    else if (a.dataset.actie === 'open') openApp(id);
    else if (a.dataset.actie === 'verwijder') verwijder(id);
    else if (a.dataset.actie === 'alles') allesBijwerken();
    return;
  }
  if (e.target.closest('[data-stop]')) return;
  const r = e.target.closest('[data-id]');
  if (r && r.closest('#list')) detail(r.dataset.id);
}
$('#list').addEventListener('click', klik);
$('#sheetBody').addEventListener('click', klik);
$('#list').addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('.app-row, .hero')) detail(e.target.dataset.id); });
$('#sheetClose').addEventListener('click', () => closeSheet());
$('#sheetBack').addEventListener('click', (e) => { if (e.target.id === 'sheetBack') closeSheet(); });
addEventListener('resize', syncGlassBar);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  try { if ((localStorage.getItem('theme') || 'systeem') === 'systeem') theme('systeem'); } catch (e) {}
});
// terug in de app (bijv. na een installatievenster van Android): opnieuw kijken
document.addEventListener('visibilitychange', () => { if (!document.hidden) { kijk(); render(); } });

// meteen iets tonen uit de vorige keer, daarna verversen
try {
  const oud = JSON.parse(localStorage.getItem('toko-catalogus') || 'null');
  if (oud) { state.apps = oud.apps; state.web = oud.web; state.geladen = true; kijk(); }
} catch (e) {}
render();
laad({ stil: state.geladen });
try { native?.ready(); } catch (e) {}
