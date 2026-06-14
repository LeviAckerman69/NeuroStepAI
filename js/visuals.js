// David 2: agent visualisation, reward graph and projector-friendly visuals (T3, T10, T16).

import { clamp, formatCompactNumber, formatPercent } from './shared.js';

const DEFAULT_COLOURS = {
  line: '#6ea8ff',
  lineSoft: 'rgba(110, 168, 255, 0.25)',
  accent: '#8b5cf6',
  axis: 'rgba(149, 170, 200, 0.32)',
  text: '#dce8ff',
  muted: '#8aa0c8',
  success: '#4ade80',
  warning: '#f59e0b',
  background: 'rgba(15, 23, 42, 0.0)',
};

function seededRandom(seed) {
  let t = seed + 0x6D2B79F5;
  return function random() {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildExperimentRun({ learningRate, episodes, demoSpeed = 'normal', aiDepth = 'detailed' }) {
  const frameCount = Math.min(36, Math.max(16, Math.round(episodes / 4)));
  const rng = seededRandom(Math.round(learningRate * 1e6) + episodes * 19);
  const lrDistance = Math.abs(Math.log10(learningRate) - Math.log10(0.001));
  const stabilityBase = clamp(46, 96, 88 - lrDistance * 11 + Math.min(8, episodes / 120));
  const qualityBase = clamp(38, 96, 70 + episodes / 25 - lrDistance * 18);

  const series = [];
  let current = 10 + rng() * 5;

  for (let i = 0; i < frameCount; i += 1) {
    const p = frameCount === 1 ? 1 : i / (frameCount - 1);
    const curve = 1 - Math.exp(-p * (2.4 + episodes / 350));
    const trend = 10 + qualityBase * curve;
    const wobble = (rng() - 0.5) * (12 + lrDistance * 10) * (1 - p * 0.35);
    current = clamp(5, 98, trend + wobble);
    series.push({
      frame: i,
      episode: Math.max(1, Math.round(p * episodes)),
      reward: Number(current.toFixed(1)),
      stability: Number(clamp(30, 99, stabilityBase + p * 6 - Math.abs(wobble) * 0.4).toFixed(0)),
    });
  }

  const averageReward = series.reduce((sum, point) => sum + point.reward, 0) / series.length;
  const successRate = clamp(42, 98, qualityBase + episodes / 60 - lrDistance * 4);
  const averageSteps = clamp(85, 320, 250 - averageReward * 1.55 + lrDistance * 20);
  const convergenceSpeed = clamp(8, 34, Math.round(frameCount * (0.55 - Math.min(0.18, lrDistance / 25))));
  const bestPoint = series.reduce((best, point) => (point.reward > best.reward ? point : best), series[0]);

  const explanationTone =
    learningRate < 0.0005
      ? 'vrlo stabilan, ali spor'
      : learningRate > 0.01
        ? 'brz, ali potencijalno nestabilan'
        : 'uravnotežen';

  return {
    series,
    metrics: {
      averageReward: Number(averageReward.toFixed(1)),
      successRate: Number(successRate.toFixed(0)),
      averageSteps: Math.round(averageSteps),
      stability: Number((stabilityBase + 3).toFixed(0)),
      convergenceSpeed,
      bestEpisode: bestPoint.episode,
      peakReward: bestPoint.reward,
      explanationTone,
    },
    summary: {
      learningRate,
      episodes,
      demoSpeed,
      aiDepth,
      totalFrames: frameCount,
    },
  };
}

export function renderRewardChart(container, series, { activeIndex = series.length - 1, wide = false } = {}) {
  if (!container) return;
  const width = wide ? 860 : 620;
  const height = wide ? 340 : 300;
  const padding = { top: 28, right: 22, bottom: 42, left: 48 };

  const points = series || [];
  const max = Math.max(100, ...points.map((p) => p.reward));
  const min = 0;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const xStep = points.length > 1 ? innerWidth / (points.length - 1) : innerWidth;
  const scaleY = (reward) => padding.top + innerHeight - ((reward - min) / (max - min)) * innerHeight;
  const scaleX = (index) => padding.left + index * xStep;

  const linePoints = points
    .map((point, index) => `${formatCompactNumber(scaleX(index), 2)},${formatCompactNumber(scaleY(point.reward), 2)}`)
    .join(' ');

  const areaPoints = `0,${padding.top + innerHeight} ${linePoints} ${width},${padding.top + innerHeight}`;
  const activePoint = points[Math.min(activeIndex, points.length - 1)] || points[0] || { reward: 0, episode: 0 };

  const xTicks = [];
  const tickCount = Math.min(6, Math.max(4, Math.round(points.length / 6)));
  for (let i = 0; i < tickCount; i += 1) {
    const index = Math.round((points.length - 1) * (i / Math.max(1, tickCount - 1)));
    const point = points[index] || points[points.length - 1] || { episode: 0, reward: 0 };
    xTicks.push({ x: scaleX(index), label: point.episode });
  }

  const yTicks = [0, 25, 50, 75, 100].map((value) => ({
    y: scaleY(value),
    label: value,
  }));

  container.innerHTML = `
    <div class="chart-card ${wide ? 'chart-wide' : ''}">
      <div class="chart-head">
        <div>
          <div class="eyebrow">Graf nagrade</div>
          <h3>Kako se nagrada mijenja kroz epizode</h3>
        </div>
        <div class="chart-summary">
          <span>Trenutno</span>
          <strong>${activePoint.reward ?? 0}</strong>
        </div>
      </div>

      <svg viewBox="0 0 ${width} ${height}" class="reward-chart" role="img" aria-label="Graf nagrade po epizodama">
        <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="rgba(9, 14, 27, 0.9)"></rect>

        ${yTicks
          .map(
            (tick) => `
              <line x1="${padding.left}" x2="${width - padding.right}" y1="${tick.y}" y2="${tick.y}" stroke="${DEFAULT_COLOURS.axis}" stroke-width="1" />
              <text x="14" y="${tick.y + 4}" class="chart-axis-label">${tick.label}</text>
            `,
          )
          .join('')}

        ${xTicks
          .map(
            (tick) => `
              <line x1="${tick.x}" x2="${tick.x}" y1="${padding.top}" y2="${height - padding.bottom}" stroke="${DEFAULT_COLOURS.axis}" stroke-width="1" stroke-dasharray="4 6" />
              <text x="${tick.x}" y="${height - 16}" text-anchor="middle" class="chart-axis-label">${tick.label}</text>
            `,
          )
          .join('')}

        <path d="M ${areaPoints}" fill="rgba(110, 168, 255, 0.08)"></path>
        <polyline points="${linePoints}" fill="none" stroke="${DEFAULT_COLOURS.line}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>

        ${
          activePoint
            ? `<circle cx="${scaleX(Math.min(activeIndex, points.length - 1))}" cy="${scaleY(activePoint.reward)}" r="7" fill="${DEFAULT_COLOURS.accent}" stroke="white" stroke-width="2"></circle>`
            : ''
        }
      </svg>

      <div class="chart-foot">
        <span>Stabilnost: ${formatPercent(activePoint.stability ?? 0)}</span>
        <span>Rezultat je polako rastao, a zatim se počeo stabilizirati.</span>
      </div>
    </div>
  `;
}

export function renderAgent(canvas, { progress = 0, stable = 0.5, speed = 1 } = {}) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 640;
  const height = canvas.clientHeight || 340;

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(13, 21, 40, 1)');
  gradient.addColorStop(1, 'rgba(7, 11, 20, 1)');
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, width, height, 24, true, false);

  // Ground
  const groundY = height * 0.75;
  ctx.strokeStyle = 'rgba(110, 168, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(24, groundY);
  ctx.lineTo(width - 24, groundY);
  ctx.stroke();

  ctx.fillStyle = 'rgba(110, 168, 255, 0.08)';
  for (let i = 0; i < 10; i += 1) {
    const gx = 40 + i * ((width - 80) / 9);
    ctx.fillRect(gx, groundY - 6, 2, 12);
  }

  // Track and trail
  const x = 70 + (width - 140) * clamp(0, 1, progress);
  const bob = Math.sin(progress * Math.PI * 4 * speed) * (6 + (1 - stable) * 10);
  const bodyY = groundY - 54 - bob;

  ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(70, groundY - 22);
  ctx.lineTo(x, groundY - 22);
  ctx.stroke();
  ctx.setLineDash([]);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath();
  ctx.ellipse(x + 1, groundY + 8, 20 + stable * 7, 6 + stable * 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Simple agent body
  const headRadius = 16;
  const bodyHeight = 34;
  const armSwing = Math.sin(progress * Math.PI * 8 * speed) * (0.45 + (1 - stable) * 0.3);
  const legSwing = Math.sin(progress * Math.PI * 8 * speed + Math.PI) * (0.55 + (1 - stable) * 0.3);

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#d8e8ff';
  // neck/body
  ctx.beginPath();
  ctx.moveTo(x, bodyY - 4);
  ctx.lineTo(x, bodyY + bodyHeight);
  ctx.stroke();

  // Head
  ctx.fillStyle = '#d8e8ff';
  ctx.beginPath();
  ctx.arc(x, bodyY - headRadius - 8, headRadius, 0, Math.PI * 2);
  ctx.fill();

  // Arms
  ctx.strokeStyle = '#7dd3fc';
  ctx.beginPath();
  ctx.moveTo(x, bodyY + 5);
  ctx.lineTo(x - 24, bodyY + 16 + armSwing * 12);
  ctx.moveTo(x, bodyY + 5);
  ctx.lineTo(x + 24, bodyY + 16 - armSwing * 12);
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#6ea8ff';
  ctx.beginPath();
  ctx.moveTo(x, bodyY + bodyHeight);
  ctx.lineTo(x - 16, groundY - 2 + legSwing * 16);
  ctx.moveTo(x, bodyY + bodyHeight);
  ctx.lineTo(x + 16, groundY - 2 - legSwing * 16);
  ctx.stroke();

  // Stability meter
  const meterX = width - 190;
  const meterY = 24;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  roundRect(ctx, meterX, meterY, 166, 88, 18, true, false);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '600 12px Inter, system-ui, sans-serif';
  ctx.fillText('Stabilnost agenta', meterX + 16, meterY + 24);
  ctx.font = '800 24px Inter, system-ui, sans-serif';
  ctx.fillText(`${Math.round(stable * 100)}%`, meterX + 16, meterY + 56);

  ctx.fillStyle = 'rgba(110, 168, 255, 0.22)';
  roundRect(ctx, meterX + 16, meterY + 64, 128, 8, 8, true, false);
  ctx.fillStyle = stable > 0.7 ? '#4ade80' : stable > 0.45 ? '#f59e0b' : '#ef4444';
  roundRect(ctx, meterX + 16, meterY + 64, 128 * stable, 8, 8, true, false);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

export function updateChartAndAgent({ chartContainer, canvas, series, frameIndex, speed = 1, stable = 0.5, wide = false }) {
  renderRewardChart(chartContainer, series, { activeIndex: frameIndex, wide });
  renderAgent(canvas, { progress: series.length > 1 ? frameIndex / (series.length - 1) : 0, stable, speed });
}
