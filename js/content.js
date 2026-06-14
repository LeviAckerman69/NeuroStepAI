// Domagoj: scenario story, AI explanation copy, graph interpretation and result copy.
// This file centralises the text used across the prototype so the site stays coherent.

export const APP_NAME = 'NeuroStep';
export const SCENARIO_NAME = 'Agent uči hodati';

export const NAV_ITEMS = [
  { id: 'home', label: 'Početna', href: 'index.html' },
  { id: 'scenario', label: 'Scenarij', href: 'scenario-selection.html' },
  { id: 'settings', label: 'Postavke', href: 'experiment-settings.html' },
  { id: 'experiment', label: 'Pokus', href: 'experiment.html' },
  { id: 'result', label: 'Rezultat', href: 'result.html' },
  { id: 'demo', label: 'Demo', href: 'demo.html' },
];

export const PAGE_STATUS = {
  home: { label: 'Ready', tone: 'ready' },
  scenario: { label: 'Ready', tone: 'ready' },
  settings: { label: 'Ready', tone: 'ready' },
  experiment: { label: 'In progress', tone: 'warning' },
  result: { label: 'Finished', tone: 'success' },
  error: { label: 'Error', tone: 'error' },
  demo: { label: 'Demo', tone: 'info' },
};

export const AI_TOPICS = {
  home: {
    title: 'AI objašnjenje: što je NeuroStep?',
    eyebrow: 'Početni kontekst',
    lead:
      'NeuroStep je napravljen da početniku pokaže da reinforcement learning nije “magična kutija”, nego niz pokušaja, povratnih informacija i postupnog poboljšanja.',
    bullets: [
      'Korisnik ne mora pisati kod da bi vidio ponašanje agenta.',
      'Graf nagrade i animacija agenta prikazuju isti proces iz dva kuta.',
      'Cilj je razumjeti trend, a ne memorirati tehničke detalje.',
    ],
    note:
      'Ako je cilj objašnjenje za predavanje, ova početna poruka je dobra kao uvod u seminar ili demonstraciju.',
  },
  scenario: {
    title: 'AI objašnjenje: zašto baš ovaj scenarij?',
    eyebrow: 'Odabir scenarija',
    lead:
      'Scenarij “Agent uči hodati” je dobar jer je intuitivan: svi odmah razumiju da se agent poboljšava kroz pokušaje, padove i ponavljanja.',
    bullets: [
      'Kretanje je lako usporediti s rastom nagrade na grafu.',
      'Scenarij je dovoljno jednostavan za početnike, ali i dalje pokazuje RL princip.',
      'Jedan scenarij održava fokus na učenju, a ne na previše opcija.',
    ],
    note:
      'Ovo je idealna točka za objasniti da prototip namjerno ima ograničen opseg.',
  },
  settings: {
    title: 'AI objašnjenje: što znače parametri?',
    eyebrow: 'Postavke pokusa',
    lead:
      'Learning rate određuje koliko agresivno agent uči iz novih iskustava, a broj epizoda govori koliko dugo ima priliku poboljšavati ponašanje.',
    bullets: [
      'Prenizak learning rate može značiti sporo, ali stabilno učenje.',
      'Previsok learning rate često uzrokuje nestabilnost i “skakanje” rezultata.',
      'Više epizoda obično daje bolju konvergenciju, ali traje dulje.',
    ],
    note:
      'Za prvi pokušaj obično je dobar umjeren learning rate i srednji broj epizoda.',
  },
  experiment: {
    title: 'AI objašnjenje: kako čitati pokus?',
    eyebrow: 'Praćenje učenja',
    lead:
      'Dok agent prolazi kroz epizode, krivulja nagrade pokazuje uči li postupno, stagnira li ili skače zbog prevelikog learning ratea.',
    bullets: [
      'Rani dio grafa je najčešće kaotičniji.',
      'Srednji dio otkriva je li agent počeo povezivati akcije s nagradom.',
      'Kasniji dio pokazuje stabilizira li se ponašanje.',
    ],
    note:
      'Kada se pokus završi, rezultat se ne otvara sam: korisnik ručno bira trenutak prelaska na završni ekran.',
  },
  result: {
    title: 'AI objašnjenje: što znači završni rezultat?',
    eyebrow: 'Sažetak pokusa',
    lead:
      'Dobar rezultat nije samo visoka nagrada. Bitni su i stabilnost, prosječan broj koraka, poboljšanje kroz vrijeme i brzina kojom je agent dosegnuo stabilnu izvedbu.',
    bullets: [
      'Ako je nagrada visoka, ali stabilnost niska, model je vjerojatno preosjetljiv.',
      'Ako je razlika između početka i kraja mala, agent je napredovao sporo ili je imao premalo epizoda.',
      'Najbolji rezultat je balans između kvalitete, stabilnosti i jasnog trenda učenja.',
    ],
    note:
      'Ovaj ekran je dobar za usporedbu različitih postavki, a preporuka za sljedeći pokus pomaže korisniku da odmah zna što promijeniti.',
  },
  error: {
    title: 'AI objašnjenje: zašto validacija postoji?',
    eyebrow: 'Greška unosa',
    lead:
      'Validacija štiti korisnika od postavki koje bi uništile smislen prikaz pokusa ili stvorile zbunjujuće rezultate.',
    bullets: [
      'Learning rate izvan raspona često daje previše nestabilne rezultate.',
      'Premalo epizoda ne ostavlja dovoljno vremena za učenje.',
      'Jasna poruka greške ubrzava povratak na ispravnu konfiguraciju.',
    ],
    note:
      'U edukacijskom alatu poruka greške mora biti objašnjenje, a ne prepreka.',
  },
  demo: {
    title: 'AI objašnjenje: što se mijenja u demo prikazu?',
    eyebrow: 'Projektorski način',
    lead:
      'Demo prikaz povećava čitljivost, smanjuje broj kontrola i fokusira pažnju publike na graf i agenta.',
    bullets: [
      'Veći elementi su pogodniji za projektor i učionicu.',
      'Kontrole su minimalne kako bi publika pratila samo glavni tok.',
      'Ovaj prikaz je dobar za prezentacije i kratke demonstracije.',
    ],
    note:
      'Ako profesor prikazuje projektor, demo način je najbolji izbor.',
  },
};

export const SCENARIO_COPY = {
  title: 'Agent uči hodati',
  subtitle: 'Jedan jasan RL scenarij za početnike.',
  description:
    'U ovoj verziji NeuroStepa korisnik prati kako agent iz pokušaja u pokušaj poboljšava ravnotežu, nagradu i ritam kretanja.',
  highlights: [
    'bez instalacije i bez koda',
    'vizualna poveznica između grafa i ponašanja',
    'AI objašnjenje na klik',
  ],
  teachingNotes:
    'Ovaj scenarij je dovoljno jednostavan za seminar, ali i dalje pokazuje kako se učenje mijenja kad se parametri prilagode.',
};

export const SETTINGS_COPY = {
  defaults: {
    learningRate: 0.001,
    episodes: 120,
    demoSpeed: 'normal',
    aiDepth: 'detailed',
  },
  learningRateHint: 'Preporučeni raspon: 0.0001 – 0.1',
  episodesHint: 'Preporučeni raspon: 10 – 1000',
  demoSpeedHint: 'Brzina animacije ne mijenja model, samo ritam prikaza.',
  aiDepthHint: 'Detaljnije objašnjenje je korisno za prezentacije i seminar.',
};

export const RESULT_LABELS = [
  'Prosječna nagrada',
  'Stopa uspjeha',
  'Prosječan broj koraka',
  'Stabilnost',
  'Brzina konvergencije',
  'Najbolja epizoda',
];

export function explainRange(field) {
  if (field === 'learningRate') {
    return 'Learning rate mora biti između 0.0001 i 0.1. Premala vrijednost usporava učenje, a previsoka često ruši stabilnost.';
  }
  if (field === 'episodes') {
    return 'Broj epizoda mora biti između 10 i 1000. Premalo epizoda ne daje dovoljno vremena za učenje.';
  }
  return 'Unesena vrijednost nije ispravna.';
}
