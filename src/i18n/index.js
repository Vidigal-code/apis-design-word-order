import portuguese from './pt.json' with { type: 'json' };
import english from './en.json' with { type: 'json' };
import spanish from './es.json' with { type: 'json' };
import { DEFAULT_LOCALE, DOCUMENT_LANGUAGES, PAGE_TITLE } from './config.js';

/** @typedef {import('./config.js').Locale} Locale */
/** @typedef {typeof portuguese & {pageTitle: string}} Messages */

/** @type {Record<Locale, typeof portuguese>} */
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
  return { ...dictionaries[normalizeLocale(locale)], pageTitle: PAGE_TITLE };
}

/** @param {unknown} locale @returns {string} */
export function getDocumentLanguage(locale) {
  return DOCUMENT_LANGUAGES[normalizeLocale(locale)];
}
