import { renderShell, navigate } from '../shared.js';

renderShell('Greška', 'Validacija • unos nije ispravan', 'Error');

document.getElementById('app').innerHTML = `
  <section class="panel">
    <div class="eyebrow">Greška</div>
    <h1>Neispravan unos</h1>
    <p class="lead">Kasnije će ovdje biti detaljne poruke za learning rate i broj epizoda.</p>
    <div class="info-card">
      <strong>Poruka</strong>
      <p>TODO: validation feedback.</p>
    </div>
    <div class="hero-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="fix">Ispravi unos</button>
      <button class="btn btn-secondary" id="home">Povratak na početak</button>
    </div>
  </section>
`;

document.getElementById('fix').addEventListener('click', () => navigate('./experiment-settings.html'));
document.getElementById('home').addEventListener('click', () => navigate('./index.html'));
