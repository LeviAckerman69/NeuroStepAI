import { APP_NAME, NAV_ITEMS, PAGE_STATUS, AI_TOPICS, SCENARIO_NAME } from './content.js';

const STATE_KEY = 'neurostep-state';
const LAST_PAGE_KEY = 'neurostep-last-page';

export const ROUTES = {
  home: 'index.html',
  scenario: 'scenario-selection.html',
  settings: 'experiment-settings.html',
  experiment: 'experiment.html',
  result: 'result.html',
  error: 'error.html',
  demo: 'demo.html',
};

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatDecimal(value, digits = 3) {
  return Number(value).toFixed(digits);
}

export function formatPercent(value, digits = 0) {
  return `${Number(value).toFixed(digits)}%`;
}

export function formatCompactNumber(value, digits = 1) {
  return Number(value).toFixed(digits).replace(/\.0$/, '');
}

export function navigate(page) {
  const target = ROUTES[page] || ROUTES.home;
  localStorage.setItem(LAST_PAGE_KEY, page);
  window.location.href = target;
}

export function getState() {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return { ...createDefaultState(), ...parsed };
  } catch {
    return createDefaultState();
  }
}

export function setState(patch) {
  const next = { ...getState(), ...patch, updatedAt: Date.now() };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(next));
  return next;
}

export function resetState(extra = {}) {
  const state = { ...createDefaultState(), ...extra };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  return state;
}

export function createDefaultState() {
  return {
    scenarioName: SCENARIO_NAME,
    learningRate: 0.001,
    episodes: 120,
    demoSpeed: 'normal',
    aiDepth: 'detailed',
    running: false,
    completed: false,
    paused: false,
    progressFrame: 0,
    progressFramesTotal: 24,
    series: [],
    metrics: null,
    statusMessage: 'Spremno za pokretanje pokusa.',
    lastCheckpoint: 'Home',
    error: null,
    recommendation: 'Počni s umjerenim learning rateom i srednjim brojem epizoda.',
  };
}

export function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function renderChrome({ active = 'home', status = 'home', subtitle = '', scenario = SCENARIO_NAME } = {}) {
  const chrome = document.getElementById('chrome');
  if (!chrome) return;

  const currentStatus = PAGE_STATUS[status] || PAGE_STATUS.home;
  const nav = NAV_ITEMS.map((item) => {
    const activeClass = item.id === active ? 'is-active' : '';
    return `<a class="nav-link ${activeClass}" href="${item.href}">${item.label}</a>`;
  }).join('');

  chrome.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true">
          <span>NS</span>
        </div>
        <div>
          <div class="brand-title">${APP_NAME}</div>
          <div class="brand-subtitle">${subtitle || 'Edukacijski desktop prototip za reinforcement learning'}</div>
        </div>
      </div>

      <nav class="nav" aria-label="Glavna navigacija">
        ${nav}
      </nav>

      <div class="chrome-meta">
        <span class="status-chip tone-${currentStatus.tone}">${currentStatus.label}</span>
        <span class="theme-pill">Dark mode</span>
      </div>
    </header>

    <section class="subheader">
      <div class="subheader-left">
        <span class="crumb">Scenarij</span>
        <strong>${scenario}</strong>
      </div>
      <div class="subheader-right">
        <span class="subtle-text">Desktop 1440×900 • klikabilni prototip</span>
      </div>
    </section>
  `;

  ensureAiModal();
  bindGlobalAiTriggers();
}

function ensureAiModal() {
  if (document.getElementById('ai-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'ai-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-backdrop" data-ai-close></div>
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="ai-title">
      <button class="icon-button modal-close" type="button" aria-label="Zatvori" data-ai-close>×</button>
      <div class="modal-hero">
        <div class="modal-eyebrow" id="ai-eyebrow">AI objašnjenje</div>
        <h2 id="ai-title"></h2>
        <p id="ai-lead"></p>
      </div>
      <div class="modal-body">
        <div class="ai-list-title">Ključne točke</div>
        <ul id="ai-bullets" class="bullet-list"></ul>
        <div id="ai-note" class="callout callout-info"></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" data-ai-close>Zatvori objašnjenje</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function bindGlobalAiTriggers() {
  if (window.__neurostepAiBound) return;
  window.__neurostepAiBound = true;

  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-ai-topic]');
    if (openTrigger) {
      const topic = openTrigger.getAttribute('data-ai-topic');
      openAiModal(topic);
      return;
    }

    const closeTrigger = event.target.closest('[data-ai-close]');
    if (closeTrigger) {
      closeAiModal();
    }
  });
}

export function openAiModal(topic) {
  const modal = document.getElementById('ai-modal');
  const content = AI_TOPICS[topic] || AI_TOPICS.home;
  if (!modal) return;

  modal.querySelector('#ai-eyebrow').textContent = content.eyebrow;
  modal.querySelector('#ai-title').textContent = content.title;
  modal.querySelector('#ai-lead').textContent = content.lead;

  const list = modal.querySelector('#ai-bullets');
  list.innerHTML = content.bullets.map((item) => `<li>${item}</li>`).join('');
  modal.querySelector('#ai-note').textContent = content.note;
  modal.classList.add('is-open');
  document.body.classList.add('modal-open');
}

export function closeAiModal() {
  const modal = document.getElementById('ai-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
}

export function setAiTopicText(root, topic, compact = false) {
  const content = AI_TOPICS[topic] || AI_TOPICS.home;
  const target = root.querySelector('.ai-topic');
  if (!target) return;
  target.innerHTML = `
    <div class="ai-topic-head">
      <div class="eyebrow">${content.eyebrow}</div>
      <h3>${content.title}</h3>
    </div>
    <p>${content.lead}</p>
    ${compact ? '' : `<ul class="bullet-list compact">${content.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>`}
  `;
}

export function renderPageHeader(root, { page, status, subtitle = '', scenario = SCENARIO_NAME }) {
  renderChrome({ active: page, status, subtitle, scenario });
}

export function renderHeroMetric(label, value, note = '') {
  return `
    <div class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
      ${note ? `<div class="metric-note">${note}</div>` : ''}
    </div>
  `;
}

export function loadState() {
  return getState();
}

export function saveState(patch) {
  return setState(patch);
}

export function clearState() {
  sessionStorage.removeItem(STATE_KEY);
}

export function getDefaultFor(key) {
  const defaults = createDefaultState();
  return defaults[key];
}

export function storeError(error) {
  const current = getState();
  const next = { ...current, error };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(next));
  return next;
}

export function getLastPage() {
  return localStorage.getItem(LAST_PAGE_KEY) || 'home';
}

export { APP_NAME, SCENARIO_NAME };
