import React from 'react';

const NotFound: React.FC = () => (
  <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
    <p className="text-7xl font-black text-accent-500">404</p>
    <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">页面走丢了</h1>
    <p className="mt-2 text-slate-500 dark:text-slate-400">
      你访问的页面不存在，也许它被移动或删除了。
    </p>
    <a
      href="#/"
      className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
    >
      回到首页
    </a>
  </div>
);

export default NotFound;
