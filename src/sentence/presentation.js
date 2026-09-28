import { element } from '../shared/dom.js';
import { DEFAULT_SCENE } from '../scenes/scene-view.js';

export const SENTENCE_LANGUAGE = 'en';
export const DEFAULT_PRESENTATION = /** @type {const} */ ({
  scene: DEFAULT_SCENE,
  promptKey: 'questionInstruction',
  hintKey: 'tipTwo',
});

export const MOVE_CONTROLS = /** @type {const} */ ({
  previous: { labelKey: 'movePrevious', symbol: '←' },
  next: { labelKey: 'moveNext', symbol: '→' },
});

/** @param {string} text @returns {HTMLSpanElement} */
export function sentenceText(text) {
  const span = element('span', '', text);
  span.lang = SENTENCE_LANGUAGE;
  return span;
}
