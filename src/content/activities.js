import { practiceSentences } from './sentences.js';

/**
 * @typedef {import('./sentences.js').SentenceConfig} SentenceConfig
 * @typedef {import('./sentences.js').Scene} Scene
 * @typedef {import('./sentences.js').PromptKey} PromptKey
 * @typedef {import('./sentences.js').HintKey} HintKey
 * @typedef {import('./sentences.js').ActivitySentenceConfig} ActivitySentenceConfig
 * @typedef {object} ActivityConfig
 * @property {string} id
 * @property {string} number
 * @property {'activityOneTitle' | 'activityTwoTitle'} titleKey
 * @property {'activityOneDescription' | 'activityTwoDescription'} descriptionKey
 * @property {ActivitySentenceConfig[]} items
 */

/** @type {ActivityConfig[]} */
export const activities = [
  {
    id: 'practice',
    number: '01',
    titleKey: 'activityOneTitle',
    descriptionKey: 'activityOneDescription',
    items: practiceSentences,
  },
];
