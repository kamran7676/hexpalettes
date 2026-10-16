import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import { marked } from 'marked';
import { colorSlugAliases } from './color-routes.mjs';

export interface Color {
  slug: string;
  name: string;
  hexCode: string;
  content: string;
  tags: string[];
}

const COLORS_DIR = path.join(process.cwd(), 'src/content/colors');

// Custom renderer to enhance color codes with previews
const renderer = {
  text(text: string) {
    // Match hex color codes (#RRGGBB or #RGB)
    return text.replace(/(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\b/g, (match) => {
      return `<span class="inline-flex items-center gap-1.5">
        <span class="inline-block w-4 h-4 rounded-full border border-gray-200" style="background-color: ${match}"></span>
        <code class="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">${match}</code>
      </span>`;
    });
  }
};

marked.use({ renderer });

export async function getAllColors(): Promise<Color[]> {
  const files = await readdir(COLORS_DIR);
  const colors = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(COLORS_DIR, filename);
        const fileContent = await readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        // Convert markdown to HTML with custom color code handling
        const htmlContent = marked(content);

        return {
          slug: data.slug,
          name: data.name,
          hexCode: data.hexCode,
          content: htmlContent,
          tags: data.tags || [],
        };
      })
  );

  // One entry per canonical slug: drop aliases, keep the longest file for duplicate slugs
  const colorsBySlug = new Map<string, Color>();
  for (const color of colors) {
    if (colorSlugAliases.has(color.slug)) continue;
    const current = colorsBySlug.get(color.slug);
    if (!current || color.content.length > current.content.length) {
      colorsBySlug.set(color.slug, color);
    }
  }

  return [...colorsBySlug.values()];
}

export async function getColorBySlug(slug: string): Promise<Color | null> {
  try {
    const filePath = path.join(COLORS_DIR, `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Convert markdown to HTML with custom color code handling
    const htmlContent = marked(content);

    return {
      slug: data.slug,
      name: data.name,
      hexCode: data.hexCode,
      content: htmlContent,
      tags: data.tags || [],
    };
  } catch {
    return null;
  }
}

export async function getAllTags(): Promise<string[]> {
  const colors = await getAllColors();
  return Array.from(new Set(colors.flatMap(color => color.tags)));
}