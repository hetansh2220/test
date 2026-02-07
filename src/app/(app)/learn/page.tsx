"use client";

import Link from "next/link";
import { articles } from "@/lib/constants/learningContent";
import { HiOutlineClock } from "react-icons/hi2";

export default function LearnPage() {
  return (
    <div className="py-4 animate-fade-in">
      <h1 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-display)] mb-1">Financial Learning</h1>
      <p className="text-xs text-muted mb-6">Build your financial knowledge one article at a time</p>

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 stagger">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            className="card card-glow p-5 flex items-start gap-4 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-overlay flex items-center justify-center shrink-0 text-2xl">
              {article.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground">{article.title}</h3>
              <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">{article.summary}</p>
              <div className="flex items-center gap-1 mt-2">
                <HiOutlineClock className="w-3 h-3 text-muted" />
                <span className="text-[10px] text-muted">{article.readTimeMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
