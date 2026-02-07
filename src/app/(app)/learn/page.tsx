"use client";

import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/constants/learningContent";
import { HiOutlineClock } from "react-icons/hi2";

export default function LearnPage() {
  return (
    <div className="py-6 animate-fade-in">
      <h1 className="text-xl font-bold font-[family-name:var(--font-display)] mb-1">Financial Learning</h1>
      <p className="text-sm text-muted mb-8">Build your financial knowledge one article at a time</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            className="card card-glow overflow-hidden block"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Emoji badge */}
              <div className="absolute bottom-3 left-3 w-12 h-12 rounded-2xl bg-surface-raised/90 backdrop-blur-sm flex items-center justify-center text-lg shadow-sm">
                {article.icon}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-base font-bold text-foreground">{article.title}</h3>
              <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">{article.summary}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <HiOutlineClock className="w-3.5 h-3.5 text-muted" />
                <span className="text-xs text-muted">{article.readTimeMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
