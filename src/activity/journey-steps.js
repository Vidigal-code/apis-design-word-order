import { element, button } from '../shared/dom.js';
import { formatMessage } from '../i18n/format-message.js';

/** @typedef {import('../i18n/index.js').Messages} Messages */
/** @typedef {{currentIndex:number, correct:boolean[], messages:Messages}} JourneyStepState */

export class JourneySteps {
  root = element('div', 'journey-steps');
  /** @type {HTMLButtonElement[]} */
  #buttons = [];

  /** @param {number} total @param {(index:number)=>void} onSelect */
  constructor(total, onSelect) {
    for (let index = 0; index < total; index += 1) {
      const step = button({ text: String(index + 1), className: 'journey-step', action: () => onSelect(index) });
      this.#buttons.push(step);
      this.root.append(step);
    }
  }

  /** @param {JourneyStepState} state @returns {void} */
  update({ currentIndex, correct, messages }) {
    this.#buttons.forEach((step, index) => {
      step.setAttribute('aria-label', formatMessage(messages.questionStep, { current: index + 1, total: this.#buttons.length }));
      if (index === currentIndex) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
      step.dataset.status = correct[index] ? 'correct' : 'idle';
      if (correct[index]) step.setAttribute('aria-description', messages.correct);
      else step.removeAttribute('aria-description');
    });
  }
}
