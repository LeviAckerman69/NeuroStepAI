// Luka: parameter form and validation rules (T6, T8, T14).

import { explainRange } from './content.js';

export function parseExperimentValues(formData) {
  const learningRate = Number(String(formData.get('learningRate') || '').replace(',', '.'));
  const episodes = Number(formData.get('episodes'));
  const demoSpeed = String(formData.get('demoSpeed') || 'normal');
  const aiDepth = String(formData.get('aiDepth') || 'detailed');

  return { learningRate, episodes, demoSpeed, aiDepth };
}

export function validateExperimentValues(values) {
  const errors = [];

  if (!Number.isFinite(values.learningRate)) {
    errors.push({
      field: 'learningRate',
      title: 'Learning rate nije valjana brojčana vrijednost.',
      message: 'Unesi broj, primjerice 0.001.',
      help: explainRange('learningRate'),
    });
  } else if (values.learningRate < 0.0001 || values.learningRate > 0.1) {
    errors.push({
      field: 'learningRate',
      title: 'Learning rate je izvan dopuštenog raspona.',
      message: 'Vrijednost mora biti između 0.0001 i 0.1.',
      help: explainRange('learningRate'),
    });
  }

  if (!Number.isFinite(values.episodes) || !Number.isInteger(values.episodes)) {
    errors.push({
      field: 'episodes',
      title: 'Broj epizoda mora biti cijeli broj.',
      message: 'Unesi cijeli broj, primjerice 120.',
      help: explainRange('episodes'),
    });
  } else if (values.episodes < 10 || values.episodes > 1000) {
    errors.push({
      field: 'episodes',
      title: 'Broj epizoda je izvan dopuštenog raspona.',
      message: 'Vrijednost mora biti između 10 i 1000.',
      help: explainRange('episodes'),
    });
  }

  return errors;
}

export function formatValidationSummary(errors) {
  if (!errors.length) return 'Sve je u redu.';
  if (errors.length === 1) return errors[0].help;
  return `Provjeri obje vrijednosti: ${errors.map((error) => error.field).join(', ')}.`;
}
