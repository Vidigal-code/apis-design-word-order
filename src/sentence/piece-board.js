import { element, button } from '../shared/dom.js';
import { formatMessage } from '../i18n/format-message.js';
import { MOVE_CONTROLS, sentenceText } from './presentation.js';

/** @typedef {import('./sentence.js').Piece} Piece */
/** @typedef {import('../i18n/index.js').Messages} Messages */
/** @typedef {'previous' | 'next'} Direction */
/**
 * @typedef {object} PieceBoardOptions
 * @property {import('./sentence.js').Sentence} sentence
 * @property {Piece[]} pieces
 * @property {string} label
 * @property {Messages} messages
 * @property {()=>void} onChange
 * @property {(text:string)=>void} onAnnouncement
 */

export class PieceBoard {
  #answerHeading = element('div', 'answer-heading');
  #bankHeading = element('div', 'bank-heading');
  #answerLabel = element('p', 'answer-label');
  #bankLabel = element('p', 'bank-label');
  #progress = element('span', 'pieces-progress');
  #answer = element('div', 'answer-zone');
  #bank = element('div', 'word-bank');
  nodes = [this.#answerHeading, this.#answer, this.#bankHeading, this.#bank];
  /** @type {Map<string, HTMLButtonElement>} */
  #availableButtons = new Map();
  /** @type {Map<string, HTMLButtonElement>} */
  #selectedButtons = new Map();
  /** @type {PieceBoardOptions} */
  #options;

  /** @param {PieceBoardOptions} options */
  constructor(options) {
    this.#options = options;
    this.#answer.setAttribute('role', 'group');
    this.#bank.setAttribute('role', 'group');
    this.#answerHeading.append(this.#answerLabel, this.#progress);
    this.#bankHeading.append(this.#bankLabel);
  }

  /** @param {Messages} messages @returns {void} */
  updateMessages(messages) {
    this.#options.messages = messages;
    this.render();
  }

  /** @returns {void} */
  render() {
    const { sentence, pieces, messages, label } = this.#options;
    const snapshot = sentence.snapshot();
    this.#answerLabel.textContent = messages.answerStep;
    this.#bankLabel.textContent = messages.bankStep;
    this.#progress.textContent = formatMessage(messages.piecesProgress, { count: snapshot.selected.length, total: pieces.length });
    this.#answer.setAttribute('aria-label', `${messages.answerLabel} ${label}`);
    this.#bank.setAttribute('aria-label', `${messages.piecesLabel} ${label}`);
    this.#answer.dataset.status = snapshot.status;
    this.#availableButtons.clear();
    this.#selectedButtons.clear();
    this.#answer.replaceChildren();
    this.#bank.replaceChildren();
    for (const id of snapshot.selected) {
      const piece = pieces.find((candidate) => candidate.id === id);
      if (piece) this.#answer.append(this.#selectedPiece(piece, snapshot.selected));
    }
    if (snapshot.selected.length === 0) this.#answer.append(element('span', 'answer-placeholder', messages.answerPlaceholder));
    this.#appendSlots(snapshot.selected.length);
    for (const piece of pieces) this.#bank.append(this.#availablePiece(piece));
  }

  /** @param {number} selected */
  #appendSlots(selected) {
    const remaining = this.#options.pieces.length - selected;
    if (remaining === 0) return;
    const slots = element('div', 'answer-slots');
    slots.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < remaining; index += 1) {
      slots.append(element('span', 'answer-slot', String(selected + index + 1)));
    }
    this.#answer.append(slots);
  }

  /** @param {Piece} piece @returns {HTMLButtonElement} */
  #availablePiece(piece) {
    const control = button({
      text: '', label: `${this.#options.messages.addPiece} ${piece.text}`, className: 'word-piece',
      action: () => this.#commit(
        () => this.#options.sentence.add(piece.id), () => this.#selectedButtons.get(piece.id),
      ),
    });
    control.append(sentenceText(piece.text));
    control.disabled = this.#options.sentence.snapshot().selected.includes(piece.id);
    this.#availableButtons.set(piece.id, control);
    return control;
  }

  /** @param {Piece} piece @param {string[]} selected @returns {HTMLDivElement} */
  #selectedPiece(piece, selected) {
    const wrapper = element('div', 'selected-piece');
    const remove = button({
      text: '', label: `${this.#options.messages.removePiece} ${piece.text}`, className: 'remove-piece',
      action: () => this.#commit(
        () => this.#options.sentence.remove(piece.id), () => this.#availableButtons.get(piece.id),
      ),
    });
    const cross = element('span', 'x-icon', '×');
    cross.setAttribute('aria-hidden', 'true');
    remove.append(sentenceText(piece.text), cross);
    this.#selectedButtons.set(piece.id, remove);
    const controls = element('span', 'piece-controls');
    const previous = this.#moveButton(piece, 'previous');
    const next = this.#moveButton(piece, 'next');
    previous.disabled = selected[0] === piece.id;
    next.disabled = selected.at(-1) === piece.id;
    controls.append(previous, next);
    wrapper.append(remove, controls);
    return wrapper;
  }

  /** @param {Piece} piece @param {Direction} direction @returns {HTMLButtonElement} */
  #moveButton(piece, direction) {
    const { labelKey, symbol } = MOVE_CONTROLS[direction];
    return button({
      text: symbol, label: `${this.#options.messages[labelKey]} ${piece.text}`, className: 'move-piece',
      action: () => {
        this.#commit(() => this.#options.sentence.move(piece.id, direction), () => this.#selectedButtons.get(piece.id));
        const selected = this.#options.sentence.snapshot().selected;
        this.#options.onAnnouncement(formatMessage(this.#options.messages.moveAnnouncement, {
          piece: piece.text, position: selected.indexOf(piece.id) + 1, total: selected.length,
        }));
      },
    });
  }

  /** @param {()=>void} change @param {()=>HTMLElement|undefined} focusTarget */
  #commit(change, focusTarget) {
    change();
    this.render();
    focusTarget()?.focus();
    this.#options.onChange();
  }
}
