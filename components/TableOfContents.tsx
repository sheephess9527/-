import React, { useEffect, useRef, useState } from 'react';
import { Heading } from '../utils/extractHeadings';

interface Props {
  headings: Heading[];
}

const TableOfContents: React.FC<Props> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headingEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 取第一个进入视口的标题作为当前节
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );

    headingEls.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="目录" className="no-print">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        目录
      </p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block truncate py-0.5 text-[13px] leading-snug transition-colors ${
                level === 3 ? 'pl-3' : ''
              } ${
                activeId === id
                  ? 'font-medium text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
