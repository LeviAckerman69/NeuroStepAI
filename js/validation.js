export function validateSettings({ learningRate, episodes }) {
  const errors = [];
  const lr = Number(learningRate);
  const ep = Number(episodes);

  if (!Number.isFinite(lr) || lr < 0.0001 || lr > 0.1) {
    errors.push('Learning rate mora biti između 0.0001 i 0.1.');
  }
  if (!Number.isFinite(ep) || ep < 10 || ep > 1000) {
    errors.push('Broj epizoda mora biti između 10 i 1000.');
  }

  return { valid: errors.length === 0, errors };
}
