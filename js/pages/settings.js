import { renderShell, navigate } from '../shared.js';

renderShell('Postavke', 'Unos parametara • eksperiment', 'Ready');

document.getElementById('app').innerHTML = `
  <section class="panel">
    <div class="eyebrow">Postavke</div>
    <h1>Postavi eksperiment</h1>
    <p class="lead">Ovo je skraćena baza. Teammates will add validation, helper text and richer controls here.</p>

    <div class="grid-3">
      <label class="info-card">
        <strong>Learning rate</strong>
        <input type="text" placeholder="0.001" style="margin-top:10px; width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); background:rgba(255,255,255,0.03); color:var(--text);" />
      </label>
      <label class="info-card">
        <strong>Broj epizoda</strong>
        <input type="text" placeholder="120" style="margin-top:10px; width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); background:rgba(255,255,255,0.03); color:var(--text);" />
      </label>
      <div class="info-card">
        <strong>AI objašnjenje</strong>
        <p>Kasnije će ovdje biti dodatni helper panel i validacija.</p>
      </div>
    </div>

    <div class="hero-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="run">Pokreni pokus</button>
      <button class="btn btn-secondary" id="back">Natrag</button>
    </div>
  </section>
`;

document.getElementById('run').addEventListener('click', () => navigate('./experiment.html'));
document.getElementById('back').addEventListener('click', () => navigate('./scenario-selection.html'));
