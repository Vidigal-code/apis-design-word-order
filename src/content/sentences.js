/**
 * @typedef {import('../sentence/sentence.js').SentenceConfig} SentenceConfig
 * @typedef {import('../scenes/scene-view.js').SceneName} Scene
 * @typedef {'promptCat' | 'promptFries' | 'promptHero' | 'promptLearning' | 'promptSteps'} PromptKey
 * @typedef {'hintCat' | 'hintFries' | 'hintHero' | 'hintLearning' | 'hintSteps'} HintKey
 * @typedef {SentenceConfig & {scene?: Scene, promptKey?: PromptKey, hintKey?: HintKey}} ActivitySentenceConfig
 */

/** @type {ActivitySentenceConfig[]} */
export const practiceSentences = [
  {
    id: 'cat',
    scene: 'cat',
    promptKey: 'promptCat',
    hintKey: 'hintCat',
    pieces: [
      { id: 'sleeping', text: 'sleeping' },
      { id: 'is', text: 'is' },
      { id: 'cat', text: 'The cat' },
    ],
    solution: ['cat', 'is', 'sleeping'],
  },
  {
    id: 'fries',
    scene: 'fries',
    promptKey: 'promptFries',
    hintKey: 'hintFries',
    pieces: [
      { id: 'fries', text: 'french fries' },
      { id: 'i', text: 'I' },
      { id: 'love', text: 'love' },
    ],
    solution: ['i', 'love', 'fries'],
  },
  {
    id: 'power',
    scene: 'hero',
    promptKey: 'promptHero',
    hintKey: 'hintHero',
    pieces: [
      { id: 'power', text: 'great power' },
      { id: 'comes', text: 'comes' },
      { id: 'with', text: 'With' },
      { id: 'responsibility', text: 'great responsibility' },
    ],
    solution: ['with', 'power', 'comes', 'responsibility'],
  },
  {
    id: 'learning',
    scene: 'learning',
    promptKey: 'promptLearning',
    hintKey: 'hintLearning',
    pieces: [
      { id: 'doors', text: 'new doors' },
      { id: 'learning', text: 'Learning' },
      { id: 'opens', text: 'opens' },
    ],
    solution: ['learning', 'opens', 'doors'],
  },
  {
    id: 'steps',
    scene: 'steps',
    promptKey: 'promptSteps',
    hintKey: 'hintSteps',
    pieces: [
      { id: 'difference', text: 'a big difference' },
      { id: 'make', text: 'make' },
      { id: 'steps', text: 'Small steps' },
    ],
    solution: ['steps', 'make', 'difference'],
  },
];
