// Toko: lijst van de Lumia-apps, installeren en bijwerken. Gewoon ES5 (EdgeHTML 13 op de Lumia 435).
// In de Toko-app is WinRT beschikbaar (window.Windows): dan downloadt Toko het pakket zelf en installeert het met
// PackageManager. In een gewone browser (of als dat niet mag) wordt het .appx-bestand gewoon gedownload.
(function () {
  'use strict';

  var W = window.Windows;
  var apps = [];
  var hier = {}; // pakketnaam -> geïnstalleerde versie ('1.0.0.0'), of null als we dat niet kunnen zien
  var kanKijken = false;
  var bezig = {};
  var huidig = null;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, tekst) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (tekst != null) e.textContent = tekst;
    return e;
  }
  function vergelijk(a, b) {
    var x = String(a || '0').split('.'), y = String(b || '0').split('.');
    for (var i = 0; i < 4; i++) {
      var d = (parseInt(x[i], 10) || 0) - (parseInt(y[i], 10) || 0);
      if (d) return d;
    }
    return 0;
  }

  // ---------- wat staat er al op de telefoon ----------
  function kijkWatErIs() {
    hier = {};
    kanKijken = false;
    if (!W) return;
    try {
      var eigen = W.ApplicationModel.Package.current.id;
      hier[eigen.name] = versieTekst(eigen.version);
    } catch (e) { /* niet als app geopend */ }
    try {
      var pm = new W.Management.Deployment.PackageManager();
      var it = pm.findPackagesForUser('').first();
      while (it.hasCurrent) {
        var id = it.current.id;
        if (id.name.indexOf('TimvanBergen.') === 0) hier[id.name] = versieTekst(id.version);
        it.moveNext();
      }
      kanKijken = true;
    } catch (e) { /* geen packageQuery-recht */ }
  }
  function versieTekst(v) { return v.major + '.' + v.minor + '.' + v.build + '.' + v.revision; }

  function stand(app) {
    var v = hier[app.pakket];
    if (v) return app.versie && vergelijk(app.versie, v) > 0 ? 'update' : 'ok';
    return kanKijken ? 'niet' : 'onbekend';
  }

  // ---------- lijsten ----------
  function rij(app) {
    var li = el('li');
    var img = el('img', 'tegel');
    img.src = '/lumia/img/' + app.id + '.png';
    img.alt = '';
    img.style.background = app.kleur;
    var t = el('div', 'tekst');
    t.appendChild(el('div', 'naam', app.naam));
    t.appendChild(el('div', 'sub', app.kort));
    var s = stand(app);
    if (bezig[app.id]) t.appendChild(el('div', 'label', 'bezig…'));
    else if (s === 'update') t.appendChild(el('div', 'label', 'update beschikbaar'));
    else if (s === 'ok') t.appendChild(el('div', 'label ok', 'geïnstalleerd'));
    else t.appendChild(el('div', 'label ok', app.soort));
    li.appendChild(img);
    li.appendChild(t);
    li.onclick = function () { location.hash = '#app/' + app.id; };
    return li;
  }

  function teken() {
    var lijst = $('lijst'), mijn = $('mijn'), i, n = 0, updates = 0;
    lijst.innerHTML = '';
    mijn.innerHTML = '';
    if (!apps.length) lijst.appendChild(el('li', 'leeg', 'Kon de apps niet laden. Heb je internet?'));
    for (i = 0; i < apps.length; i++) {
      lijst.appendChild(rij(apps[i]));
      var s = stand(apps[i]);
      if (s === 'ok' || s === 'update') { mijn.appendChild(rij(apps[i])); n++; }
      if (s === 'update') updates++;
    }
    if (!n) mijn.appendChild(el('li', 'leeg', kanKijken || W ? 'Nog geen apps uit Toko op deze telefoon.' : 'Open Toko als app op je Lumia om te zien wat er geïnstalleerd is.'));
    $('allesBij').hidden = !updates;
    $('allesBij').textContent = updates > 1 ? 'alles bijwerken (' + updates + ')' : 'bijwerken';
    if (huidig) toonDetail(huidig);
  }

  // ---------- tabbladen en detail ----------
  function kiesTab(naam) {
    var knoppen = $('pivot').getElementsByTagName('button');
    for (var i = 0; i < knoppen.length; i++) {
      var aan = knoppen[i].getAttribute('data-tab') === naam;
      knoppen[i].className = aan ? 'aan' : '';
      if (aan) $('pivot').scrollLeft = knoppen[i].offsetLeft - 2;
      $('tab-' + knoppen[i].getAttribute('data-tab')).hidden = !aan;
    }
  }

  function route() {
    var m = location.hash.match(/^#app\/([a-z0-9-]+)/);
    var app = null;
    for (var i = 0; m && i < apps.length; i++) if (apps[i].id === m[1]) app = apps[i];
    huidig = app;
    $('detail').hidden = !app;
    document.querySelector('.kop').style.display = app ? 'none' : '';
    var tabs = document.querySelectorAll('.tab');
    for (var j = 0; j < tabs.length; j++) tabs[j].style.display = app ? 'none' : '';
    if (app) { toonDetail(app); window.scrollTo(0, 0); }
    else { var t = location.hash.match(/^#(apps|mijn|hulp)$/); kiesTab(t ? t[1] : 'apps'); }
  }

  function toonDetail(app) {
    var s = stand(app);
    $('dIcoon').src = '/lumia/img/' + app.id + '.png';
    $('dIcoon').style.background = app.kleur;
    $('dNaam').textContent = app.naam;
    $('dSoort').textContent = app.soort;
    $('dTekst').textContent = app.tekst;
    $('dVersie').textContent = app.versie || 'nog niet gebouwd';
    $('dHier').textContent = hier[app.pakket] ? hier[app.pakket] : (kanKijken ? 'nee' : 'onbekend');
    $('dSite').textContent = app.site.replace(/^https:\/\/|\/$/g, '');
    $('dSite').href = app.site;
    $('dBrowser').href = app.download;
    var hoofd = $('dHoofd');
    hoofd.textContent = s === 'update' ? 'bijwerken' : s === 'ok' ? 'opnieuw installeren' : 'installeren';
    hoofd.className = s === 'ok' ? 'knop' : 'knop vol';
    hoofd.disabled = !!bezig[app.id] || !app.versie;
    $('dOpen').hidden = !(W && (s === 'ok' || s === 'update')) || app.id === 'toko';
    if (!bezig[app.id] && !app.versie) melding('Deze app wordt nog gebouwd. Probeer het straks nog eens.');
  }

  function melding(tekst, fout) {
    var s = $('dStatus');
    s.textContent = tekst || '';
    s.className = 'status' + (fout ? ' fout' : '');
  }
  function voortgang(deel) {
    var v = $('dVoortgang'), b = $('dBalk');
    v.hidden = deel == null;
    v.className = 'voortgang' + (deel === -1 ? ' bezig' : '');
    if (deel >= 0) b.style.width = Math.round(deel * 100) + '%';
  }
  function zelfde(app) { return huidig && huidig.id === app.id; }

  // ---------- installeren ----------
  function viaBrowser(app) {
    if (W) {
      try { W.System.Launcher.launchUriAsync(new W.Foundation.Uri(location.origin + app.download)); return; } catch (e) { /* gewone link */ }
    }
    location.href = app.download;
  }

  function haal(app, opVoortgang) {
    return new Promise(function (ok, nee) {
      var x = new XMLHttpRequest();
      x.open('GET', app.download + '?v=' + encodeURIComponent(app.versie || ''));
      x.responseType = 'arraybuffer';
      x.onprogress = function (e) { if (e.lengthComputable) opVoortgang(e.loaded / e.total); };
      x.onload = function () { x.status === 200 ? ok(x.response) : nee(new Error('Downloaden mislukt (' + x.status + ')')); };
      x.onerror = function () { nee(new Error('Geen verbinding')); };
      x.send();
    });
  }

  function installeer(app) {
    if (bezig[app.id]) return Promise.resolve();
    if (!W || !W.Management || !W.Management.Deployment) { viaBrowser(app); return Promise.resolve(); }
    bezig[app.id] = true;
    teken();
    if (zelfde(app)) { melding('downloaden…'); voortgang(0); }
    var map = W.Storage.ApplicationData.current.temporaryFolder;
    return haal(app, function (d) { if (zelfde(app)) voortgang(d); })
      .then(function (buf) {
        if (zelfde(app)) { melding('installeren…'); voortgang(-1); }
        return map.createFileAsync(app.id + '.appx', W.Storage.CreationCollisionOption.replaceExisting).then(function (f) {
          var bytes = new Uint8Array(buf), lijst = new Array(bytes.length);
          for (var i = 0; i < bytes.length; i++) lijst[i] = bytes[i];
          return W.Storage.FileIO.writeBytesAsync(f, lijst).then(function () { return f; });
        });
      })
      .then(function (f) {
        var pm = new W.Management.Deployment.PackageManager();
        var uri = new W.Foundation.Uri('file:///' + f.path.replace(/\\/g, '/'));
        // Toko zelf: de app sluit tijdens het bijwerken
        return pm.addPackageAsync(uri, null, W.Management.Deployment.DeploymentOptions.forceApplicationShutdown);
      })
      .then(function (res) {
        if (res && res.errorText) throw new Error(res.errorText);
        bezig[app.id] = false;
        kijkWatErIs();
        if (!hier[app.pakket] && app.versie) hier[app.pakket] = app.versie;
        teken();
        if (zelfde(app)) { voortgang(null); melding(app.naam + ' is geïnstalleerd. Je vindt hem in de lijst met apps.'); }
      }, function (e) {
        bezig[app.id] = false;
        teken();
        if (zelfde(app)) {
          voortgang(null);
          melding('Installeren lukte niet' + (e && e.message ? ': ' + e.message : '') + '. Probeer "via browser installeren" hieronder, of kijk bij hulp.', true);
        }
      });
  }

  function open(app) {
    try { W.System.Launcher.launchUriAsync(new W.Foundation.Uri(app.protocol + ':')); } catch (e) { melding('Openen lukte niet.', true); }
  }

  // ---------- start ----------
  function laad() {
    var x = new XMLHttpRequest();
    x.open('GET', '/api/apps');
    x.onload = function () {
      try { apps = JSON.parse(x.responseText); } catch (e) { apps = []; }
      kijkWatErIs();
      teken();
      route();
    };
    x.onerror = function () { apps = []; teken(); };
    x.send();
  }

  var knoppen = $('pivot').getElementsByTagName('button');
  for (var i = 0; i < knoppen.length; i++) {
    knoppen[i].onclick = function () { location.hash = '#' + this.getAttribute('data-tab'); };
  }
  $('terug').onclick = function () { history.length > 1 ? history.back() : (location.hash = '#apps'); };
  $('dHoofd').onclick = function () { if (huidig) installeer(huidig); };
  $('dOpen').onclick = function () { if (huidig) open(huidig); };
  $('dBrowser').onclick = function (e) { e.preventDefault(); if (huidig) viaBrowser(huidig); };
  $('allesBij').onclick = function () {
    var wachtrij = [];
    for (var i = 0; i < apps.length; i++) if (stand(apps[i]) === 'update' && apps[i].id !== 'toko') wachtrij.push(apps[i]);
    // Toko als laatste: die sluit tijdens het bijwerken
    for (i = 0; i < apps.length; i++) if (stand(apps[i]) === 'update' && apps[i].id === 'toko') wachtrij.push(apps[i]);
    wachtrij.reduce(function (p, app) { return p.then(function () { return installeer(app); }); }, Promise.resolve());
  };
  window.addEventListener('hashchange', route);
  // terug naar Toko na een installatie elders: opnieuw kijken
  document.addEventListener('visibilitychange', function () { if (!document.hidden && apps.length) { kijkWatErIs(); teken(); } });
  // hardwareknop terug op de telefoon
  try {
    W.UI.Core.SystemNavigationManager.getForCurrentView().addEventListener('backrequested', function (e) {
      if (huidig) { e.handled = true; location.hash = '#apps'; }
    });
  } catch (e) { /* geen WinRT */ }
  laad();
})();
