// David 1: experiment control flow, start/pause/reset/manual completion (T2, T7, T15).
// This module keeps the experiment on screen until the user explicitly chooses to continue.

import { loadState, saveState, navigate, clamp } from './shared.js';
import { buildExperimentRun, updateChartAndAgent } from './visuals.js';

let intervalId = null;

export function initExperimentControls({ root, canvas, chartContainer, ui }) {
  let state = loadState();
  const run = state.series.length ? { series: state.series, metrics: state.metrics, summary: state.runSummary } : buildExperimentRun(state);
  const series = run.series;
  const totalFrames = series.length;
  const speedFactor = state.demoSpeed === 'fast' ? 0.55 : state.demoSpeed === 'slow' ? 1.35 : 0.9;

  let currentFrame = clamp(0, totalFrames - 1, state.progressFrame || 0);
  let running = Boolean(state.running);
  let paused = Boolean(state.paused);
  let completed = Boolean(state.completed);

  function syncState(patch = {}) {
    state = saveState({
      ...state,
      series,
      metrics: run.metrics,
      runSummary: run.summary,
      progressFramesTotal: totalFrames,
      progressFrame: currentFrame,
      running,
      paused,
      completed,
      statusMessage: patch.statusMessage || state.statusMessage,
      recommendation: patch.recommendation || state.recommendation,
      ...patch,
    });
    return state;
  }

  function currentCheckpoint(frameIndex) {
    const point = series[Math.min(frameIndex, series.length - 1)] || series[0];
    const p = series.length > 1 ? frameIndex / (series.length - 1) : 1;
    if (p < 0.18) return 'Početak: agent još istražuje';
    if (p < 0.48) return 'Sredina: agent povezuje akcije s nagradom';
    if (p < 0.8) return 'Kasniji dio: krivulja postaje stabilnija';
    return 'Završetak: rezultat je spreman za usporedbu';
  }

  function render() {
    const point = series[Math.min(currentFrame, series.length - 1)] || series[0];
    const progressPct = totalFrames > 1 ? Math.round((currentFrame / (totalFrames - 1)) * 100) : 100;
    ui.progressFill.style.width = `${progressPct}%`;
    ui.progressLabel.textContent = `${point?.episode ?? 0} / ${state.episodes} epizoda`;
    ui.statusBadge.textContent = completed ? 'Završeno' : running && !paused ? 'U tijeku' : paused ? 'Pauzirano' : 'Spremno';
    ui.statusBadge.className = `status-chip tone-${completed ? 'success' : running && !paused ? 'warning' : paused ? 'info' : 'ready'}`;
    ui.checkpoint.textContent = currentCheckpoint(currentFrame);
    ui.rewardNow.textContent = `${point?.reward ?? 0}`;
    ui.stabilityNow.textContent = `${point?.stability ?? 0}%`;
    ui.finishButton.disabled = !completed;
    ui.finishButton.setAttribute('aria-disabled', String(!completed));
    ui.startButton.textContent = completed ? 'Ponovi pokus' : running && !paused ? 'Pauziraj' : 'Pokreni pokus';
    ui.startButton.disabled = false;
    ui.resetButton.disabled = false;
    ui.explainButton.disabled = false;
    ui.manualTip.textContent = completed
      ? 'Eksperiment je završen, ali rezultat otvaraš ručno.'
      : 'Pritisni pokreni i prati graf, agenta i status.';
    updateChartAndAgent({
      chartContainer,
      canvas,
      series,
      frameIndex: currentFrame,
      stable: (point?.stability ?? 60) / 100,
      speed: speedFactor,
      wide: false,
    });
  }

  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function tick() {
    currentFrame = Math.min(totalFrames - 1, currentFrame + 1);
    if (currentFrame >= totalFrames - 1) {
      completed = true;
      running = false;
      paused = false;
      stopTimer();
      syncState({
        running,
        paused,
        completed,
        progressFrame: currentFrame,
        statusMessage: 'Pokus je završen. Rezultat ostaje na istom ekranu dok korisnik ne klikne završni gumb.',
        recommendation: buildRecommendation(run.metrics),
      });
      render();
      return;
    }

    syncState({
      progressFrame: currentFrame,
      running,
      paused,
      completed,
      statusMessage: currentCheckpoint(currentFrame),
    });
    render();
  }

  function start() {
    if (completed) {
      currentFrame = 0;
      completed = false;
    }

    paused = false;
    running = true;
    syncState({
      running,
      paused,
      completed,
      statusMessage: 'Pokus je pokrenut. Uči se kroz epizode.',
    });
    render();
    stopTimer();
    intervalId = setInterval(tick, Math.round(650 * speedFactor));
  }

  function pause() {
    running = false;
    paused = true;
    syncState({
      running,
      paused,
      statusMessage: 'Pokus je pauziran na trenutnoj epizodi.',
    });
    stopTimer();
    render();
  }

  function reset() {
    stopTimer();
    navigate('settings');
  }

  function finish() {
    stopTimer();
    navigate('result');
  }

  ui.startButton.addEventListener('click', () => {
    if (running && !paused) {
      pause();
    } else {
      start();
    }
  });

  ui.pauseButton.addEventListener('click', () => pause());
  ui.resetButton.addEventListener('click', () => reset());
  ui.finishButton.addEventListener('click', () => finish());

  window.addEventListener('beforeunload', stopTimer);
  render();

  if (state.completed) {
    completed = true;
    currentFrame = totalFrames - 1;
    render();
  }

  if (state.running && !state.completed && !state.paused) {
    start();
  }

  return {
    start,
    pause,
    reset,
    finish,
    stop: stopTimer,
    render,
  };
}

function buildRecommendation(metrics) {
  if (!metrics) return 'Pokušaj s nešto višim brojem epizoda radi stabilnijeg učenja.';
  if (metrics.stability > 80 && metrics.successRate > 75) {
    return 'Ovaj pokus izgleda uravnoteženo. Probaj isti learning rate, ali još 20–40 epizoda za lakšu konvergenciju.';
  }
  if (metrics.averageReward < 40) {
    return 'Rezultat je slabiji. Smanji learning rate ili produži broj epizoda.';
  }
  return 'Pokušaj lagano prilagoditi learning rate i usporedi graf s novim pokusom.';
}
