import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// ── RSS 生成插件 ──────────────────────────────────────────
function parseFm(raw: string): Record<string, string> {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return {};
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_]+):\s*(.+)$/.exec(line);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return data;
}

function rssPlugin(): Plugin {
  return {
    name: 'generate-rss',
    apply: 'build',
    closeBundle() {
      const postsDir = path.resolve(__dirname, 'content/posts');
      const outDir   = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(postsDir)) return;

      const base = 'https://www.maodian.uk';
      const items = fs
        .readdirSync(postsDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const slug = f.replace(/\.md$/, '');
          const data = parseFm(fs.readFileSync(path.join(postsDir, f), 'utf-8'));
          return { slug, ...data };
        })
        .filter((p) => p.title && p.date)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 20)
        .map(
          (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/#/post/${p.slug}</link>
      <guid isPermaLink="true">${base}/#/post/${p.slug}</guid>
      <description><![CDATA[${p.excerpt ?? ''}]]></description>
      <pubDate>${new Date(String(p.date)).toUTCString()}</pubDate>
    </item>`,
        )
        .join('');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>锚点 · Anchor</title>
    <link>${base}</link>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>用系统对抗混乱，用逻辑重塑日常。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'rss.xml'), xml, 'utf-8');
      console.log('✓ rss.xml generated');
    },
  };
}
// ─────────────────────────────────────────────────────────

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), rssPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
