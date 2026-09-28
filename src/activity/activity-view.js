import { SentenceView } from '../sentence/sentence-view.js';
import { element, button } from '../shared/dom.js';
import { formatMessage } from '../i18n/format-message.js';
import { CompletionView } from './completion-view.js';
import { JourneySteps } from './journey-steps.js';
import { narrator } from '../audio/narrator.js';
import { soundEffects } from '../audio/sound-effects.js';

/** @typedef {import('../content/activities.js').ActivityConfig} ActivityConfig */
/** @typedef {import('../i18n/index.js').Messages} Messages */

const ITEM_LABELS = 'abcdefghijklmnopqrstuvwxyz';

export class ActivityView {
  static #instanceCount = 0;
  root = element('section', 'activity-card');
  #title = element('h2', 'activity-title');
  #description = element('p', 'activity-description');
  #progress = element('output', 'activity-progress');
  #announcement = element('p', 'sr-only');
  #items = element('div', 'items');
  /** @type {JourneySteps} */
  #steps;
  #questionPosition = element('p', 'question-position');
  #actions = element('div', 'activity-actions');
  #completion = new CompletionView({ onReview: () => this.#showQuestion(0), onReplay: () => this.#replayJourney() });
  /** @type {'question' | 'completion'} */
  #screen = 'question';
  #currentIndex = 0;
  #check = button({ text: '', className: 'check-button', action: () => this.#activatePrimaryAction() });
  #reset = button({ text: '', className: 'reset-button', action: () => this.#resetCurrent() });
  /** @type {SentenceView[]} */
  #sentences = [];
  /** @type {HTMLParagraphElement[]} */
  #loadErrors = [];
  /** @type {ActivityConfig} */
  #config;
  /** @type {Messages} */
  #messages;

  /** @param {ActivityConfig} config @param {Messages} messages */
  constructor(config, messages) {
    this.#config = config;
    this.#messages = messages;
    ActivityView.#instanceCount += 1;
    this.#title.id = `activity-heading-${ActivityView.#instanceCount}`;
    this.root.setAttribute('aria-labelledby', this.#title.id);
    this.#createSentences();
    this.#steps = new JourneySteps(this.#sentences.length, (index) => this.#showQuestion(index));
    this.#sentences.forEach((sentence, index) => { sentence.root.hidden = index !== this.#currentIndex; });
    this.#mount();
    this.updateMessages(messages);
  }

  #mount() {
    const heading = element('header', 'activity-heading');
    const headingText = element('div', '');
    headingText.append(this.#title, this.#description);
    heading.append(headingText, this.#progress);
    this.#actions.append(this.#check, this.#reset);
    this.#announcement.setAttribute('role', 'status');
    this.#announcement.setAttribute('aria-atomic', 'true');
    this.root.append(heading, this.#steps.root, this.#questionPosition, this.#items, this.#actions, this.#completion.root, this.#announcement);
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#messages = messages;
    this.#title.textContent = messages[this.#config.titleKey];
    this.#description.textContent = messages[this.#config.descriptionKey];
    this.#check.textContent = messages.check;
    this.#reset.textContent = messages.reset;
    this.#completion.updateMessages(messages);
    this.#announcement.textContent = '';
    for (const sentence of this.#sentences) sentence.updateMessages(messages);
    for (const error of this.#loadErrors) error.textContent = messages.loadError;
    this.#updateProgress();
  }

  #createSentences() {
    if (!Array.isArray(this.#config.items) || this.#config.items.length === 0) {
      this.#appendLoadError();
      return;
    }
    Array.from(this.#config.items).forEach((config, index) => {
      try {
        const sentence = new SentenceView({
          config,
          activityNumber: this.#config.number,
          label: ITEM_LABELS[index] ?? String(index + 1),
          messages: this.#messages,
          onChange: () => this.#updateProgress(),
        });
        this.#sentences.push(sentence);
        this.#items.append(sentence.root);
      } catch {
        this.#appendLoadError();
      }
    });
  }

  #appendLoadError() {
    const error = element('p', 'load-error', this.#messages.loadError);
    this.#loadErrors.push(error);
    this.#items.append(error);
  }

  /** @param {number} index */
  #showQuestion(index) {
    const current = this.#sentences[index];
    if (!current) return;
    narrator.stop();
    this.#currentIndex = index;
    this.#screen = 'question';
    this.#announcement.textContent = '';
    for (const sentence of this.#sentences) sentence.root.hidden = sentence !== current;
    this.#updateProgress();
    current.focus();
  }

  #activatePrimaryAction() {
    const current = this.#sentences[this.#currentIndex];
    if (!current) return;
    if (current.isCorrect()) {
      this.#advance();
      return;
    }
    current.check();
    this.#updateProgress();
  }

  #advance() {
    if (this.#isComplete()) {
      this.#showCompletion();
      return;
    }
    const following = this.#currentIndex + 1;
    const next = following < this.#sentences.length
      ? following : this.#sentences.findIndex((sentence) => !sentence.isCorrect());
    this.#showQuestion(next);
  }

  #showCompletion() {
    narrator.stop();
    this.#screen = 'completion';
    this.#updateProgress();
    this.#completion.focus();
    void soundEffects.play('complete');
  }

  /** @returns {boolean} */
  #isComplete() {
    return this.#sentences.length > 0 && this.#sentences.every((sentence) => sentence.isCorrect());
  }

  /** @returns {string} */
  #primaryActionLabel() {
    if (!this.#sentences[this.#currentIndex]?.isCorrect()) return this.#messages.check;
    return this.#isComplete() ? this.#messages.finish : this.#messages.nextQuestion;
  }

  #resetCurrent() {
    this.#sentences[this.#currentIndex]?.reset();
    this.#updateProgress();
    this.#announcement.textContent = formatMessage(this.#messages.resetAnnouncement, {
      current: this.#currentIndex + 1, total: this.#sentences.length,
    });
  }

  #replayJourney() {
    for (const sentence of this.#sentences) sentence.reset();
    this.#showQuestion(0);
  }

  #updateProgress() {
    this.#updateCounter();
    this.#updateActions();
    this.#updateScreen();
    this.#updateSteps();
  }

  #updateActions() {
    for (const control of [this.#check, this.#reset]) {
      control.disabled = this.#sentences.length === 0;
    }
    this.#check.textContent = this.#primaryActionLabel();
  }

  #updateCounter() {
    const progress = formatMessage(this.#messages.completed, {
      count: this.#sentences.filter((sentence) => sentence.isCorrect()).length,
      total: this.#sentences.length,
    });
    if (this.#progress.textContent !== progress) this.#progress.textContent = progress;
    this.#progress.setAttribute('aria-label', this.#messages.progressLabel);
  }

  #updateScreen() {
    const completion = this.#screen === 'completion';
    this.#completion.root.hidden = !completion;
    this.#items.hidden = completion;
    this.#actions.hidden = completion;
    this.#questionPosition.hidden = completion || this.#sentences.length === 0;
    this.#questionPosition.textContent = this.#sentences.length > 0
      ? formatMessage(this.#messages.questionPosition, { current: this.#currentIndex + 1, total: this.#sentences.length })
      : '';
  }

  #updateSteps() {
    this.#steps.update({
      currentIndex: this.#screen === 'question' ? this.#currentIndex : -1,
      correct: this.#sentences.map((sentence) => sentence.isCorrect()),
      messages: this.#messages,
    });
  }
}
