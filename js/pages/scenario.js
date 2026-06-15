import { renderPageHeader, navigate, setAiTopicText } from '../shared.js';
import { SCENARIO_COPY } from '../content.js';

renderPageHeader(document, {
  page: 'scenario',
  status: 'scenario',
  subtitle: 'Odabir scenarija • jedan fokusirani tok',
});

document.getElementById('app').innerHTML = `
  <section class="panel scenario-layout">
    <div>
      <div class="eyebrow">Odaberi scenarij</div>
      <h1>${SCENARIO_COPY.title}</h1>
      <p class="lead">${SCENARIO_COPY.description}</p>

      <div class="scenario-chip-row">
        ${SCENARIO_COPY.highlights.map((item) => `<span class="pill">${item}</span>`).join('')}
      </div>

      <div class="scenario-card featured">
        <div class="scenario-icon">🦶</div>
        <div class="scenario-content">
          <h2>Agent uči hodati</h2>
          <p>${SCENARIO_COPY.teachingNotes}</p>
          <div class="button-row">
            <button class="btn btn-primary" id="choose-scenario">Odaberi scenarij</button>
            <button class="btn btn-secondary" id="back-home">Natrag</button>
            <button class="btn btn-ghost" data-ai-topic="scenario">AI objašnjenje</button>
          </div>
        </div>
      </div>
    </div>

    <aside class="panel nested">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Što će korisnik vidjeti?</div>
          <h2>Kratka mapa iskustva</h2>
        </div>
      </div>
      <article class="info-card ai-topic" style="margin-bottom:14px;">
        <strong>AI objašnjenje</strong>
        <p>Scenarij “Agent uči hodati” je dobar jer je intuitivan: svi odmah razumiju da se agent poboljšava kroz pokušaje, padove i ponavljanja.</p>
      </article>
      <ul class="bullet-list">
        <li>Jedan scenarij da se pažnja ne rasprši.</li>
        <li>Jasno označen prijelaz u postavke pokusa.</li>
        <li>AI objašnjenje kao most između grafa i ponašanja.</li>
        <li>Rezultat se kasnije otvara ručno, bez preskakanja ekrana.</li>
      </ul>
      <div class="callout callout-info">
        <strong>Pedagoška logika</strong>
        <p>Scenarij je namjerno jednostavan, ali dovoljno bogat da pokaže kako parametri utječu na učenje.</p>
      </div>
    </aside>
  </section>
`;

setAiTopicText(document, 'scenario', true);

document.getElementById('choose-scenario').addEventListener('click', () => navigate('settings'));
document.getElementById('back-home').addEventListener('click', () => navigate('home'));
