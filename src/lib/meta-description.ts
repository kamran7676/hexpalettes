export function getMetaDescription(content: string, title = ''): string {
  const paragraph = content.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1]
    ?? content.split(/\r?\n/).find(line => line.trim() && !/^\s*#+\s/.test(line))
    ?? '';
  let text = paragraph
    .replace(/^\s*#+\s*/, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  const repeatedTitle = title && new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text);
  if (repeatedTitle) {
    text = text.slice(title.length).trimStart();
  }

  const firstSentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || text;
  if (firstSentence.length <= 155) return firstSentence;

  const truncated = firstSentence.slice(0, 155);
  const wordBoundary = truncated.lastIndexOf(' ');
  return truncated.slice(0, wordBoundary > 0 ? wordBoundary : 155).trim();
}
