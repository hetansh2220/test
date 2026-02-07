"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { articles } from "@/lib/constants/learningContent";
import { HiOutlineArrowLeft, HiOutlineClock } from "react-icons/hi2";

function renderMarkdown(content: string) {
  // Simple markdown to HTML for headings, bold, lists, paragraphs
  const lines = content.split("\n");
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h3>${trimmed.slice(4)}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      if (inList) { result.push("</ul>"); inList = false; }
      result.push(`<h2>${trimmed.slice(3)}</h2>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) { result.push("<ul>"); inList = true; }
      const text = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      result.push(`<li>${text}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { result.push("<ul>"); inList = true; }
      const text = trimmed.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      result.push(`<li>${text}</li>`);
    } else if (trimmed === "") {
      if (inList) { result.push("</ul>"); inList = false; }
    } else {
      if (inList) { result.push("</ul>"); inList = false; }
      const text = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      result.push(`<p>${text}</p>`);
    }
  }

  if (inList) result.push("</ul>");
  return result.join("\n");
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    return (
      <div className="py-4 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted">Article not found</p>
        <button onClick={() => router.back()} className="mt-4 text-primary text-sm font-semibold">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 animate-fade-in lg:max-w-3xl">
      <button
        onClick={() => router.back()}
        className="w-11 h-11 rounded-2xl bg-surface-raised border border-border shadow-sm flex items-center justify-center hover:shadow-md transition-all mb-6"
      >
        <HiOutlineArrowLeft className="w-5 h-5 text-muted" />
      </button>

      {/* Hero image */}
      <div className="relative h-52 lg:h-72 rounded-3xl overflow-hidden mb-6">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 768px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{article.icon}</span>
            <div className="flex items-center gap-1.5">
              <HiOutlineClock className="w-3.5 h-3.5 text-white/70" />
              <span className="text-xs text-white/70">{article.readTimeMinutes} min read</span>
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-display)] text-white">{article.title}</h1>
        </div>
      </div>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
      />
    </div>
  );
}
