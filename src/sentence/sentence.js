import { validateConfig } from './validate-config.js';

/**
 * @typedef {import('./validate-config.js').Piece} Piece
 * @typedef {import('./validate-config.js').SentenceConfig} SentenceConfig
 * @typedef {'idle' | 'correct' | 'incorrect' | 'incomplete'} AnswerStatus
 * @typedef {AnswerStatus} SentenceStatus
 * @typedef {{ selected: string[], available: string[], status: AnswerStatus }} SentenceSnapshot
 */

const DIRECTION_OFFSET = Object.freeze({ previous: -1, next: 1 });

export class Sentence {
  /** @type {Piece[]} */
  #pieces;

  /** @type {string[]} */
  #solution;

  /** @type {string[]} */
  #selected = [];

  /** @type {AnswerStatus} */
  #status = 'idle';

  /** @param {SentenceConfig} config */
  constructor(config) {
    validateConfig(config);
    this.#pieces = config.pieces.map((piece) => ({ ...piece }));
    this.#solution = [...config.solution];
  }

  /** @param {string} pieceId @returns {void} */
  add(pieceId) {
    const exists = this.#pieces.some((piece) => piece.id === pieceId);
    if (!exists || this.#selected.includes(pieceId)) return;
    this.#selected.push(pieceId);
    this.#status = 'idle';
  }

  /** @param {string} pieceId @returns {void} */
  remove(pieceId) {
    if (!this.#selected.includes(pieceId)) return;
    this.#selected = this.#selected.filter((id) => id !== pieceId);
    this.#status = 'idle';
  }

  /**
   * @param {string} pieceId
   * @param {'previous' | 'next'} direction
   * @returns {void}
   */
  move(pieceId, direction) {
    if (direction !== 'previous' && direction !== 'next') return;
    const current = this.#selected.indexOf(pieceId);
    if (current < 0) return;
    const target = current + DIRECTION_OFFSET[direction];
    if (target < 0 || target >= this.#selected.length) return;
    const neighbor = this.#selected[target];
    this.#selected[current] = neighbor;
    this.#selected[target] = pieceId;
    this.#status = 'idle';
  }

  /** @returns {AnswerStatus} */
  check() {
    if (this.#selected.length !== this.#solution.length) {
      this.#status = 'incomplete';
      return this.#status;
    }
    const textById = new Map(this.#pieces.map((piece) => [piece.id, piece.text]));
    const expected = this.#solution.map((id) => textById.get(id));
    const matches = this.#selected.every((id, index) => textById.get(id) === expected[index]);
    this.#status = matches ? 'correct' : 'incorrect';
    return this.#status;
  }

  /** @returns {void} */
  reset() {
    this.#selected = [];
    this.#status = 'idle';
  }

  /** @returns {SentenceSnapshot} */
  snapshot() {
    return {
      selected: [...this.#selected],
      available: this.#pieces
        .filter((piece) => !this.#selected.includes(piece.id))
        .map((piece) => piece.id),
      status: this.#status,
    };
  }
}
