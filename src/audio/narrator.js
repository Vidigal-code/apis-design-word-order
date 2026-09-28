import { browserPlatform, chooseVoice } from './speech-platform.js';
import { validateSegments } from './speech-segments.js';

/** @typedef {import('./speech-segments.js').SpeechSegment} SpeechSegment */
/** @typedef {import('./speech-platform.js').SpeechUtterance} SpeechUtterance */
/** @typedef {import('./speech-platform.js').SpeechPlatform} SpeechPlatform */
/** @typedef {'speaking' | 'idle' | 'unavailable' | 'error'} NarrationState */
/** @typedef {{segments:SpeechSegment[], onStateChange:(state:NarrationState)=>void}} NarrationRequest */
/** @typedef {{getPlatform?:()=>SpeechPlatform|null}} NarratorOptions */
/** @typedef {{request:NarrationRequest, platform:SpeechPlatform, remaining:SpeechSegment[], utterance:SpeechUtterance|null}} ActiveNarration */

export class Narrator {
  /** @type {()=>SpeechPlatform|null} */
  #getPlatform;
  /** @type {ActiveNarration|null} */
  #active = null;
  /** @type {SpeechPlatform|null} */
  #pendingCancellation = null;

  /** @param {NarratorOptions} [options] */
  constructor({ getPlatform = browserPlatform } = {}) {
    this.#getPlatform = getPlatform;
  }

  /** @returns {boolean} */
  isSupported() {
    return this.#platform() !== null;
  }

  /** @param {NarrationRequest} request @returns {void} */
  speak(request) {
    if (!this.#cancelActive()) {
      request.onStateChange('error');
      return;
    }
    const remaining = validateSegments(request.segments);
    if (!remaining) {
      request.onStateChange('error');
      return;
    }
    const platform = this.#platform();
    if (!platform) {
      request.onStateChange('unavailable');
      return;
    }
    const active = { request, platform, remaining, utterance: null };
    this.#active = active;
    request.onStateChange('speaking');
    this.#speakNext(active);
  }

  /** @returns {void} */
  stop() {
    this.#cancelActive();
  }

  /** @returns {boolean} */
  #cancelActive() {
    const active = this.#active;
    this.#active = null;
    if (active) this.#pendingCancellation = active.platform;
    const platform = this.#pendingCancellation;
    if (!platform) return true;
    try {
      platform.cancel();
    } catch {
      active?.request.onStateChange('error');
      return false;
    }
    this.#pendingCancellation = null;
    active?.request.onStateChange('idle');
    return true;
  }

  /** @returns {SpeechPlatform|null} */
  #platform() {
    try {
      return this.#getPlatform();
    } catch {
      return null;
    }
  }

  /** @param {ActiveNarration} active */
  #speakNext(active) {
    if (this.#active !== active) return;
    const segment = active.remaining.shift();
    if (!segment) {
      this.#active = null;
      active.request.onStateChange('idle');
      return;
    }
    try {
      this.#speakSegment(active, segment);
    } catch {
      this.#fail(active);
    }
  }

  /** @param {ActiveNarration} active @param {SpeechSegment} segment */
  #speakSegment(active, segment) {
    const utterance = active.platform.createUtterance(segment.text);
    utterance.lang = segment.lang;
    utterance.voice = chooseVoice(active.platform.getVoices(), segment.lang);
    active.utterance = utterance;
    utterance.addEventListener('end', () => {
      if (active.utterance !== utterance) return;
      this.#speakNext(active);
    });
    utterance.addEventListener('error', () => {
      if (active.utterance === utterance) this.#fail(active);
    });
    active.platform.speak(utterance);
  }

  /** @param {ActiveNarration} active */
  #fail(active) {
    if (this.#active !== active) return;
    this.#active = null;
    active.request.onStateChange('error');
  }
}

export const narrator = new Narrator();
