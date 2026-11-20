# Toko

De winkel voor alle apps die we maken voor Windows 10 Mobile (Lumia): **toko.timvanbergen.nl**.

- `src/apps.js` – de catalogus. Versies komen live uit `wp/appx/AppxManifest.xml` van elke repo, de pakketten uit de GitHub-release `wp-latest` (via `/download/<id>.appx`).
- `public/` – de winkel zelf, gewoon ES5 zodat hij in EdgeHTML 13 draait. In de Toko-app (WinRT) installeert hij apps zelf met `PackageManager`; in een browser wordt het `.appx` gedownload.
- `wp/appx/` – de Toko-app (hosted web app met WinRT-toegang en de rechten `packageManagement` en `packageQuery`), gebouwd en ondertekend door `.github/workflows/wp.yml`.

Een app bijwerken op de telefoons: verhoog `Version` in de `AppxManifest.xml` van die app; Toko laat dan "update beschikbaar" zien.

Deployen: `npx wrangler deploy`.

## Eerste keer op de telefoon

1. Instellingen → Bijwerken en beveiliging → Voor ontwikkelaars → **Ontwikkelaarsmodus**.
2. Open toko.timvanbergen.nl in de browser en installeer het certificaat (tabblad *hulp*).
3. Download en installeer Toko; de rest gaat vanuit Toko.
