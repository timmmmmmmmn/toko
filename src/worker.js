// Toko: de catalogus (/api/apps, met live versienummers) en de downloads (/download/<id>.appx, uit GitHub).
import { APPS } from './apps.js';

const GH = 'https://github.com/timmmmmmmmn';
const RAW = 'https://raw.githubusercontent.com/timmmmmmmmn';
const json = (data, max = 60) => new Response(JSON.stringify(data), {
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${max}` },
});

async function versie(app) {
  try {
    const r = await fetch(`${RAW}/${app.repo}/main/wp/appx/AppxManifest.xml`, { cf: { cacheTtl: 120, cacheEverything: true } });
    if (!r.ok) return null;
    const m = (await r.text()).match(/<Identity[^>]*\sVersion="([\d.]+)"/);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
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
    if (p === '/api/apps') return json(await catalogus());
    const d = p.match(/^\/download\/([a-z0-9-]+)\.appx$/);
    if (d) {
      const app = APPS.find((a) => a.id === d[1]);
      return app ? download(app, request) : new Response('Onbekende app', { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};
