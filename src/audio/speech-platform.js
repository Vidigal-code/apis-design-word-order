/** @typedef {{text:string, lang:string, voice:SpeechSynthesisVoice|null, addEventListener:(type:string, listener:EventListenerOrEventListenerObject)=>void}} SpeechUtterance */
/** @typedef {{createUtterance:(text:string)=>SpeechUtterance, speak:(utterance:SpeechUtterance)=>void, cancel:()=>void, getVoices:()=>SpeechSynthesisVoice[]}} SpeechPlatform */

/** @returns {SpeechPlatform|null} */
export function browserPlatform() {
  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') return null;
  return {
    createUtterance: (text) => new SpeechSynthesisUtterance(text),
    speak: (utterance) => {
      if (utterance instanceof SpeechSynthesisUtterance) speechSynthesis.speak(utterance);
    },
    cancel: () => speechSynthesis.cancel(),
    getVoices: () => speechSynthesis.getVoices(),
  };
}

/** @param {SpeechSynthesisVoice[]} voices @param {string} language @returns {SpeechSynthesisVoice|null} */
export function chooseVoice(voices, language) {
  const base = language.toLowerCase().split('-')[0];
  const matching = voices.filter((voice) => voice.lang.toLowerCase().split('-')[0] === base);
  return matching.find((voice) => voice.localService) ?? matching[0] ?? null;
}
