const MESSAGE_PLACEHOLDER = /\{([^{}]+)\}/gu;

/** @param {string} template @param {Record<string, string | number>} values @returns {string} */
export function formatMessage(template, values) {
  /** @type {(placeholder: string, key: string) => string} */
  const replacePlaceholder = (placeholder, key) => Object.hasOwn(values, key) ? String(values[key]) : placeholder;
  return template.replaceAll(MESSAGE_PLACEHOLDER, replacePlaceholder);
}
