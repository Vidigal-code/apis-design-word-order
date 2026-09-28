/**
 * @template {keyof HTMLElementTagNameMap} Tag
 * @param {Tag} tag
 * @param {string} className
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[Tag]}
 */
export function element(tag, className, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

/** @param {{text:string, label?:string, className:string, action:()=>void}} options @returns {HTMLButtonElement} */
export function button(options) {
  const control = element('button', options.className, options.text);
  control.type = 'button';
  if (options.label) control.setAttribute('aria-label', options.label);
  control.addEventListener('click', options.action);
  return control;
}
