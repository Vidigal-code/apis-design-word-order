import { button, element } from '../shared/dom.js';
import { narrator } from './narrator.js';

/** @typedef {import('../i18n/index.js').Messages} Messages */
/** @typedef {import('./narrator.js').SpeechSegment} SpeechSegment */
/** @typedef {import('./narrator.js').NarrationState} NarrationState */
/** @typedef {'listenHint' | 'listenSentence'} NarrationLabel */
/** @typedef {{messages:Messages, labelKey:NarrationLabel, getSegments:()=>SpeechSegment[]}} NarrationControlOptions */

export class NarrationControl {
  root = element('div', 'narration-control');
  #button = button({ text: '', className: 'narration-button', action: () => this.#toggle() });
  #status = element('p', 'narration-status');
  /** @type {Messages} */
  #messages;
  /** @type {NarrationLabel} */
  #labelKey;
  /** @type {()=>SpeechSegment[]} */
  #getSegments;
  /** @type {NarrationState} */
  #state;

  /** @param {NarrationControlOptions} options */
  constructor({ messages, labelKey, getSegments }) {
    this.#messages = messages;
    this.#labelKey = labelKey;
    this.#getSegments = getSegments;
    this.#state = narrator.isSupported() ? 'idle' : 'unavailable';
    this.#status.setAttribute('role', 'status');
    this.root.append(this.#button, this.#status);
    this.#render();
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#messages = messages;
    this.#render();
  }

  /** @returns {void} */
  stop() {
    if (this.#state === 'speaking') narrator.stop();
  }

  #toggle() {
    if (this.#state === 'speaking') {
      this.stop();
      return;
    }
    try {
      narrator.speak({ segments: this.#getSegments(), onStateChange: (state) => this.#setState(state) });
    } catch {
      this.#setState('error');
    }
  }

  /** @param {NarrationState} state */
  #setState(state) {
    this.#state = state;
    this.#render();
  }

  #render() {
    this.root.lang = document.documentElement.lang;
    this.#button.textContent = this.#state === 'speaking' ? this.#messages.stopSpeaking : this.#messages[this.#labelKey];
    this.#button.disabled = this.#state === 'unavailable';
    const status = this.#statusText();
    if (this.#status.textContent !== status) this.#status.textContent = status;
  }

  /** @returns {string} */
  #statusText() {
    if (this.#state === 'unavailable') return this.#messages.speechUnavailable;
    if (this.#state === 'error') return this.#messages.speechError;
    return '';
  }
}
