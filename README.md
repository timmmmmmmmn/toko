# Toko

Mijn appwinkel: **toko.timvanbergen.nl**. Alle Android-apps (installeren, openen en bijwerken met één tik) en de spellen in de browser, plus een eigen winkel voor Windows 10 Mobile (Lumia).

## Android

- `public/` – de winkel in de Tim app style (`index.html`, `app.css`, `app.js`, zonder bouwstap). In de app zit hij ingebouwd; alleen `/api` gaat over internet.
- `android/` – de app (`nl.timvanbergen.toko`): WebView met glazen navigatie en menu's (Android 13+, Glisse waar het toestel het aankan), `Installer.kt` downloadt en installeert apps via PackageInstaller, `Updater.kt` werkt Toko zelf bij.
- `src/apps.js` (`ANDROID`, `WEB`) – de catalogus. De versie komt uit de nieuwste GitHub-release die bij `tag` past (via releases.atom), de APK uit die release.
- `.github/workflows/apk.yml` bouwt bij elke wijziging een ondertekende `Toko.apk` (release `android-v1.0.N`). Sleutel: `~/AndroidStudioProjects/toko-release.jks` + `.properties` (nooit in de repo), als secrets `TOKO_*`.

Een nieuwe Android-app in Toko: zet hem in `ANDROID` in `src/apps.js`, een icoon (192×192) in `public/img/app/<id>.png`, eventueel een schermafbeelding in `public/img/beeld/`, en zijn pakketnaam bij `<queries>` in `android/app/src/main/AndroidManifest.xml`.

## Windows 10 Mobile

- `src/apps.js` – de catalogus. Versies komen live uit `wp/appx/AppxManifest.xml` van elke repo, de pakketten uit de GitHub-release `wp-latest` (via `/download/<id>.appx`).
- `public/lumia/` – de Lumia-winkel, gewoon ES5 zodat hij in EdgeHTML 13 draait. In de Toko-app (WinRT) installeert hij apps zelf met `PackageManager`; in een browser wordt het `.appx` gedownload.
- `wp/appx/` – de Toko-app (hosted web app met WinRT-toegang en de rechten `packageManagement` en `packageQuery`), gebouwd en ondertekend door `.github/workflows/wp.yml`.

Een app bijwerken op de telefoons: verhoog `Version` in de `AppxManifest.xml` van die app; Toko laat dan "update beschikbaar" zien.

Deployen: `npx wrangler deploy`.

## Eerste keer op de telefoon

1. Instellingen → Bijwerken en beveiliging → Voor ontwikkelaars → **Ontwikkelaarsmodus**.
2. Open toko.timvanbergen.nl in de browser en installeer het certificaat (tabblad *hulp*).
3. Download en installeer Toko; de rest gaat vanuit Toko.
