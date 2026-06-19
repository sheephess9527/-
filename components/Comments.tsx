import React, { useEffect, useRef } from 'react';
import { init, type WalineInstance } from '@waline/client';
import '@waline/client/style';
import { siteConfig } from '../data/site';

const giscusTheme = () =>
  document.documentElement.classList.contains('dark') ? 'dark_dimmed' : 'light';

// ── Waline：匿名评论，无需登录 ───────────────────────────────
const WalineComments: React.FC<{ slug: string }> = ({ slug }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WalineInstance | null>(null);
  const { serverURL } = siteConfig.comments.waline;

  useEffect(() => {
    if (!ref.current || !serverURL) return;
    instanceRef.current = init({
      el: ref.current,
      serverURL,
      path: `/post/${slug}`,
      lang: 'zh-CN',
      dark: 'html.dark',
      locale: { placeholder: '欢迎留言，匿名也可（填昵称即可，邮箱选填）…' },
    });
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [slug, serverURL]);

  if (!serverURL) return null;
  return <div ref={ref} />;
};

// ── giscus：基于 GitHub Discussions ──────────────────────────
const GiscusComments: React.FC<{ slug: string }> = ({ slug }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { repo, repoId, category, categoryId } = siteConfig.comments.giscus;

  useEffect(() => {
    const container = ref.current;
    if (!container || !repoId || !categoryId) return;

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

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } },
        'https://giscus.app',
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [slug, repo, repoId, category, categoryId]);

  if (!repoId || !categoryId) return null;
  return <div ref={ref} />;
};

// ── 评论区容器：按开关渲染 Waline / giscus（可单开、可都开）──
const Comments: React.FC<{ slug: string }> = ({ slug }) => {
  const { waline, giscus } = siteConfig.comments;
  const showWaline = waline.enabled && !!waline.serverURL;
  const showGiscus = giscus.enabled && !!giscus.repoId && !!giscus.categoryId;

  if (!showWaline && !showGiscus) return null;

  return (
    <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">评论</h2>
      {showWaline && <WalineComments slug={slug} />}
      {showWaline && showGiscus && (
        <div className="my-8 border-t border-dashed border-slate-200 dark:border-slate-800" />
      )}
      {showGiscus && <GiscusComments slug={slug} />}
    </section>
  );
};

export default Comments;
