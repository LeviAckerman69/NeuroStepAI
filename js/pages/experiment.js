import { renderPageHeader, navigate, loadState, saveState } from '../shared.js';
import { renderRewardChart, renderAgent, buildExperimentRun } from '../visuals.js';
import { initExperimentControls } from '../experiment.js';

renderPageHeader(document, {
  page: 'experiment',
  status: 'experiment',
  subtitle: 'Pokus u tijeku • graf, agent i status',
});

const state = loadState();
const run = buildExperimentRun(state);

document.getElementById('app').innerHTML = `
  <section class="panel experiment-layout">
    <div class="experiment-topbar">
      <div>
        <div class="eyebrow">Eksperiment u tijeku</div>
        <h1>Prati agenta, graf i objašnjenje — bez automatskog preskakanja ekrana</h1>
      </div>
      <div class="experiment-status">
        <span class="status-chip tone-warning" id="status-badge">Spremno</span>
        <span class="pill" id="manual-tip">Pritisni pokretanje i prati epizode.</span>
      </div>
    </div>

    <div class="progress-block">
      <div class="progress-head">
        <span id="progress-label">0 / ${state.episodes} epizoda</span>
        <span id="checkpoint-label">Spremno za pokretanje pokusa.</span>
      </div>
      <div class="progress-track"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
    </div>

    <div class="experiment-grid">
      <div class="visual-panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Animacija agenta</div>
            <h2>Kretanje se mijenja kroz epizode</h2>
          </div>
        </div>
        <canvas id="agent-canvas" class="agent-canvas" width="840" height="360"></canvas>
        <div class="chart-caption">
          <span id="reward-now">10</span>
          <span>Trenutna nagrada</span>
          <span id="stability-now">50%</span>
        </div>
      </div>

      <div class="chart-panel">
        <div id="chart-container"></div>
      </div>
    </div>

    <div class="experiment-bottom">
      <div class="panel nested">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Sažetak postavki</div>
            <h2>Parametri koji utječu na učenje</h2>
          </div>
        </div>
        <div class="mini-metrics">
          <div class="metric-card">
            <div class="metric-label">Learning rate</div>
            <div class="metric-value">${state.learningRate}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Broj epizoda</div>
            <div class="metric-value">${state.episodes}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">AI dubina</div>
            <div class="metric-value">${state.aiDepth === 'short' ? 'kratko' : 'detaljno'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Brzina prikaza</div>
            <div class="metric-value">${state.demoSpeed}</div>
          </div>
        </div>
      </div>

      <div class="panel nested">
        <div class="panel-head">
          <div>
            <div class="eyebrow">AI na klik</div>
            <h2>Objašnjenje kroz svaki korak</h2>
          </div>
        </div>
        <div class="info-stack">
          <article class="info-card ai-topic">
            <strong>AI objašnjenje</strong>
            <p>Klikni gumb da otvoriš detaljno objašnjenje grafa i ponašanja agenta.</p>
          </article>
          <article class="info-card">
            <strong>Pravilo prijelaza</strong>
            <p>Eksperiment se ne završava automatski na drugom ekranu. Rezultat otvaraš ručno kada želiš.</p>
          </article>
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="start-button">Pokreni pokus</button>
          <button class="btn btn-secondary" id="pause-button">Pauziraj</button>
          <button class="btn btn-secondary" id="reset-button">Resetiraj</button>
          <button class="btn btn-ghost" id="explain-button" data-ai-topic="experiment">Objasni rezultat</button>
          <button class="btn btn-ghost" id="finish-button" disabled>Prikaži završni rezultat</button>
        </div>
      </div>
    </div>
  </section>
`;

const chartContainer = document.getElementById('chart-container');
const canvas = document.getElementById('agent-canvas');

const ui = {
  startButton: document.getElementById('start-button'),
  pauseButton: document.getElementById('pause-button'),
  resetButton: document.getElementById('reset-button'),
  explainButton: document.getElementById('explain-button'),
  finishButton: document.getElementById('finish-button'),
  progressFill: document.getElementById('progress-fill'),
  progressLabel: document.getElementById('progress-label'),
  statusBadge: document.getElementById('status-badge'),
  checkpoint: document.getElementById('checkpoint-label'),
  rewardNow: document.getElementById('reward-now'),
  stabilityNow: document.getElementById('stability-now'),
  manualTip: document.getElementById('manual-tip'),
};

const controller = initExperimentControls({
  root: document,
  canvas,
  chartContainer,
  ui,
});

const initialRun = loadState().series.length ? loadState().series : run.series;
renderRewardChart(chartContainer, initialRun, { activeIndex: Math.min(loadState().progressFrame || 0, initialRun.length - 1) });
renderAgent(canvas, { progress: 0, stable: 0.55, speed: loadState().demoSpeed === 'fast' ? 1.2 : 1 });

document.addEventListener('keydown', (event) => {
  if (event.key === 'r') {
    controller.reset();
  }
});
