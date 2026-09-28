import { getMessages } from '../i18n/index.js';
import { soundEffects } from './sound-effects.js';
import { narrator } from './narrator.js';

const soundControl = document.querySelector('#sound-toggle');

/** @returns {void} */
export function initializeAudioControls() {
  soundControl?.addEventListener('click', toggleSound);
  document.addEventListener('click', playInteractionSound, { capture: true });
  document.addEventListener('visibilitychange', stopHiddenAudio);
  window.addEventListener('pagehide', stopAudio);
}

/** @param {import('../i18n/index.js').Messages} messages @returns {void} */
export function updateSoundControl(messages) {
  if (!(soundControl instanceof HTMLButtonElement)) return;
  soundControl.setAttribute('aria-label', messages.soundEffects);
  soundControl.setAttribute('aria-pressed', String(soundEffects.isEnabled()));
  const state = soundControl.querySelector('.sound-state');
  if (state) state.textContent = soundEffects.isEnabled() ? messages.soundOn : messages.soundOff;
}

/** @param {MouseEvent} event */
function playInteractionSound(event) {
  if (!(event.target instanceof Element)) return;
  const control = event.target.closest('button, summary');
  if (!control || control === soundControl || control.classList.contains('narration-button')) return;
  if (control instanceof HTMLButtonElement && control.disabled) return;
  void soundEffects.play('tap');
}

function toggleSound() {
  soundEffects.toggle();
  updateSoundControl(getMessages(document.documentElement.lang));
  if (soundEffects.isEnabled()) void soundEffects.play('tap');
}

function stopHiddenAudio() {
  if (document.hidden) stopAudio();
}

/** @returns {void} */
export function stopAudio() {
  soundEffects.stop();
  narrator.stop();
}
