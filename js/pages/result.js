import { renderPageHeader, navigate, loadState, setAiTopicText } from '../shared.js';
import { renderRewardChart } from '../visuals.js';
import { RESULT_LABELS } from '../content.js';

renderPageHeader(document, {
  page: 'result',
  status: 'result',
  subtitle: 'Završni rezultat • detaljan sažetak pokusa',
});

const state = loadState();
const metrics = state.metrics || {
  averageReward: 0,
  successRate: 0,
  averageSteps: 0,
  stability: 0,
  convergenceSpeed: 0,
  bestEpisode: 0,
  peakReward: 0,
  explanationTone: 'nepoznat',
};

const series = state.series && state.series.length ? state.series : [
  { episode: 0, reward: 10, stability: 50 },
  { episode: Math.max(10, Math.round(state.episodes / 3)), reward: 26, stability: 64 },
  { episode: Math.max(20, Math.round((state.episodes / 3) * 2)), reward: 42, stability: 74 },
  { episode: state.episodes, reward: 58, stability: 82 },
];

const firstPoint = series[0] || { reward: 0, episode: 0 };
const midPoint = series[Math.floor(series.length / 2)] || firstPoint;
const lastPoint = series[series.length - 1] || firstPoint;
const improvement = lastPoint.reward - firstPoint.reward;
const improvementLabel = `${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}`;
const lateAverage = averageOf(series.slice(Math.max(0, series.length - 5)).map((item) => item.reward));
const earlyAverage = averageOf(series.slice(0, Math.min(5, series.length)).map((item) => item.reward));

document.getElementById('app').innerHTML = `
  <section class="panel result-layout">
    <div class="result-hero">
      <div class="success-badge">✓</div>
      <div>
        <div class="eyebrow">Eksperiment završen</div>
        <h1>Agent je završio pokus i rezultat je spreman za analizu</h1>
        <p class="lead">
          Finalni ekran ne služi samo kao kraj, nego kao sažetak onoga što se dogodilo, zašto se dogodilo
          i što promijeniti u sljedećem pokušaju.
        </p>
      </div>
    </div>

    <div class="mini-metrics result-metrics">
      ${metricCard('Prosječna nagrada', metrics.averageReward)}
      ${metricCard('Stopa uspjeha', `${metrics.successRate}%`)}
      ${metricCard('Prosječan broj koraka', metrics.averageSteps)}
      ${metricCard('Stabilnost', `${metrics.stability}%`)}
      ${metricCard('Brzina konvergencije', `${metrics.convergenceSpeed} ep.`)}
      ${metricCard('Najbolja epizoda', metrics.bestEpisode)}
      ${metricCard('Vrh nagrade', metrics.peakReward)}
      ${metricCard('Poboljšanje', improvementLabel)}
    </div>

    <div class="result-grid">
      <div class="panel nested">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Graf i interpretacija</div>
            <h2>Krivulja pokazuje kako se učenje mijenjalo kroz epizode</h2>
          </div>
        </div>

        <div id="result-chart"></div>

        <div class="callout callout-soft">
          <strong>Što je vidljivo na grafu?</strong>
          <p>
            Početne epizode kreću skromnije, sredina pokazuje hoće li agent “uhvatiti ritam”, a završetak otkriva
            je li rezultat stabiliziran. U ovom pokusu prosjek na kraju ({formatAverage(lateAverage)}) usporediv je
            s početkom ({formatAverage(earlyAverage)}), što znači da je model napredovao postupno i bez naglih skokova.
          </p>
        </div>

        <div class="three-snapshot-grid">
          ${snapshotCard('Početak pokusa', firstPoint.episode, firstPoint.reward, 'Agent još istražuje i traži stabilan obrazac.')}
          ${snapshotCard('Sredina pokusa', midPoint.episode, midPoint.reward, 'Korisno je pratiti kada krivulja prelazi iz šuma u trend.')}
          ${snapshotCard('Kraj pokusa', lastPoint.episode, lastPoint.reward, 'Završni dio pokazuje koliko se agent uspio ustabiliti.')}
        </div>
      </div>

      <div class="panel nested">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Sažetak pokusa</div>
            <h2>Parametri, AI objašnjenje i sljedeći korak</h2>
          </div>
        </div>

        <div class="info-stack">
          <article class="info-card ai-topic">
            <strong>AI interpretacija</strong>
            <p>
              Dobar rezultat nije samo visoka nagrada. Bitni su i stabilnost, prosječan broj koraka, te brzina kojom
              se agent prestaje “lutati” kroz epizode.
            </p>
          </article>
          <article class="info-card">
            <strong>Learning rate</strong>
            <p>${state.learningRate}</p>
          </article>
          <article class="info-card">
            <strong>Broj epizoda</strong>
            <p>${state.episodes}</p>
          </article>
          <article class="info-card">
            <strong>Stanje učenja</strong>
            <p>${metrics.explanationTone}</p>
          </article>
          <article class="info-card">
            <strong>Preporuka za sljedeći pokus</strong>
            <p>
              Pokušaj isti learning rate uz još 20–40 epizoda ili blago smanji learning rate ako želiš još
              mirniju krivulju.
            </p>
          </article>
        </div>

        <div class="callout callout-info">
          <strong>Što sada napraviti?</strong>
          <p>
            Ako želiš usporedbu, promijeni parametre i ponovno pokreni pokus. Ako želiš prezentaciju, demo prikaz
            je bolji za projektor i učionicu.
          </p>
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="change-params">Promijeni parametre</button>
          <button class="btn btn-secondary" id="reset-scenario">Resetiraj</button>
          <button class="btn btn-secondary" id="demo-view">Demo prikaz</button>
          <button class="btn btn-ghost" data-ai-topic="result">AI objašnjenje</button>
        </div>
      </div>
    </div>

    <div class="panel nested">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Sažetak po kriterijima</div>
          <h2>Što je korisnik zapravo dobio?</h2>
        </div>
      </div>
      <div class="mini-metrics">
        ${RESULT_LABELS.map((label, index) => metricCard(label, [
          metrics.averageReward,
          `${metrics.successRate}%`,
          metrics.averageSteps,
          `${metrics.stability}%`,
          `${metrics.convergenceSpeed} ep.`,
          metrics.bestEpisode,
        ][index])).join('')}
      </div>
    </div>
  </section>
`;

setAiTopicText(document, 'result', false);

renderRewardChart(document.getElementById('result-chart'), series, { activeIndex: series.length - 1, wide: true });

document.getElementById('change-params').addEventListener('click', () => navigate('settings'));
document.getElementById('reset-scenario').addEventListener('click', () => navigate('scenario'));
document.getElementById('demo-view').addEventListener('click', () => navigate('demo'));

function metricCard(label, value) {
  return `
    <div class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
    </div>
  `;
}

function snapshotCard(title, episode, reward, note) {
  return `
    <article class="info-card">
      <strong>${title}</strong>
      <p><b>Epizoda:</b> ${episode}</p>
      <p><b>Nagrada:</b> ${reward}</p>
      <p>${note}</p>
    </article>
  `;
}

function averageOf(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatAverage(value) {
  return Number(value).toFixed(1);
}
