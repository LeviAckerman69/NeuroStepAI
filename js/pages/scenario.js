import { renderShell, navigate } from '../shared.js';

renderShell('Scenarij', 'Odabir scenarija • agent uči hodati', 'Ready');

document.getElementById('app').innerHTML = `
  <section class="panel">
    <div class="eyebrow">Scenarij</div>
    <h1>Odaberi scenarij</h1>
    <p class="lead">Za sada postoji samo jedan glavni scenarij. On će se kasnije proširiti dodatnim objašnjenjima i vizualima.</p>
    <div class="info-card">
      <strong>Agent uči hodati</strong>
      <p>Pripremljeni RL scenarij za demonstraciju napretka kroz epizode.</p>
    </div>
    <div class="hero-actions" style="margin-top:16px;">
      <button class="btn btn-primary" id="choose">Odaberi scenarij</button>
      <button class="btn btn-secondary" id="back">Natrag</button>
    </div>
  </section>
`;

document.getElementById('choose').addEventListener('click', () => navigate('./experiment-settings.html'));
document.getElementById('back').addEventListener('click', () => navigate('./index.html'));
