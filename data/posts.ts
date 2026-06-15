import { Post } from '../types';

// 文章以 Markdown 文件存储在 content/posts/ 下。
// 这里用 Vite 的 import.meta.glob 在构建时把它们全部读进来。
// 新增文章：在 content/posts/ 里加一个 .md 文件（带 YAML frontmatter）即可。
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

// 极简 YAML frontmatter 解析器（只覆盖本项目用到的字段类型：字符串、日期、列表）
function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const [, fm, body] = match;
  const data: Record<string, unknown> = {};
  const lines = fm.split(/\r?\n/);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i++;
      continue;
    }
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    const rest = m[2];

    if (rest === '') {
      // 块状列表：后续以 "- " 开头的行
      const list: string[] = [];
      i++;
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        list.push(stripQuotes(lines[i].replace(/^\s*-\s+/, '')));
        i++;
      }
      data[key] = list;
      continue;
    }

    // 行内列表 [a, b]
    if (rest.startsWith('[') && rest.endsWith(']')) {
      data[key] = rest
        .slice(1, -1)
        .split(',')
        .map((s) => stripQuotes(s))
        .filter((s) => s.length > 0);
      i++;
      continue;
    }

    data[key] = stripQuotes(rest);
    i++;
  }

  return { data, body };
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = (path.split('/').pop() ?? '').replace(/\.md$/, '');
    const { data, body } = parseFrontmatter(raw);
    const tags = Array.isArray(data.tags)
      ? (data.tags as string[])
      : data.tags
        ? [String(data.tags)]
        : [];
    return {
      slug,
      title: String(data.title ?? slug),
      excerpt: String(data.excerpt ?? ''),
      date: String(data.date ?? ''),
      author: String(data.author ?? '锚点'),
      tags,
      cover: data.cover ? String(data.cover) : undefined,
      content: body.trim(),
    } as Post;
  })
  .filter((p) => p.title);

// 按日期倒序排列（最新的在前）
export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

// 收集所有标签及其文章数量
export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
