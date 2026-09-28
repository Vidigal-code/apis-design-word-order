/**
 * @typedef {{ id: string, text: string }} Piece
 * @typedef {{ id: string, pieces: Piece[], solution: string[] }} SentenceConfig
 */

/** @param {unknown} value @returns {value is string} */
function isNonEmptyText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/** @param {unknown} value @returns {value is Piece} */
function isPiece(value) {
  return typeof value === 'object' && value !== null
    && 'id' in value && isNonEmptyText(value.id)
    && 'text' in value && isNonEmptyText(value.text);
}

/** @param {unknown} pieces @returns {asserts pieces is Piece[]} */
function validatePieces(pieces) {
  /** @type {unknown[]} */
  const entries = Array.isArray(pieces) ? Array.from(pieces) : [];
  if (entries.length === 0 || !entries.every(isPiece)) {
    throw new Error('As peças devem conter identificadores e textos não vazios.');
  }
  const identifiers = entries.map((piece) => piece.id);
  if (new Set(identifiers).size !== identifiers.length) {
    throw new Error('Os identificadores das peças devem ser únicos.');
  }
}

/** @param {unknown} solution @param {Piece[]} pieces @returns {asserts solution is string[]} */
function validateSolution(solution, pieces) {
  if (!Array.isArray(solution) || solution.length !== pieces.length) {
    throw new Error('A solução deve conter todas as peças da atividade.');
  }
  const identifiers = new Set(pieces.map((piece) => piece.id));
  /** @type {unknown[]} */
  const entries = Array.from(solution);
  if (new Set(entries).size !== identifiers.size
    || !entries.every((id) => isNonEmptyText(id) && identifiers.has(id))) {
    throw new Error('A solução deve utilizar cada peça exatamente uma vez.');
  }
}

/** @param {unknown} config @returns {asserts config is SentenceConfig} */
export function validateConfig(config) {
  if (!config || typeof config !== 'object' || !('id' in config) || !isNonEmptyText(config.id)) {
    throw new Error('O identificador da atividade deve ser um texto não vazio.');
  }
  const pieces = 'pieces' in config ? config.pieces : undefined;
  const solution = 'solution' in config ? config.solution : undefined;
  validatePieces(pieces);
  validateSolution(solution, pieces);
}
