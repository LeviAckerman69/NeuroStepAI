import { renderShell, navigate } from '../shared.js';

renderShell('Rezultat', 'Završni rezultat • sažetak', 'Finished');

document.getElementById('app').innerHTML = `
  <section class="panel">
    <div class="eyebrow">Rezultat</div>
    <h1>Završni rezultat</h1>
    <p class="lead">Ovo je privremeni rezultat screen. Kasnije će biti detaljnije metrike, interpretacija i preporuke.</p>

    <div class="grid-3">
      <div class="metric-card"><div class="metric-label">Prosječna nagrada</div><div class="metric-value">TODO</div></div>
      <div class="metric-card"><div class="metric-label">Uspješnost</div><div class="metric-value">TODO</div></div>
      <div class="metric-card"><div class="metric-label">Prosječni koraci</div><div class="metric-value">TODO</div></div>
    </div>

    <div class="hero-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="again">Promijeni parametre</button>
      <button class="btn btn-secondary" id="home">Povratak na početak</button>
    </div>
  </section>
`;

document.getElementById('again').addEventListener('click', () => navigate('./experiment-settings.html'));
document.getElementById('home').addEventListener('click', () => navigate('./index.html'));
