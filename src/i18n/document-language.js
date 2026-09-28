import { getDocumentLanguage, getMessages } from './index.js';

/** @param {unknown} locale @returns {import('./index.js').Messages} */
export function updateDocumentLanguage(locale) {
  const messages = getMessages(locale);
  document.documentElement.lang = getDocumentLanguage(locale);
  document.title = messages.pageTitle;
  for (const element of document.querySelectorAll('[data-i18n]')) {
    if (!(element instanceof HTMLElement)) continue;
    const key = element.dataset.i18n;
    if (key && Object.hasOwn(messages, key)) {
      element.textContent = messages[/** @type {keyof typeof messages} */ (key)];
    }
  }
  return messages;
}
