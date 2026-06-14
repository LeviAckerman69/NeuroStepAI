export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function renderShell(title, subtitle, status = 'Ready') {
  const chrome = qs('#chrome');
  chrome.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">NS</div>
        <div>
          <div class="brand-title">NeuroStep</div>
          <div class="brand-subtitle">${subtitle}</div>
        </div>
      </div>

      <nav class="nav" aria-label="Glavna navigacija">
        <a class="nav-link" href="./index.html">Home</a>
        <a class="nav-link" href="./scenario-selection.html">Scenarij</a>
        <a class="nav-link" href="./experiment-settings.html">Postavke</a>
        <a class="nav-link" href="./experiment.html">Pokus</a>
        <a class="nav-link" href="./result.html">Rezultat</a>
        <a class="nav-link" href="./demo.html">Demo</a>
      </nav>

      <div class="chrome-meta">
        <span class="crumb">${title}</span>
        <span class="status-chip">${status}</span>
      </div>
    </header>
  `;

  const current = (document.body.dataset.page || '').toLowerCase();
  qsa('.nav-link', chrome).forEach((link) => {
    const href = link.getAttribute('href');
    if ((current === 'home' && href.includes('index')) ||
        (current === 'scenario-selection' && href.includes('scenario-selection')) ||
        (current === 'experiment-settings' && href.includes('experiment-settings')) ||
        (current === 'experiment' && href.includes('experiment.html')) ||
        (current === 'result' && href.includes('result.html')) ||
        (current === 'error' && href.includes('error.html')) ||
        (current === 'demo' && href.includes('demo.html'))) {
      link.classList.add('is-active');
    }
  });
}

export function navigate(url) {
  window.location.href = url;
}
