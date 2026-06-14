import { renderShell, navigate } from '../shared.js';

renderShell('Demo', 'Projekcijski prikaz • prezentacija', 'Ready');

document.getElementById('app').innerHTML = `
  <section class="panel">
    <div class="eyebrow">Demo prikaz</div>
    <h1>Demo / projector mode</h1>
    <p class="lead">Ova stranica će kasnije imati veće vizuale i manje kontrole za učionicu ili projekciju.</p>
    <div class="bg-placeholder">TODO: enlarged graph and agent visual</div>
    <div class="hero-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="back">Natrag</button>
    </div>
  </section>
`;

document.getElementById('back').addEventListener('click', () => navigate('./index.html'));
