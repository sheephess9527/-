import React from 'react';
import { siteConfig } from '../data/site';
import { AnchorIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/10 bg-slate-50/85 backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white transition-transform group-hover:scale-105">
            <AnchorIcon className="h-5 w-5" />
          </span>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            {siteConfig.title}
          </span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          {siteConfig.nav.map((item) => (
            <a
              key={item.route}
              href={item.route}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 sm:px-4"
            >
              {item.label}
            </a>
          ))}
          <span className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-700 sm:mx-2" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
