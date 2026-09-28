import { element } from '../shared/dom.js';
import { formatMessage } from '../i18n/format-message.js';

/** @typedef {import('../i18n/index.js').Messages} Messages */
/** @typedef {{activityNumber:string, label:string}} FeedbackContext */

export class FeedbackView {
  root = element('p', 'feedback');
  /** @type {FeedbackContext} */
  #context;

  /** @param {FeedbackContext} context */
  constructor(context) {
    this.#context = context;
    this.root.setAttribute('role', 'status');
    this.root.setAttribute('aria-atomic', 'true');
  }

  /** @param {import('./sentence.js').AnswerStatus} status @param {Messages} messages @returns {void} */
  update(status, messages) {
    this.root.dataset.status = status;
    this.root.setAttribute('aria-label', messages.answerLabel);
    this.announce(status === 'idle' ? '' : messages[status], messages);
  }

  /** @param {string} message @param {Messages} messages @returns {void} */
  announce(message, messages) {
    if (!message) {
      this.root.replaceChildren();
      return;
    }
    const activity = formatMessage(messages.activityLabel, { activity: this.#context.activityNumber });
    this.root.replaceChildren(
      element('span', 'sr-only', `${activity}, ${this.#context.label}. `),
      element('span', '', message),
    );
  }
}
