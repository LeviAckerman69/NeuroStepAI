import { renderShell, navigate } from '../shared.js';

renderShell('Početna', 'Početna stranica • uvod u prototip', 'Ready');

document.getElementById('app').innerHTML = `
  <section class="hero">
    <div class="hero-copy">
      <span class="eyebrow">AI za obrazovanje • desktop prototip</span>
      <h1>NeuroStep pretvara reinforcement learning u nešto što se može vidjeti.</h1>
      <p class="lead">
        Ova baza služi kao početni repo za tim. Na njoj će se postupno nadograđivati scenarij, postavke, pokus,
        objašnjenja, rezultati i demo prikaz.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary" id="start-demo">Započni demonstraciju</button>
        <button class="btn btn-secondary" id="go-scenario">Scenarij</button>
      </div>
    </div>
    <div class="hero-side">
      <div class="panel">
        <div class="eyebrow">Što još treba dovršiti?</div>
        <div class="grid-3">
          <div class="info-card"><strong>Scenarij</strong><p>Jedan RL walking flow.</p></div>
          <div class="info-card"><strong>AI objašnjenje</strong><p>Više koraka i više panela.</p></div>
          <div class="info-card"><strong>Rezultat</strong><p>Detaljniji statistički prikaz.</p></div>
        </div>
      </div>
    </div>
  </section>
`;

document.getElementById('start-demo').addEventListener('click', () => navigate('./scenario-selection.html'));
document.getElementById('go-scenario').addEventListener('click', () => navigate('./scenario-selection.html'));
