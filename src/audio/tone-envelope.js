/** @typedef {'tap' | 'success' | 'complete'} SoundKind */
/** @typedef {{waveform: 'sine' | 'triangle', notes: readonly number[], seconds: number, gain: number}} Effect */
/** @typedef {{oscillator: OscillatorNode, volume: GainNode}} Voice */

const NOTES = Object.freeze({ C5: 523.25, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5 });
const ATTACK_SECONDS = 0.008;
const DEFAULT_GAIN = 0.12;
/** @type {Record<SoundKind, Effect>} */
const EFFECTS = {
  tap: { waveform: 'sine', notes: [NOTES.A5], seconds: 0.09, gain: DEFAULT_GAIN },
  success: { waveform: 'sine', notes: [NOTES.C5, NOTES.E5, NOTES.G5], seconds: 0.1, gain: 0.14 },
  complete: { waveform: 'triangle', notes: [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6], seconds: 0.12, gain: DEFAULT_GAIN },
};

/** @param {AudioContext} context @param {Voice} voice @param {SoundKind} kind @returns {void} */
export function scheduleEffect(context, voice, kind) {
  const effect = EFFECTS[kind];
  const { oscillator, volume } = voice;
  oscillator.type = effect.waveform;
  oscillator.connect(volume);
  volume.connect(context.destination);
  effect.notes.forEach((frequency, index) => {
    const start = context.currentTime + index * effect.seconds;
    oscillator.frequency.setValueAtTime(frequency, start);
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(effect.gain, start + ATTACK_SECONDS);
    volume.gain.linearRampToValueAtTime(0, start + effect.seconds);
  });
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + effect.notes.length * effect.seconds);
}
