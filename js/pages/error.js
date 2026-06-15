import { renderPageHeader, navigate, loadState } from '../shared.js';

renderPageHeader(document, {
  page: 'error',
  status: 'error',
  subtitle: 'Poruka greške • validacija unosa',
});

const state = loadState();
const error = state.error || {
  title: 'Unos nije ispravan.',
  message: 'Provjeri vrijednosti prije nastavka.',
  help: 'Learning rate mora biti između 0.0001 i 0.1, a broj epizoda između 10 i 1000.',
  details: [],
};

document.getElementById('app').innerHTML = `
  <section class="panel error-layout">
    <div class="error-hero">
      <div class="error-icon">!</div>
      <div>
        <div class="eyebrow">Neispravan unos</div>
        <h1>${error.title}</h1>
        <p class="lead">${error.message}</p>
      </div>
    </div>

    <div class="two-col">
      <div class="callout callout-danger">
        <strong>Što je pošlo po zlu?</strong>
        <p>${error.help}</p>
      </div>
      <div class="callout callout-info">
        <strong>Što sada?</strong>
        <p>Vrati se na postavke i ispravi polja. Kada je unos valjan, pokus se otvara bez dodatnih koraka.</p>
      </div>
    </div>

    <div class="panel nested">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Valjani rasponi</div>
          <h2>Brzi podsjetnik</h2>
        </div>
      </div>
      <div class="mini-metrics">
        <div class="metric-card">
          <div class="metric-label">Learning rate</div>
          <div class="metric-value">0.0001 – 0.1</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Broj epizoda</div>
          <div class="metric-value">10 – 1000</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Poruka</div>
          <div class="metric-value">jasna i objašnjavajuća</div>
        </div>
      </div>
    </div>

    <div class="button-row">
      <button class="btn btn-primary" id="fix-input">Ispravi unos</button>
      <button class="btn btn-secondary" id="back-home">Povratak na početak</button>
      <button class="btn btn-ghost" data-ai-topic="error">AI objašnjenje</button>
    </div>
  </section>
`;

document.getElementById('fix-input').addEventListener('click', () => navigate('settings'));
document.getElementById('back-home').addEventListener('click', () => navigate('home'));
