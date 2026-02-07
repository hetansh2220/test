"use client";

import { useParams, useRouter } from "next/navigation";
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
    <div className="py-4 animate-fade-in lg:max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted text-sm font-medium mb-6 hover:text-foreground transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to articles
      </button>

      <div className="mb-6">
        <span className="text-4xl block mb-3">{article.icon}</span>
        <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-display)] text-foreground">{article.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <HiOutlineClock className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs text-muted">{article.readTimeMinutes} min read</span>
        </div>
      </div>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
      />
    </div>
  );
}
