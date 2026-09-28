import { scenes } from './scene-data.js';

/** @typedef {import('./scene-data.js').SceneName} SceneName */
/** @typedef {import('./scene-data.js').Shape} Shape */

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
/** @type {SceneName} */
export const DEFAULT_SCENE = 'learning';

/** @param {Shape} shape @returns {SVGElement} */
function createShape(shape) {
  const node = document.createElementNS(SVG_NAMESPACE, shape.tag);
  for (const [name, value] of Object.entries(shape.attributes)) node.setAttribute(name, String(value));
  return node;
}

/** @param {SceneName} scene @returns {SVGSVGElement} */
export function createScene(scene) {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('class', 'scene-art');
  svg.setAttribute('viewBox', '0 0 200 140');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  for (const shape of scenes[scene] ?? scenes[DEFAULT_SCENE]) svg.append(createShape(shape));
  return svg;
}
