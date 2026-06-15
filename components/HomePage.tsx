import React from 'react';
import { sortedPosts, getAllTags } from '../data/posts';
import { siteConfig } from '../data/site';
import PostCard from './PostCard';

const HomePage: React.FC = () => {
  const [featured, ...rest] = sortedPosts;
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      {/* 杂志刊头 */}
      <section className="mb-12 border-b border-slate-900/10 pb-10 dark:border-white/10">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-7xl">
          {siteConfig.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xl">
          {siteConfig.description}
        </p>
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
            {tags.map(({ tag, count }) => (
              <a
                key={tag}
                href={`#/tag/${encodeURIComponent(tag)}`}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
              >
                {tag}
                <span className="ml-0.5 text-xs text-slate-300 dark:text-slate-600">{count}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 头条大卡 */}
      {featured && <PostCard post={featured} featured />}

      {/* 网格列表 */}
      {rest.length > 0 && (
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
