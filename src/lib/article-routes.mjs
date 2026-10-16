import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const articlesDir = path.join(projectRoot, 'src/content/articles');

// Articles marked `noindex: true` in frontmatter (off-topic for a color tool)
export function getNoindexArticleSlugs() {
  return new Set(readdirSync(articlesDir)
    .filter(filename => filename.endsWith('.md'))
    .map(filename => matter(readFileSync(path.join(articlesDir, filename), 'utf8')).data)
    .filter(data => data.noindex === true && typeof data.slug === 'string')
    .map(data => data.slug));
}
