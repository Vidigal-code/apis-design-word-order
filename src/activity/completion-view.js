import { element, button } from '../shared/dom.js';

/** @typedef {import('../i18n/index.js').Messages} Messages */

export class CompletionView {
  root = element('div', 'completion-panel');
  #title = element('h3', 'completion-title');
  #description = element('p', 'completion-description');
  /** @type {HTMLButtonElement} */
  #review;
  /** @type {HTMLButtonElement} */
  #replay;

  /** @param {{onReview:()=>void, onReplay:()=>void}} actions */
  constructor({ onReview, onReplay }) {
    this.#review = button({ text: '', className: 'check-button review-button', action: onReview });
    this.#replay = button({ text: '', className: 'reset-button replay-button', action: onReplay });
    this.#title.tabIndex = -1;
    this.root.append(this.#title, this.#description, this.#review, this.#replay);
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#title.textContent = messages.completionTitle;
    this.#description.textContent = messages.completionDescription;
    this.#review.textContent = messages.reviewAnswers;
    this.#replay.textContent = messages.replay;
  }

  /** @returns {void} */
  focus() {
    this.#title.focus();
  }
}
