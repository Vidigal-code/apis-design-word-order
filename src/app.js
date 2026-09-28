import { getMessages, normalizeLocale } from './i18n/index.js';
import { updateDocumentLanguage } from './i18n/document-language.js';
import { activities } from './content/activities.js';
import { ActivityView } from './activity/activity-view.js';
import { initializeAudioControls, updateSoundControl } from './audio/interactions.js';
import { narrator } from './audio/narrator.js';

const initialLocale = normalizeLocale(undefined);
const initialMessages = getMessages(initialLocale);
const views = activities.map((config) => {
  const view = new ActivityView(config, initialMessages);
  const host = document.getElementById(config.id) ?? document.querySelector('#activities');
  host?.append(view.root);
  return view;
});

/** @param {unknown} locale @returns {void} */
function changeLanguage(locale) {
  narrator.stop();
  const messages = updateDocumentLanguage(locale);
  for (const view of views) view.updateMessages(messages);
  updateSoundControl(messages);
}

initializeAudioControls();
const languageControl = document.querySelector('#language');
if (languageControl instanceof HTMLSelectElement) {
  languageControl.addEventListener('change', () => changeLanguage(languageControl.value));
}
changeLanguage(initialLocale);
