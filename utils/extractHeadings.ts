export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w一-龥-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function extractHeadings(content: string): Heading[] {
  return content
    .split('\n')
    .flatMap((line): Heading[] => {
      const m = line.match(/^(#{2,3})\s+(.+)$/);
      if (!m) return [];
      const level = m[1].length as 2 | 3;
      const text = m[2].trim();
      return [{ id: slugifyHeading(text), text, level }];
    });
}
