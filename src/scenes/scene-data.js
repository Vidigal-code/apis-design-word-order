/** @typedef {'cat' | 'fries' | 'hero' | 'learning' | 'steps'} SceneName */
/** @typedef {{tag:keyof SVGElementTagNameMap, attributes:Record<string, string | number>}} Shape */

const COLORS = {
  ink: 'var(--scene-ink)',
  orange: 'var(--scene-orange)',
  purple: 'var(--scene-purple)',
  yellow: 'var(--scene-yellow)',
  green: 'var(--scene-green)',
  paper: 'var(--color-surface)',
};

/** @type {Record<SceneName, Shape[]>} */
export const scenes = {
  cat: [
    { tag: 'ellipse', attributes: { cx: 103, cy: 117, rx: 75, ry: 10, fill: COLORS.purple, opacity: '.18' } },
    { tag: 'path', attributes: { d: 'M133 98c42 12 52-28 25-35', fill: 'none', stroke: COLORS.orange, 'stroke-width': 17, 'stroke-linecap': 'round' } },
    { tag: 'ellipse', attributes: { cx: 112, cy: 88, rx: 42, ry: 30, fill: COLORS.orange } },
    { tag: 'path', attributes: { d: 'M44 70 39 34 64 48 84 39 94 75Z', fill: COLORS.orange } },
    { tag: 'ellipse', attributes: { cx: 65, cy: 80, rx: 34, ry: 31, fill: COLORS.orange } },
    { tag: 'path', attributes: { d: 'm44 43 3 19 12-9m22-6-7 14 14 1', fill: COLORS.paper, opacity: '.6' } },
    { tag: 'path', attributes: { d: 'M43 79q7 7 14 0m12 0q7 7 14 0m-27 17q7 7 14 0', fill: 'none', stroke: COLORS.ink, 'stroke-width': 3, 'stroke-linecap': 'round' } },
    { tag: 'path', attributes: { d: 'm60 86 7 0-3.5 5Z', fill: COLORS.ink } },
    { tag: 'path', attributes: { d: 'M92 64v12m12-16v14m12-13v13', fill: 'none', stroke: COLORS.ink, opacity: '.18', 'stroke-width': 5, 'stroke-linecap': 'round' } },
    { tag: 'path', attributes: { d: 'M117 35h13l-13 13h13m15-31h18l-18 18h18', fill: 'none', stroke: COLORS.purple, 'stroke-width': 4, 'stroke-linejoin': 'round' } },
  ],
  fries: [
    { tag: 'ellipse', attributes: { cx: 97, cy: 123, rx: 57, ry: 8, fill: COLORS.orange, opacity: '.2' } },
    { tag: 'path', attributes: { d: 'm67 77-7-45 15-3 6 44m6 3-1-57 16-1 1 58m7 0 8-49 15 3-8 49', fill: COLORS.yellow, stroke: COLORS.orange, 'stroke-width': 3, 'stroke-linejoin': 'round' } },
    { tag: 'path', attributes: { d: 'M49 65q45 21 96 0l-12 51q-38 14-74 0Z', fill: COLORS.orange } },
    { tag: 'circle', attributes: { cx: 82, cy: 90, r: 3, fill: COLORS.ink } },
    { tag: 'circle', attributes: { cx: 112, cy: 90, r: 3, fill: COLORS.ink } },
    { tag: 'path', attributes: { d: 'M87 101q10 12 20 0', fill: 'none', stroke: COLORS.ink, 'stroke-width': 3, 'stroke-linecap': 'round' } },
    { tag: 'path', attributes: { d: 'M155 30c-15-15-25 8 0 21 25-13 15-36 0-21', fill: COLORS.purple } },
  ],
  hero: [
    { tag: 'ellipse', attributes: { cx: 100, cy: 125, rx: 57, ry: 7, fill: COLORS.purple, opacity: '.18' } },
    { tag: 'path', attributes: { d: 'm100 16 53 20-6 48q-8 26-47 40-39-14-47-40l-6-48Z', fill: COLORS.purple } },
    { tag: 'path', attributes: { d: 'm100 26 41 16-5 40q-6 19-36 31-30-12-36-31l-5-40Z', fill: 'none', stroke: COLORS.paper, 'stroke-width': 3, opacity: '.6' } },
    { tag: 'path', attributes: { d: 'm105 37-28 39h22l-7 28 31-43h-23Z', fill: COLORS.yellow, 'stroke-linejoin': 'round' } },
    { tag: 'path', attributes: { d: 'm27 28 3 9 9 3-9 3-3 9-3-9-9-3 9-3Zm140 50 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z', fill: COLORS.orange } },
  ],
  learning: [
    { tag: 'ellipse', attributes: { cx: 100, cy: 120, rx: 67, ry: 9, fill: COLORS.green, opacity: '.2' } },
    { tag: 'path', attributes: { d: 'M99 39Q64 14 29 32v72q38-12 70 11 32-23 71-11V32q-35-18-71 7Z', fill: COLORS.purple } },
    { tag: 'path', attributes: { d: 'M98 42Q66 25 38 38v57q33-5 60 13m4-66q32-17 59-4v57q-33-5-59 13', fill: COLORS.paper } },
    { tag: 'path', attributes: { d: 'M51 54q19-3 34 6M51 70q19-3 34 6m32-16q15-9 33-6m-33 22q15-9 33-6', fill: 'none', stroke: COLORS.purple, 'stroke-width': 4, 'stroke-linecap': 'round' } },
    { tag: 'path', attributes: { d: 'm106 8 4 9 10 4-10 4-4 9-4-9-10-4 10-4Z', fill: COLORS.yellow } },
  ],
  steps: [
    { tag: 'path', attributes: { d: 'M28 119V95h44V68h44V41h43v78Z', fill: COLORS.green } },
    { tag: 'path', attributes: { d: 'M28 95h44V68h44V41h43', fill: 'none', stroke: COLORS.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' } },
    { tag: 'path', attributes: { d: 'm137 9 5 9 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2Z', fill: COLORS.yellow } },
    { tag: 'path', attributes: { d: 'M39 69q4-13 16-14m24-15q5-10 17-13', fill: 'none', stroke: COLORS.purple, 'stroke-width': 4, 'stroke-linecap': 'round' } },
    { tag: 'circle', attributes: { cx: 136, cy: 69, r: 3, fill: COLORS.ink } },
    { tag: 'circle', attributes: { cx: 150, cy: 69, r: 3, fill: COLORS.ink } },
    { tag: 'path', attributes: { d: 'M137 81q6 7 12 0', fill: 'none', stroke: COLORS.ink, 'stroke-width': 3, 'stroke-linecap': 'round' } },
  ],
};
