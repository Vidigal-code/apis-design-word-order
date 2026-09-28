import { Sentence } from './sentence.js';
import { element } from '../shared/dom.js';
import { narrator } from '../audio/narrator.js';
import { soundEffects } from '../audio/sound-effects.js';
import { QuestionScene } from './question-scene.js';
import { PieceBoard } from './piece-board.js';
import { HintView } from './hint-view.js';
import { FeedbackView } from './feedback-view.js';

/** @typedef {import('../content/activities.js').ActivitySentenceConfig} SentenceConfig */
/** @typedef {import('../i18n/index.js').Messages} Messages */
/** @typedef {{config:SentenceConfig, label:string, activityNumber:string, messages:Messages, onChange:()=>void}} SentenceViewOptions */

export class SentenceView {
  root = element('fieldset', 'sentence');
  #legend = element('legend', 'sentence-legend sr-only');
  #reorderHint = element('p', 'reorder-hint');
  /** @type {SentenceViewOptions} */
  #options;
  /** @type {Sentence} */
  #sentence;
  /** @type {QuestionScene} */
  #scene;
  /** @type {PieceBoard} */
  #board;
  /** @type {HintView} */
  #hint;
  /** @type {FeedbackView} */
  #feedback;

  /** @param {SentenceViewOptions} options */
  constructor(options) {
    this.#options = options;
    this.#sentence = new Sentence(options.config);
    this.#scene = new QuestionScene(options.config, options.messages);
    this.#hint = new HintView(options.config, options.messages);
    this.#feedback = new FeedbackView({ label: options.label, activityNumber: options.activityNumber });
    this.#board = new PieceBoard({
      sentence: this.#sentence, pieces: options.config.pieces, label: options.label, messages: options.messages,
      onChange: () => {
        this.#updateStatus();
        this.#options.onChange();
      },
      onAnnouncement: (text) => this.#feedback.announce(text, this.#options.messages),
    });
    this.root.append(this.#legend, this.#scene.root, ...this.#board.nodes, this.#hint.root, this.#feedback.root, this.#reorderHint);
    this.updateMessages(options.messages);
  }

  /** @returns {void} */
  focus() {
    this.#scene.focus();
  }

  /** @returns {boolean} */
  isCorrect() {
    return this.#sentence.snapshot().status === 'correct';
  }

  /** @returns {void} */
  check() {
    const status = this.#sentence.check();
    this.#board.render();
    this.#updateStatus();
    if (status === 'correct') void soundEffects.play('success');
  }

  /** @returns {void} */
  reset() {
    narrator.stop();
    this.#sentence.reset();
    this.#hint.close();
    this.#board.render();
    this.#updateStatus();
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#options.messages = messages;
    this.#legend.replaceChildren(
      element('span', 'item-letter', `${this.#options.label}. `), element('span', 'sr-only', messages.answerLabel),
    );
    this.#scene.updateMessages(messages);
    this.#hint.updateMessages(messages);
    this.#board.updateMessages(messages);
    this.#updateStatus();
  }

  #updateStatus() {
    const snapshot = this.#sentence.snapshot();
    this.#scene.updateStatus(snapshot.status);
    this.#feedback.update(snapshot.status, this.#options.messages);
    this.#reorderHint.textContent = snapshot.selected.length ? this.#options.messages.reorderHint : '';
  }
}
