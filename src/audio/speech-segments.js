/** @typedef {{text:string, lang:string}} SpeechSegment */

/** @param {unknown} input @returns {SpeechSegment[]|null} */
export function validateSegments(input) {
  if (!Array.isArray(input) || input.length === 0) return null;
  /** @type {SpeechSegment[]} */
  const segments = [];
  /** @type {unknown[]} */
  const candidates = input;
  for (const segment of candidates) {
    if (!segment || typeof segment !== 'object' || !('text' in segment) || !('lang' in segment)) return null;
    if (typeof segment.text !== 'string' || typeof segment.lang !== 'string') return null;
    const text = segment.text.trim();
    if (!text || !segment.lang.trim()) return null;
    try {
      segments.push({ text, lang: Intl.getCanonicalLocales(segment.lang)[0] });
    } catch {
      return null;
    }
  }
  return segments;
}
