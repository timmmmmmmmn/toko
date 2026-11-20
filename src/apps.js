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
