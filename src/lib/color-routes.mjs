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

export function getColorRouteSlugs() {
  return [...new Set(readdirSync(colorsDir)
    .filter(filename => filename.endsWith('.md'))
    .map(filename => matter(readFileSync(path.join(colorsDir, filename), 'utf8')).data.slug)
    .filter(slug => typeof slug === 'string' && slug.length > 0))].sort();
}
