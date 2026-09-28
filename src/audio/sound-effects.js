import { scheduleEffect } from './tone-envelope.js';

/** @typedef {import('./tone-envelope.js').SoundKind} SoundKind */
/** @typedef {import('./tone-envelope.js').Voice} Voice */
/** @typedef {{createContext?: () => AudioContext | null}} SoundOptions */

/** @returns {AudioContext | null} */
function createBrowserContext() {
  return typeof globalThis.AudioContext === 'function' ? new AudioContext() : null;
}

export class SoundEffects {
  #enabled = true;
  /** @type {() => AudioContext | null} */
  #createContext;
  /** @type {AudioContext | null} */
  #context = null;
  /** @type {Voice | null} */
  #active = null;
  #request = 0;

  /** @param {SoundOptions} [options] */
  constructor(options = {}) {
    this.#createContext = options.createContext ?? createBrowserContext;
  }

  /** @returns {boolean} */
  isEnabled() {
    return this.#enabled;
  }

  /** @returns {void} */
  toggle() {
    this.#enabled = !this.#enabled;
    if (!this.#enabled) this.stop();
  }

  /** @param {SoundKind} kind @returns {Promise<void>} */
  async play(kind) {
    if (!this.#enabled) return;
    this.stop();
    const request = this.#request;
    try {
      const context = this.#context ??= this.#createContext();
      if (!context) return;
      if (context.state === 'suspended' || context.state === 'interrupted') await context.resume();
      if (!this.#enabled || request !== this.#request) return;
      if (context.state === 'running') this.#playEffect(context, kind);
    } catch {
      if (request === this.#request) this.stop();
    }
  }

  /** @returns {void} */
  stop() {
    this.#request += 1;
    const voice = this.#active;
    this.#active = null;
    if (!voice) return;
    try {
      voice.oscillator.stop();
    } catch {
      // A desconexão também silencia um oscilador que não conseguiu iniciar.
    }
    this.#release(voice);
  }

  /** @param {Voice} voice */
  #release(voice) {
    voice.oscillator.onended = null;
    voice.oscillator.disconnect();
    voice.volume.disconnect();
  }

  /** @param {AudioContext} context @param {SoundKind} kind */
  #playEffect(context, kind) {
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const voice = { oscillator, volume };
    this.#active = voice;
    oscillator.onended = () => {
      if (this.#active === voice) this.#active = null;
      this.#release(voice);
    };
    scheduleEffect(context, voice, kind);
  }
}

export const soundEffects = new SoundEffects();
