import { renderPageHeader, navigate, loadState } from '../shared.js';
import { buildExperimentRun, renderRewardChart, renderAgent } from '../visuals.js';

renderPageHeader(document, {
  page: 'demo',
  status: 'demo',
  subtitle: 'Demonstracijski prikaz • projektor i učionica',
});

const state = loadState();
const run = buildExperimentRun(state);
const series = state.series && state.series.length ? state.series : run.series;

document.getElementById('app').innerHTML = `
  <section class="panel demo-layout">
    <div class="demo-top">
      <div>
        <div class="eyebrow">Demo / projector mode</div>
        <h1>Veći prikaz za predavanje i lakše čitanje na projektoru</h1>
        <p class="lead">
          Ovaj način smanjuje broj kontrola i povećava vizualne elemente, tako da publika vidi samo ono najbitnije.
        </p>
      </div>
      <div class="button-row">
        <button class="btn btn-primary" id="back-experiment">Natrag na pokus</button>
        <button class="btn btn-secondary" data-ai-topic="demo">AI objašnjenje</button>
      </div>
    </div>

    <div class="demo-grid">
      <div class="visual-panel large">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Agent</div>
            <h2>Povećana animacija</h2>
          </div>
          <span class="status-chip tone-info">Demo</span>
        </div>
        <canvas id="demo-canvas" class="agent-canvas agent-canvas-large" width="920" height="430"></canvas>
      </div>

      <div class="chart-panel large">
        <div id="demo-chart"></div>
      </div>
    </div>

    <div class="callout callout-soft">
      <strong>Kako koristiti demo način?</strong>
      <p>Idealno za kratku prezentaciju: pokreni pokus, pusti da se napredak vidi nekoliko sekundi i zatim prijeđi na završni rezultat.</p>
    </div>
  </section>
`;

renderRewardChart(document.getElementById('demo-chart'), series, { activeIndex: series.length - 1, wide: true });
renderAgent(document.getElementById('demo-canvas'), { progress: 0.78, stable: 0.82, speed: 0.85 });

document.getElementById('back-experiment').addEventListener('click', () => navigate('experiment'));
