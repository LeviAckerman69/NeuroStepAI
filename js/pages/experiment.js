import { renderShell, navigate } from '../shared.js';
import { renderAgentPlaceholder, renderChartPlaceholder } from '../visuals.js';

renderShell('Pokus', 'Eksperiment u tijeku • ručni prijelaz', 'In progress');

document.getElementById('app').innerHTML = `
  <section class="panel">
    <div class="eyebrow">Eksperiment</div>
    <h1>Pokus u tijeku</h1>
    <p class="lead">U finalnoj verziji ovdje će biti vizualizacija agenta, graf nagrade, status i AI objašnjenje.</p>

    <div class="grid-3">
      <div class="info-card">${renderAgentPlaceholder()}</div>
      <div class="info-card">${renderChartPlaceholder()}</div>
      <div class="info-card">
        <strong>Status</strong>
        <p>TODO: progress panel, explanation entry points and manual continue button.</p>
      </div>
    </div>

    <div class="hero-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="explain">Objasni rezultat</button>
      <button class="btn btn-secondary" id="finish">Prikaži završni rezultat</button>
    </div>
  </section>
`;

document.getElementById('explain').addEventListener('click', () => navigate('./result.html'));
document.getElementById('finish').addEventListener('click', () => navigate('./result.html'));
