import { portuguese } from './pt.js';
import { english } from './en.js';
import { spanish } from './es.js';
import { DEFAULT_LOCALE, DOCUMENT_LANGUAGES } from './config.js';

/** @typedef {import('./config.js').Locale} Locale */
/** @typedef {import('./pt.js').Messages} Messages */

/** @type {Record<Locale, Messages>} */
const dictionaries = { pt: portuguese, en: english, es: spanish };

/** @param {unknown} locale @returns {Locale} */
export function normalizeLocale(locale) {
  if (typeof locale !== 'string') return DEFAULT_LOCALE;
  const [language] = locale.trim().toLowerCase().split('-');
  return Object.hasOwn(DOCUMENT_LANGUAGES, language)
    ? /** @type {Locale} */ (language) : DEFAULT_LOCALE;
}

/** @param {unknown} locale @returns {Messages} */
export function getMessages(locale) {
  return dictionaries[normalizeLocale(locale)];
}

/** @param {unknown} locale @returns {string} */
export function getDocumentLanguage(locale) {
  return DOCUMENT_LANGUAGES[normalizeLocale(locale)];
}
