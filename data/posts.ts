import type { Post } from '../types';
// @ts-ignore – 类型声明见 virtual.d.ts
import postsMeta from 'virtual:posts-meta';

type PostMeta = Omit<Post, 'content'>;

// 懒加载器：每篇文章是独立的 JS chunk，进文章页才下载
const contentLoaders = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

function pathToSlug(p: string): string {
  return (p.split('/').pop() ?? '').replace(/\.md$/, '');
}

// 元数据列表（不含正文），用于首页、标签页、搜索
export const posts: PostMeta[] = postsMeta as PostMeta[];
export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function getPostBySlug(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

/** 按需加载文章正文（已剥去 frontmatter） */
export async function loadPostContent(slug: string): Promise<string> {
  const entry = Object.entries(contentLoaders).find(([p]) => pathToSlug(p) === slug);
  if (!entry) return '';
  const raw = (await entry[1]()) as string;
  const m = /^---[\s\S]*?\n---\r?\n?([\s\S]*)$/.exec(raw);
  return m ? m[1].trim() : raw;
}

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
