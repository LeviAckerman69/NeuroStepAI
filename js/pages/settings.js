import { renderPageHeader, navigate, saveState, loadState, storeError } from '../shared.js';
import { SETTINGS_COPY } from '../content.js';
import { parseExperimentValues, validateExperimentValues, formatValidationSummary } from '../validation.js';

renderPageHeader(document, {
  page: 'settings',
  status: 'settings',
  subtitle: 'Postavke pokusa • unos i validacija',
});

const state = loadState();

document.getElementById('app').innerHTML = `
  <section class="panel settings-layout">
    <div class="panel">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Postavke pokusa</div>
          <h1>Prilagodi učenje prije pokretanja pokusa</h1>
        </div>
        <button class="btn btn-ghost" data-ai-topic="settings">AI objašnjenje</button>
      </div>

      <form id="settings-form" class="settings-form">
        <div class="form-grid">
          <label class="field">
            <span>Learning rate</span>
            <input name="learningRate" type="number" step="0.0001" min="0.0001" max="0.1" value="${state.learningRate}" />
            <small>${SETTINGS_COPY.learningRateHint}</small>
          </label>

          <label class="field">
            <span>Broj epizoda</span>
            <input name="episodes" type="number" step="1" min="10" max="1000" value="${state.episodes}" />
            <small>${SETTINGS_COPY.episodesHint}</small>
          </label>

          <label class="field">
            <span>Brzina prikaza</span>
            <select name="demoSpeed">
              <option value="slow" ${state.demoSpeed === 'slow' ? 'selected' : ''}>Sporo</option>
              <option value="normal" ${state.demoSpeed === 'normal' ? 'selected' : ''}>Normalno</option>
              <option value="fast" ${state.demoSpeed === 'fast' ? 'selected' : ''}>Brzo</option>
            </select>
            <small>${SETTINGS_COPY.demoSpeedHint}</small>
          </label>

          <label class="field">
            <span>Dubina AI objašnjenja</span>
            <select name="aiDepth">
              <option value="short" ${state.aiDepth === 'short' ? 'selected' : ''}>Kratko</option>
              <option value="detailed" ${state.aiDepth === 'detailed' ? 'selected' : ''}>Detaljno</option>
            </select>
            <small>${SETTINGS_COPY.aiDepthHint}</small>
          </label>
        </div>

        <div class="callout callout-soft">
          <strong>Preporuka za prvi pokus</strong>
          <p>Koristi learning rate 0.001 i oko 120 epizoda. To obično daje stabilan graf bez pretjerane oscilacije.</p>
        </div>

        <div class="button-row">
          <button class="btn btn-primary" type="submit">Pokreni pokus</button>
          <button class="btn btn-secondary" type="button" id="back-scenario">Natrag</button>
        </div>
      </form>
    </div>

    <aside class="panel nested">
      <div class="panel-head">
        <div>
          <div class="eyebrow">Što svaki parametar radi?</div>
          <h2>Brza pomoć za početnike</h2>
        </div>
      </div>

      <div class="info-stack">
        <article class="info-card">
          <strong>Learning rate</strong>
          <p>Previše visok može učiniti učenje nestabilnim. Prenizak usporava napredak.</p>
        </article>
        <article class="info-card">
          <strong>Broj epizoda</strong>
          <p>Veći broj epizoda znači više prilika za poboljšanje i stabilizaciju.</p>
        </article>
        <article class="info-card">
          <strong>AI dubina</strong>
          <p>Kratko je dovoljno za usputni pogled, a detaljno je bolje za seminar i prezentaciju.</p>
        </article>
      </div>

      <div class="callout callout-info">
        <strong>Validacija</strong>
        <p>Neispravan unos vodi na ekran greške s jasnim objašnjenjem, a ne na tehnički “šum”.</p>
      </div>
    </aside>
  </section>
`;

document.getElementById('back-scenario').addEventListener('click', () => navigate('scenario'));

document.getElementById('settings-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const values = parseExperimentValues(new FormData(event.currentTarget));
  const errors = validateExperimentValues(values);

  if (errors.length) {
    storeError({
      title: errors[0].title,
      message: errors[0].message,
      help: formatValidationSummary(errors),
      details: errors,
    });
    navigate('error');
    return;
  }

  saveState({
    ...loadState(),
    learningRate: values.learningRate,
    episodes: values.episodes,
    demoSpeed: values.demoSpeed,
    aiDepth: values.aiDepth,
    completed: false,
    running: false,
    paused: false,
    progressFrame: 0,
    series: [],
    metrics: null,
    statusMessage: 'Postavke su spremljene. Pokus je spreman za pokretanje.',
    recommendation: 'Pokreni pokus i promatraj kako se krivulja mijenja.',
    error: null,
  });
  navigate('experiment');
});
