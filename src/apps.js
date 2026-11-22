// De catalogus van Toko: alle apps die we voor Windows 10 Mobile (Lumia) maken. Het versienummer komt live
// uit wp/appx/AppxManifest.xml van elke repo; het pakket zelf uit de GitHub-release 'wp-latest'.
// Een nieuwe app: hier toevoegen, icoon (150×150) in public/lumia/img/<id>.png, en de repo een wp/appx + wp.yml geven.
// Games zonder eigen Lumia-pakket (een privérepo, of geen repo) bouwt Toko zelf: `manifest` wijst naar wp/spellen/<id>
// in deze repo en het pakket staat in Toko's eigen release; de game zelf levert alleen /wp (wp/build.mjs in de game).
export const APPS = [
  {
    id: 'jensrun', naam: 'Jens Run', repo: 'jensrun', bestand: 'JensRun.appx', pakket: 'TimvanBergen.JensRun', protocol: 'tvb-jensrun',
    kleur: '#000000', soort: 'Spellen', site: 'https://jensrun.timvanbergen.nl/',
    kort: 'Ren door Nijmegen en laat je niet pakken.',
    tekst: 'Een endless runner in PS1-stijl door Nijmegen-Oost. Pak de bekers, ontwijk de fietser, de handhaver en de docent, speel het verhaal door alle wijken of ren tegen je vrienden in multiplayer. Op de Lumia draait de PS1-stand; Ultra-graphics zitten er niet in.',
  },
  {
    id: 'skitta', naam: 'Skitta', repo: 'skitta', bestand: 'Skitta.appx', pakket: 'TimvanBergen.Skitta', protocol: 'tvb-skitta',
    kleur: '#00aff0', soort: 'Sociaal', site: 'https://skitta.timvanbergen.nl/',
    kort: 'Chatten en bellen, zoals vroeger.',
    tekst: 'Berichten, foto’s en spraakberichten met je contactpersonen, end-to-end versleuteld. De eerste keer inloggen duurt op de Lumia een minuutje (het rekenwerk voor de versleuteling); daarna onthoudt hij je. Bellen werkt op de Lumia misschien niet.',
  },
  {
    id: 'skittalite', naam: 'Skitta Lite', repo: 'toko', manifest: 'wp/spellen/skittalite/AppxManifest.xml', bestand: 'SkittaLite.appx', pakket: 'TimvanBergen.Belliechat', protocol: 'tvb-skittalite',
    kleur: '#000EB6', soort: 'Sociaal', site: 'https://skittalite.timvanbergen.nl/',
    kort: 'Chatten, foto’s en video’s sturen.',
    tekst: 'De lichte versie van Skitta, gemaakt voor de Lumia. Stuur berichten, foto’s en video’s naar andere Skitta Lite-gebruikers én naar mensen op Skitta. Inloggen gaat meteen; chats met Skitta Lite zijn niet end-to-end versleuteld en bellen kan niet.',
  },
  {
    id: 'agenda', naam: 'Agenda', repo: 'agenda', bestand: 'Agenda.appx', pakket: 'TimvanBergen.Agenda', protocol: 'tvb-agenda',
    kleur: '#242564', soort: 'Productiviteit', site: 'https://agenda.timvanbergen.nl/',
    kort: 'Je eigen agenda, overal gelijk.',
    tekst: 'Dag-, week- en maandoverzicht en de planning van je eigen agenda. Wat je hier toevoegt staat meteen ook op je telefoon, laptop en in Apple Agenda.',
  },
  {
    id: 'notities', naam: 'Notities', repo: 'notities', bestand: 'Notities.appx', pakket: 'TimvanBergen.Notities', protocol: 'tvb-notities',
    kleur: '#A51D21', soort: 'Productiviteit', site: 'https://notities.timvanbergen.nl/',
    kort: 'Notities en lijstjes op al je apparaten.',
    tekst: 'Schrijf notities, maak boodschappenlijstjes en zet herinneringen. Alles wordt bewaard en staat ook op je andere apparaten.',
  },
  {
    id: 'shane', naam: 'Shane Dead Redemption', repo: 'toko', manifest: 'wp/spellen/shane/AppxManifest.xml', bestand: 'ShaneDeadRedemption.appx', pakket: 'TimvanBergen.ShaneDeadRedemption', protocol: 'tvb-shane',
    kleur: '#5a3418', soort: 'Spellen', site: 'https://shanedeadredemption.timvanbergen.nl/',
    kort: 'Western: vlucht naar de grens bij Kleef.',
    tekst: 'Shane steelt twee frikandelbroodjes bij de Plus in Hatert en vlucht naar de grens bij Kleef: twintig hoofdstukken met duels, Dead Eye en bazen. Links een stick om te lopen, rechts vegen om te kijken. Op de Lumia zonder schaduwen en op lagere resolutie; het is een zwaar spel voor deze telefoon.',
  },
  {
    id: 'agora', naam: 'Agora Bosgevecht', repo: 'toko', manifest: 'wp/spellen/agora/AppxManifest.xml', bestand: 'AgoraBosgevecht.appx', pakket: 'TimvanBergen.AgoraBosgevecht', protocol: 'tvb-agora',
    kleur: '#2f5d2a', soort: 'Spellen', site: 'https://agorabosgevecht.timvanbergen.nl/',
    kort: 'Vechtspel met de vrienden van school.',
    tekst: 'Een vechtspel met negen personages, ieder met eigen wapens en een special, in Nijmegen of op het schoolplein. Speel tegen de computer of online tegen iemand anders. Met een stick en drie knoppen op het scherm.',
  },
  {
    id: 'galgje', naam: 'Galgje', repo: 'toko', manifest: 'wp/spellen/galgje/AppxManifest.xml', bestand: 'Galgje.appx', pakket: 'TimvanBergen.Galgje', protocol: 'tvb-galgje',
    kleur: '#3d3d3d', soort: 'Spellen', site: 'https://galgje.timvanbergen.nl/',
    kort: 'Het klassieke woordspel.',
    tekst: 'Galgje met tien pogingen: raad het woord letter voor letter voordat het poppetje hangt.',
  },
  {
    id: 'scorroday', naam: 'Scorroday', repo: 'toko', manifest: 'wp/spellen/scorroday/AppxManifest.xml', bestand: 'Scorroday.appx', pakket: 'TimvanBergen.Scorroday', protocol: 'tvb-scorroday',
    kleur: '#25C5FF', soort: 'Onderwijs', site: 'https://scorroday.timvanbergen.nl/',
    kort: 'Je SOMtoday-rooster, licht en snel.',
    tekst: 'Je rooster uit SOMtoday, per dag en per week, met uitgevallen lessen en lokaalwijzigingen. Je logt in via SOMtoday zelf: kies je school en log in met je schoolaccount, Microsoft of Entree. Het rooster blijft bewaard, dus je ziet het ook zonder internet.',
  },
  {
    id: 'navikarta', naam: 'Navi Karta', repo: 'toko', manifest: 'wp/spellen/navikarta/AppxManifest.xml', bestand: 'NaviKarta.appx', pakket: 'TimvanBergen.NaviKarta', protocol: 'tvb-navikarta',
    kleur: '#10316b', soort: 'Reizen', site: 'https://navikarta.timvanbergen.nl/',
    kort: 'Kaarten en routes, licht genoeg voor je Lumia.',
    tekst: 'Een kaart van de hele wereld met zoeken, je eigen locatie en routes met de auto, de fiets of lopend, met aanwijzingen onderweg. Lang drukken op de kaart laat zien wat er ligt. Kies Licht als kaartsoort voor de snelste kaart. Kaarten van OpenStreetMap.',
  },
  {
    id: 'boodschappen', naam: 'Ron Jans’ Boodschappenlijst', repo: 'toko', manifest: 'wp/spellen/boodschappen/AppxManifest.xml', bestand: 'Boodschappenlijst.appx', pakket: 'TimvanBergen.Boodschappenlijst', protocol: 'tvb-boodschappen',
    kleur: '#1a1a1a', soort: 'Productiviteit', site: 'https://boodschappen.timvanbergen.nl/',
    kort: 'Je boodschappen met prijzen en het totaal.',
    tekst: 'Een echt boodschappenlijstje: schrijf op wat je nodig hebt met de prijs erbij en zie meteen het totaal. Streep af wat in je mandje ligt. De lijst blijft op je telefoon staan, ook zonder internet.',
  },
  {
    id: 'muzu', naam: 'Muzu', repo: 'toko', manifest: 'wp/spellen/muzu/AppxManifest.xml', bestand: 'Muzu.appx', pakket: 'TimvanBergen.Muzu', protocol: 'tvb-muzu',
    kleur: '#3a3f47', soort: 'Muziek', site: 'https://muzu.timvanbergen.nl/',
    kort: 'Je muziek op je telefoon.',
    tekst: 'Een mp3-speler die ook de muziek speelt die al op je telefoon staat. Nieuwe liedjes zet je op je computer klaar op muzu.timvanbergen.nl met de code uit de app: Muzu haalt ze op en zet ze in Muziek › Muzu. De site is alleen een brug; daar blijft niets staan. Speelt door als je scherm uit is.',
  },
  {
    id: 'jensrunlite', naam: 'Jens Run Lite', repo: 'toko', manifest: 'wp/spellen/jensrunlite/AppxManifest.xml', bestand: 'JensRunLite.appx', pakket: 'TimvanBergen.JensRunLite', protocol: 'tvb-jensrunlite',
    kleur: '#000000', soort: 'Spellen', site: 'https://jensrunlite.timvanbergen.nl/',
    kort: 'Jens Run in 2D, kei snel op je Lumia.',
    tekst: 'De Rennen-modus van Jens Run, maar dan in 2D zodat hij op de Lumia supersnel loopt. Er is telefoonverbod en Shane wil Jens z’n telefoon afpakken: spring over hekken en auto’s, buk onder duiven en spandoeken en pak de bekers. Tik om te springen (twee keer voor hoger), veeg omlaag om te bukken.',
  },
  {
    id: 'puchmaxi', naam: 'Puch Maxi Loesoe', repo: 'toko', manifest: 'wp/spellen/puchmaxi/AppxManifest.xml', bestand: 'PuchMaxiLoesoe.appx', pakket: 'TimvanBergen.PuchMaxiLoesoe', protocol: 'tvb-puchmaxi',
    kleur: '#ff0000', soort: 'Spellen', site: 'https://puchmaxi.timvanbergen.nl/',
    kort: 'Jens op z’n Puch Maxi door Nijmegen.',
    tekst: 'Jens scheurt op z’n Puch Maxi door Nijmegen. Veeg naar links of rechts om van baan te wisselen en sla op tijd af bij elk kruispunt, anders sta je in iemands voortuin. Veeg omhoog om over drempels, paaltjes en hekken te springen en pak de bekers. Raak je iets, dan zit de BOA achter je aan.',
  },
  {
    id: 'angrymo', naam: 'Angry Mo', repo: 'toko', manifest: 'wp/spellen/angrymo/AppxManifest.xml', bestand: 'AngryMo.appx', pakket: 'TimvanBergen.AngryMo', protocol: 'tvb-angrymo',
    kleur: '#1a1446', soort: 'Spellen', site: 'https://angrymo.timvanbergen.nl/',
    kort: 'Schiet vuurwerk op boze kliko’s.',
    tekst: 'Oudejaarsavond: Mo schiet vuurwerk op torens van hout, steen en glas vol boze kliko’s. Trek terug, mik en laat los. Een cobra ontploft als je tikt, een duizendklapper splitst in drieën. Acht levels, haal overal drie sterren.',
  },
  {
    id: 'woesoe', naam: 'Woesoe', repo: 'toko', manifest: 'wp/spellen/woesoe/AppxManifest.xml', bestand: 'Woesoe.appx', pakket: 'TimvanBergen.Wierie', protocol: 'tvb-woesoe',
    kleur: '#9fb4c8', soort: 'Weer', site: 'https://woesoe.timvanbergen.nl/',
    kort: 'Het weer, maar dan in straattaal.',
    tekst: 'Ewa mattie! Het weer van nu, per uur en de hele week, waar je ook bent, en Woesoe vertelt het je in straattaal: kapot koud, lit buiten of natte pattas. Met tips of je een jas of paraplu mee moet. Weer van Open-Meteo.',
  },
  {
    id: 'toko', naam: 'Toko', repo: 'toko', bestand: 'Toko.appx', pakket: 'TimvanBergen.Toko', protocol: 'tvb-toko',
    kleur: '#E8590C', soort: 'Hulpmiddelen', site: 'https://toko.timvanbergen.nl/',
    kort: 'De winkel voor al onze Lumia-apps.',
    tekst: 'Deze winkel zelf. Toko installeert en werkt de andere apps bij; als er een nieuwe Toko is, zie je dat hier.',
  },
];

// Android: de apps uit de GitHub-releases. `tag` kiest de juiste release (een repo kan ook Lumia- of
// desktopreleases hebben), `apk` het bestand erin. Het versienummer in de tag is de versionName van de app.
export const ANDROID = [
  {
    id: 'agenda', naam: 'Agenda', repo: 'agenda-android', tag: /^v(\d+\.\d+\.\d+)$/, apk: 'Agenda.apk', pakket: 'nl.timvanbergen.agenda',
    kleur: '#242564', soort: 'Productiviteit', site: 'https://agenda.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/agenda',
    kort: 'Je eigen agenda, overal gelijk.',
    tekst: 'Een eigen agenda die overal synchroniseert: in de browser, als Android-app en via CalDAV in Apple Agenda of op je telefoon. Met meerdere agenda’s, kleuren en delen met anderen.',
    beeld: 'agenda.jpg',
  },
  {
    id: 'notities', naam: 'Notities', repo: 'notities', tag: /^v(\d+\.\d+\.\d+)$/, apk: 'Notities.apk', pakket: 'nl.timvanbergen.notities',
    kleur: '#A51D21', soort: 'Productiviteit', site: 'https://notities.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/notities',
    kort: 'Notities en lijstjes op al je apparaten.',
    tekst: 'Notities en lijstjes die op je telefoon en laptop gelijk blijven. Met labels, kleuren, herinneringen, versies en notities delen met anderen.',
    beeld: 'notities.jpg',
  },
  {
    id: 'cijfernu', naam: 'CijferNu', repo: 'cijfernu', tag: /^v(\d+\.\d+\.\d+)$/, apk: 'CijferNu.apk', pakket: 'nl.timvanbergen.cijfernu',
    kleur: '#1200A2', soort: 'Onderwijs', site: 'https://cijfernu.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/cijfernu',
    kort: 'SOMtoday, maar dan fijn.',
    tekst: 'Je cijfers, rooster en berichten van SOMtoday in één snelle app, met meldingen zodra er een cijfer binnen is of een les uitvalt. Plus een eigen planner voor huiswerk en toetsen, met een herinnering de avond ervoor. Je logt in bij SOMtoday zelf.',
    beeld: 'cijfernu.jpg',
  },
  {
    id: 'skitta', naam: 'Skitta', repo: 'skitta', tag: /^android-v(\d+\.\d+\.\d+)$/, apk: 'Skitta-{v}.apk', pakket: 'nl.timvanbergen.skitta',
    kleur: '#00aff0', soort: 'Sociaal', site: 'https://skitta.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/skitta',
    kort: 'Chatten en bellen met je vrienden.',
    tekst: 'Chatten, bellen en videobellen met je vrienden, in de look van de klassieke messenger op Windows 7. End-to-end versleuteld, met groepen, foto’s, spraakberichten en zes thema’s.',
    beeld: 'skitta.jpg',
  },
  {
    id: 'spokoe', naam: 'Spokoe', repo: 'spokoe', tag: /^android-v(\d+\.\d+\.\d+)$/, apk: 'Spokoe.apk', pakket: 'nl.timvanbergen.spokoe',
    kleur: '#0b1482', soort: 'Muziek en tv', site: 'https://spokoe.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/spokoe',
    kort: 'Een eigen, snelle speler voor Spotify.',
    tekst: 'Een eigen, snelle speler voor Spotify Premium. Speelt zelf af, met slimme mixen, een equalizer, echte crossfade, een wachtrij die je kunt slepen, songteksten die meelopen en vinyl-thema’s. Spotify Premium nodig.',
    beeld: 'spokoe.jpg',
  },
  {
    id: 'iptimtv', naam: 'IPTIMTV', repo: 'IPTIMTV', tag: /^v(\d+\.\d+\.\d+)$/, apk: 'IPTIMTV-mobile.apk', pakket: 'nl.timvanbergen.iptimtv.mobile',
    kleur: '#111827', soort: 'Muziek en tv', site: 'https://iptv.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/IPTIMTV',
    kort: 'Live tv, films en series op één plek.',
    tekst: 'Een eenvoudige IPTV-app. Live tv, films en series op één plek, met favorieten die op al je apparaten hetzelfde zijn. Dit is de telefoonversie; voor Android TV staat IPTIMTV.apk op GitHub.',
    beeld: 'iptimtv.jpg',
  },
  {
    id: 'jensrun', naam: 'Jens Run', repo: 'jensrun', tag: /^v(\d+\.\d+\.\d+)$/, apk: 'JensRun.apk', pakket: 'nl.timvanbergen.jensrun',
    kleur: '#000000', soort: 'Spellen', site: 'https://jensrun.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/jensrun',
    kort: 'Ren door Nijmegen en laat je niet pakken.',
    tekst: 'Een 3D-endless runner door Nijmegen in PS1-stijl. Met verhaalmodus, ranglijsten en online tegen elkaar spelen.',
    beeld: 'jensrun.jpg',
  },
  {
    id: 'eiland', naam: 'Dynamisch eiland', repo: 'dynamisch-eiland', tag: /^v(\d+\.\d+\.\d+)$/, apk: 'DynamischEiland.apk', pakket: 'nl.timvanbergen.eiland',
    kleur: '#000000', soort: 'Hulpmiddelen', site: null, bron: 'https://github.com/timmmmmmmmn/dynamisch-eiland',
    kort: 'Een Dynamic Island om je cameragaatje.',
    tekst: 'Als er niets loopt zie je alleen het cameragaatje; begint er iets, dan groeit er een pil uit de camera. Alleen wat doorloopt komt erin: gesprekken, muziek, timers, navigatie en opladen. Android 13 of nieuwer; in de app zet je Toegankelijkheid en meldingstoegang aan.',
    beeld: 'eiland.jpg',
  },
  {
    id: 'toko', naam: 'Toko', repo: 'toko', tag: /^android-v(\d+\.\d+\.\d+)$/, apk: 'Toko.apk', pakket: 'nl.timvanbergen.toko',
    kleur: '#56CBF5', soort: 'Hulpmiddelen', site: 'https://toko.timvanbergen.nl/', bron: 'https://github.com/timmmmmmmmn/toko',
    kort: 'De winkel voor al onze apps.',
    tekst: 'Deze winkel zelf. Toko installeert je apps, werkt ze bij en laat zien wat er nieuw is. Toko werkt zichzelf ook vanzelf bij.',
    beeld: null,
  },
];

// Spellen en apps die alleen in de browser draaien: Toko opent ze.
export const WEB = [
  { id: 'rotterdam', naam: 'Grote Aanslag Op. Rotterdam', url: 'https://rotterdam.timvanbergen.nl/', kleur: '#1b1b1b', soort: 'Spellen', kort: 'Open wereld door Rotterdam.', tekst: 'Een open-wereldspel door Rotterdam: de Erasmusbrug, de Kuip, de haven en de Markthal, met missies, auto’s, de tram en een radio. Op een computer met toetsenbord.', beeld: 'rotterdam.jpg' },
  { id: 'shane', naam: 'Shane Dead Redemption', url: 'https://shanedeadredemption.timvanbergen.nl/', kleur: '#5a3418', soort: 'Spellen', kort: 'Western: vlucht naar de grens bij Kleef.', tekst: 'Een western in twintig levels: Shane steelt twee frikandelbroodjes bij de Plus in Hatert en vlucht naar de grens bij Kleef, met duels, Dead Eye en bazen. Op een computer, of op je telefoon met knoppen op het scherm.', beeld: null },
  { id: 'agora', naam: 'Agora Bosgevecht', url: 'https://agorabosgevecht.timvanbergen.nl/', kleur: '#2f5d2a', soort: 'Spellen', kort: 'Vechtspel met de vrienden van school.', tekst: 'Een vechtspel met negen personages, ieder met eigen wapens en een special, in Nijmegen of op het schoolplein. Online tegen elkaar, ook op je telefoon.', beeld: null },
  { id: 'galgje', naam: 'Galgje', url: 'https://galgje.timvanbergen.nl/', kleur: '#3d3d3d', soort: 'Spellen', kort: 'Het klassieke woordspel.', tekst: 'Galgje met tien pogingen, met het toetsenbord op het scherm of je eigen toetsenbord.', beeld: null },
];
