import React from 'react';
import { siteConfig } from '../data/site';
import { Markdown } from './Markdown';
import { ArrowLeftIcon } from './Icons';

const AboutPage: React.FC = () => (
  <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
    <a
      href="#/"
      className="mb-12 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-brand-600 dark:text-slate-500 dark:hover:text-brand-400"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      返回首页
    </a>
    <div className="text-[1.125rem] leading-[1.9]">
      <Markdown source={siteConfig.about} />
    </div>
  </div>
);

export default AboutPage;
