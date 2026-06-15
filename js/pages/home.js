import { renderPageHeader, navigate, setAiTopicText, loadState } from '../shared.js';

renderPageHeader(document, {
  page: 'home',
  status: 'home',
  subtitle: 'Početna stranica • uvod u prototip',
});

const state = loadState();

document.getElementById('app').innerHTML = `
  <section class="hero">
    <div class="hero-copy">
      <span class="eyebrow">AI za obrazovanje • desktop prototip</span>
      <h1>NeuroStep pretvara reinforcement learning u nešto što se može vidjeti.</h1>
      <p class="lead">
        Jedan scenarij, jasni parametri i klikabilan tok. Umjesto čitanja teorije bez konteksta, korisnik prati
        agenta, graf nagrade i kratka AI objašnjenja u svakom koraku.
      </p>

      <div class="hero-actions">
        <button class="btn btn-primary" id="start-demo">Započni demonstraciju</button>
        <button class="btn btn-secondary" data-ai-topic="home">AI objašnjenje</button>
      </div>

      <div class="hero-badges">
        <span class="pill">Bez instalacije</span>
        <span class="pill">1440 × 900</span>
        <span class="pill">Dark mode</span>
        <span class="pill">Klikabilno</span>
      </div>
    </div>

    <div class="hero-side">
      <div class="panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Što se prikazuje?</div>
            <h2>Tri stupca razumijevanja</h2>
          </div>
          <span class="status-chip tone-ready">Ready</span>
        </div>
        <div class="story-grid">
          <article class="info-card ai-topic">
            <strong>AI objašnjenje</strong>
            <p>NeuroStep je napravljen da početniku pokaže da reinforcement learning nije “magična kutija”, nego niz pokušaja, povratnih informacija i postupnog poboljšanja.</p>
          </article>
          <article class="info-card">
            <strong>Parametri</strong>
            <p>Learning rate i broj epizoda mogu promijeniti tijek i stabilnost učenja.</p>
          </article>
          <article class="info-card">
            <strong>AI objašnjenje</strong>
            <p>Kontekstualna objašnjenja pomažu korisniku da ne ostane samo na “što”, nego i na “zašto”.</p>
          </article>
        </div>
      </div>

      <div class="panel compact">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Brzi pregled toka</div>
            <h2>Home → Scenarij → Postavke → Pokus → Rezultat</h2>
          </div>
        </div>
        <ol class="step-list">
          <li>Otvara se početna stranica s jasnim uvodom.</li>
          <li>Bira se jedini scenarij: agent uči hodati.</li>
          <li>Unose se parametri i prolazi validacija.</li>
          <li>Pokus se prati bez automatskog preskakanja.</li>
          <li>Rezultat se otvara ručno kada korisnik želi.</li>
        </ol>
      </div>
    </div>
  </section>

  <section class="section-grid">
    <article class="panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Zašto je ovo korisno?</div>
          <h2>Za seminar, nastavu i samostalno učenje</h2>
        </div>
      </div>
      <div class="two-col">
        <div class="callout callout-info">
          <strong>Kratko i jasno</strong>
          <p>Sučelje je namjerno jednostavno kako bi početnik u ML-u brzo vidio što se mijenja i zašto.</p>
        </div>
        <div class="callout callout-soft">
          <strong>Bez tehničkog opterećenja</strong>
          <p>Ne treba postavljati okruženje niti pisati kod; fokus je na razumijevanju ponašanja modela.</p>
        </div>
      </div>
    </article>

    <article class="panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Preporučeno za prvi run</div>
          <h2>LR 0.001 + 120 epizoda</h2>
        </div>
      </div>
      <div class="mini-metrics">
        <div class="metric-card">
          <div class="metric-label">Ritam učenja</div>
          <div class="metric-value">uravnotežen</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Publika</div>
          <div class="metric-value">početnici</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Prikaz</div>
          <div class="metric-value">desktop</div>
        </div>
      </div>
    </article>
  </section>
`;

setAiTopicText(document, 'home', true);

document.getElementById('start-demo').addEventListener('click', () => navigate('scenario'));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') navigate('scenario');
});
