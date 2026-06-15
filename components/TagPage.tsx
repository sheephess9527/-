import React from 'react';
import { sortedPosts } from '../data/posts';
import PostCard from './PostCard';
import { ArrowLeftIcon } from './Icons';

const TagPage: React.FC<{ tag: string }> = ({ tag }) => {
  const matched = sortedPosts.filter((p) => p.tags.includes(tag));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <a
        href="#/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-brand-600 dark:text-slate-500 dark:hover:text-brand-400"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        返回首页
      </a>

      <h1 className="mb-12 border-b border-slate-900/10 pb-8 text-4xl font-black tracking-tighter text-slate-900 dark:border-white/10 dark:text-white sm:text-5xl">
        <span className="text-accent-500">#</span>
        {tag}
        <span className="ml-3 align-middle text-base font-medium text-slate-400">
          {matched.length} 篇
        </span>
      </h1>

      {matched.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {matched.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">这个标签下还没有文章。</p>
      )}
    </div>
  );
};

export default TagPage;
