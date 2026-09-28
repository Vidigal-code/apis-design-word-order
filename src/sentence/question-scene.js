import { element } from '../shared/dom.js';
import { createScene } from '../scenes/scene-view.js';
import { NarrationControl } from '../audio/narration-control.js';
import { DEFAULT_PRESENTATION, SENTENCE_LANGUAGE } from './presentation.js';

/** @typedef {import('../content/activities.js').ActivitySentenceConfig} SentenceConfig */
/** @typedef {import('../i18n/index.js').Messages} Messages */

export class QuestionScene {
  root = element('div', 'question-scene');
  #prompt = element('h3', 'question-prompt');
  #instruction = element('p', 'question-instruction');
  /** @type {SentenceConfig} */
  #config;
  /** @type {NarrationControl} */
  #audio;

  /** @param {SentenceConfig} config @param {Messages} messages */
  constructor(config, messages) {
    this.#config = config;
    const textById = new Map(config.pieces.map((piece) => [piece.id, piece.text]));
    const text = config.solution.map((id) => textById.get(id)).join(' ');
    this.#audio = new NarrationControl({
      messages, labelKey: 'listenSentence', getSegments: () => [{ text, lang: SENTENCE_LANGUAGE }],
    });
    this.#prompt.tabIndex = -1;
    const copy = element('div', 'scene-copy');
    copy.append(this.#prompt, this.#instruction, this.#audio.root);
    this.root.append(createScene(config.scene ?? DEFAULT_PRESENTATION.scene), copy);
    this.updateMessages(messages);
  }

  /** @returns {void} */
  focus() {
    this.#prompt.focus();
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#prompt.textContent = messages[this.#config.promptKey ?? DEFAULT_PRESENTATION.promptKey];
    this.#instruction.textContent = messages.instructions;
    this.#audio.updateMessages(messages);
  }

  /** @param {import('./sentence.js').AnswerStatus} status @returns {void} */
  updateStatus(status) {
    this.root.dataset.celebrate = status === 'correct' ? status : '';
  }
}
