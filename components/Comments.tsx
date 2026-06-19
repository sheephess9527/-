import React, { useEffect, useRef } from 'react';
import { siteConfig } from '../data/site';

// 基于 Giscus（GitHub Discussions）的评论区。
// 需要在 data/site.ts 的 comments 中填好 repoId / categoryId 才会渲染。
// 主题随站点明暗模式自动切换：监听 <html> 的 dark class 变化，
// 通过 postMessage 通知 giscus iframe 更新主题。

const giscusTheme = () =>
  document.documentElement.classList.contains('dark') ? 'dark_dimmed' : 'light';

const Comments: React.FC<{ slug: string }> = ({ slug }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { repo, repoId, category, categoryId } = siteConfig.comments;

  useEffect(() => {
    const container = ref.current;
    if (!container || !repoId || !categoryId) return;

    // slug 变化时清空旧实例，重新注入
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', slug);
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusTheme());
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    container.appendChild(script);

    // 监听明暗模式切换，同步 giscus 主题
    const observer = new MutationObserver(() => {
      const iframe = container.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } },
        'https://giscus.app',
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [slug, repo, repoId, category, categoryId]);

  if (!repoId || !categoryId) return null;

  return (
    <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">评论</h2>
      <div ref={ref} />
    </section>
  );
};

export default Comments;
