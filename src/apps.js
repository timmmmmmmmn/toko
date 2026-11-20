// De catalogus van Toko: alle apps die we voor Windows 10 Mobile (Lumia) maken. Het versienummer komt live
// uit wp/appx/AppxManifest.xml van elke repo; het pakket zelf uit de GitHub-release 'wp-latest'.
// Een nieuwe app: hier toevoegen, icoon (150×150) in public/img/<id>.png, en de repo een wp/appx + wp.yml geven.
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
  { id: 'shane', naam: 'Shane Dead Redemption', url: 'https://shanedeadredemption.timvanbergen.nl/', kleur: '#5a3418', soort: 'Spellen', kort: 'Western: vlucht naar de grens bij Kleef.', tekst: 'Een western in twintig levels: Shane steelt twee frikandelbroodjes bij de Plus in Hatert en vlucht naar de grens bij Kleef, met duels, Dead Eye en bazen. Op een computer.', beeld: null },
  { id: 'agora', naam: 'Agora Bosgevecht', url: 'https://agorabosgevecht.timvanbergen.nl/', kleur: '#2f5d2a', soort: 'Spellen', kort: 'Vechtspel met de vrienden van school.', tekst: 'Een vechtspel met negen personages, ieder met eigen wapens en een special, in Nijmegen of op het schoolplein. Online tegen elkaar.', beeld: null },
  { id: 'galgje', naam: 'Galgje', url: 'https://galgje.timvanbergen.nl/', kleur: '#3d3d3d', soort: 'Spellen', kort: 'Het klassieke woordspel.', tekst: 'Galgje met tien pogingen, met het toetsenbord op het scherm of je eigen toetsenbord.', beeld: null },
];
