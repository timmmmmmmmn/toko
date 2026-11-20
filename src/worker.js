// Toko: de catalogus en de downloads.
//   /api/android        Android-apps met de nieuwste versie uit GitHub (releases.atom, geen API-limiet)
//   /api/apps           Lumia-apps (Windows 10 Mobile) met de versie uit hun AppxManifest.xml
//   /download/<id>.appx Lumia-pakket uit de release 'wp-latest'
// De Lumia (oude Edge) krijgt op / de Metro-winkel uit public/lumia/, de rest de gewone Toko.
import { APPS, ANDROID, WEB } from './apps.js';

const GH = 'https://github.com/timmmmmmmmn';
const RAW = 'https://raw.githubusercontent.com/timmmmmmmmn';
const OUDE_EDGE = /Edge\/1[2-8]\./;
const json = (data, max = 60) => new Response(JSON.stringify(data), {
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${max}`, 'access-control-allow-origin': '*' },
});
const tekst = (url, ttl) => fetch(url, { cf: { cacheTtl: ttl, cacheEverything: true } }).then((r) => (r.ok ? r.text() : null)).catch(() => null);

// ---------- Android ----------

async function release(app) {
  const atom = await tekst(`${GH}/${app.repo}/releases.atom`, 300);
  if (!atom) return null;
  for (const e of atom.split('<entry>').slice(1)) {
    const tag = (e.match(/\/releases\/tag\/([^"]+)"/) || [])[1];
    const m = tag && decodeURIComponent(tag).match(app.tag);
    if (!m) continue;
    const versie = m[1];
    const bestand = app.apk.replace('{v}', versie);
    return {
      versie,
      datum: (e.match(/<updated>([^<]+)<\/updated>/) || [])[1] || null,
      notities: ((e.match(/<content type="html">([\s\S]*?)<\/content>/) || [])[1] || '')
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
        .replace(/<[^>]+>/g, ' ').replace(/Co-Authored-By:.*$/gim, '').replace(/\s+/g, ' ').trim().slice(0, 400),
      apk: `${GH}/${app.repo}/releases/download/${tag}/${bestand}`,
      grootte: await grootte(`${GH}/${app.repo}/releases/download/${tag}/${bestand}`),
    };
  }
  return null;
}

async function grootte(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', cf: { cacheTtl: 3600 } });
    return Number(r.headers.get('content-length')) || null;
  } catch (e) {
    return null;
  }
}

async function android() {
  const releases = await Promise.all(ANDROID.map(release));
  const apps = ANDROID.map(({ repo, tag, apk, ...app }, i) => ({ ...app, ...(releases[i] || { versie: null }) }));
  return { apps, web: WEB };
}

// ---------- Lumia ----------

async function versie(app) {
  const t = await tekst(`${RAW}/${app.repo}/main/wp/appx/AppxManifest.xml`, 120);
  const m = t && t.match(/<Identity[^>]*\sVersion="([\d.]+)"/);
  return m ? m[1] : null;
}

async function catalogus() {
  const versies = await Promise.all(APPS.map(versie));
  return APPS.map(({ repo, bestand, ...app }, i) => ({ ...app, versie: versies[i], download: `/download/${app.id}.appx` }));
}

async function download(app, request) {
  const r = await fetch(`${GH}/${app.repo}/releases/download/wp-latest/${app.bestand}`, { cf: { cacheTtl: 120, cacheEverything: true } });
  if (!r.ok) return new Response('Deze app is nog niet gebouwd', { status: 404 });
  return new Response(request.method === 'HEAD' ? null : r.body, {
    headers: {
      'content-type': 'application/appx',
      'content-disposition': `attachment; filename="${app.bestand}"`,
      'cache-control': 'no-cache',
      ...(r.headers.get('content-length') ? { 'content-length': r.headers.get('content-length') } : {}),
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Niet toegestaan', { status: 405 });
    if (p === '/api/android') return json(await android(), 120);
    if (p === '/api/apps') return json(await catalogus());
    const d = p.match(/^\/download\/([a-z0-9-]+)\.appx$/);
    if (d) {
      const app = APPS.find((a) => a.id === d[1]);
      return app ? download(app, request) : new Response('Onbekende app', { status: 404 });
    }
    if ((p === '/' || p === '/index.html') && OUDE_EDGE.test(request.headers.get('user-agent') || '')) {
      return env.ASSETS.fetch(new Request(new URL('/lumia/', url), request));
    }
    return env.ASSETS.fetch(request);
  },
};
