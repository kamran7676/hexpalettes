import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const colorsDir = path.join(projectRoot, 'src/content/colors');

export const noindexColorSlugs = new Set([
  'mucus-plug-color-chart',
  'color-factory-nyc',
  'color-factory-chicago',
  'color-guard',
  'color-maze',
  'color-sheet',
]);

// Duplicate color pages consolidated into one canonical page (alias -> canonical).
export const colorSlugAliases = new Map([
  ['amber-color', 'amber'],
  ['cream', 'cream-color'],
  ['gray-color', 'gray'],
  ['grey', 'gray'],
  ['grey-color', 'gray'],
  ['marron-color', 'marron'],
  ['peach-color', 'peach'],
  ['sage-color', 'sage'],
  ['tan-color', 'tan'],
  ['white-color', 'white'],
]);

export function getColorRouteSlugs() {
  return [...new Set(readdirSync(colorsDir)
    .filter(filename => filename.endsWith('.md'))
    .map(filename => matter(readFileSync(path.join(colorsDir, filename), 'utf8')).data.slug)
    .filter(slug => typeof slug === 'string' && slug.length > 0 && !colorSlugAliases.has(slug)))].sort();
}
