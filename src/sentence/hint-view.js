import { element } from '../shared/dom.js';
import { NarrationControl } from '../audio/narration-control.js';
import { DEFAULT_PRESENTATION, sentenceText } from './presentation.js';

/** @typedef {import('../content/activities.js').ActivitySentenceConfig} SentenceConfig */
/** @typedef {import('../i18n/index.js').Messages} Messages */
/** @typedef {import('../audio/narrator.js').SpeechSegment} SpeechSegment */

export class HintView {
  root = element('details', 'contextual-hint');
  #toggle = element('summary', 'hint-toggle');
  #content = element('p', 'hint-content');
  /** @type {NarrationControl} */
  #audio;
  /** @type {SentenceConfig} */
  #config;

  /** @param {SentenceConfig} config @param {Messages} messages */
  constructor(config, messages) {
    this.#config = config;
    this.#audio = new NarrationControl({ messages, labelKey: 'listenHint', getSegments: () => this.#segments() });
    this.root.append(this.#toggle, this.#content, this.#audio.root);
    this.#toggle.addEventListener('click', () => {
      if (this.root.open) this.#audio.stop();
    });
    this.updateMessages(messages);
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#toggle.textContent = messages.hintToggle;
    this.#renderContent(messages[this.#config.hintKey ?? DEFAULT_PRESENTATION.hintKey]);
    this.#audio.updateMessages(messages);
  }

  /** @returns {void} */
  close() {
    this.#audio.stop();
    this.root.open = false;
  }

  /** @returns {SpeechSegment[]} */
  #segments() {
    return Array.from(this.#content.childNodes, (node) => ({
      text: node.textContent ?? '',
      lang: node instanceof HTMLElement && node.lang ? node.lang : document.documentElement.lang,
    })).filter((segment) => /[\p{L}\p{N}]/u.test(segment.text));
  }

  /** @param {string} message */
  #renderContent(message) {
    const piece = this.#config.pieces.find((candidate) => message.includes(`“${candidate.text}”`));
    if (!piece) {
      this.#content.textContent = message;
      return;
    }
    const position = message.indexOf(`“${piece.text}”`) + 1;
    this.#content.replaceChildren(
      document.createTextNode(message.slice(0, position)),
      sentenceText(piece.text),
      document.createTextNode(message.slice(position + piece.text.length)),
    );
  }
}
