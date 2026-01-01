import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useLocation, useParams } from "react-router-dom";
import { formatBlogDate, getBlogBySlug } from "../lib/blog";
import GistEmbed from "./GistEmbed";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function normalizeEmbeds(markdown: string) {
  return markdown.replace(
    /<script\s+src=["'](https:\/\/gist\.github\.com\/[^"']+?\.js(?:\?[^"']*)?)["']\s*>\s*<\/script>/gi,
    (_match, src: string) => `\n\n\`\`\`gist\n${src}\n\`\`\`\n\n`,
  );
}

function plainText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function createSlugger() {
  const seen = new Map<string, number>();
  const slug = (text: string) => {
    const base = plainText(text)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const key = base || "section";
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    return count === 0 ? key : `${key}-${count}`;
  };
  return { slug };
}

function extractToc(markdown: string, titleToSkip?: string) {
  const toc: Array<{ depth: number; text: string; id: string }> = [];
  const slugger = createSlugger();

  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  let fenceMarker: string | null = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^(\s*)(```|~~~)/);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (fenceMarker === marker) {
        inFence = false;
        fenceMarker = null;
      }
      continue;
    }

    if (inFence) continue;

    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const depth = match[1].length;
    const rawText = match[2];
    const text = plainText(rawText);
    if (!text) continue;

    if (titleToSkip && text.toLowerCase() === plainText(titleToSkip).toLowerCase()) {
      continue;
    }

    // Keep it simple: only H1-H3
    if (depth > 3) continue;

    toc.push({ depth, text, id: slugger.slug(text) });
  }

  return toc;
}

function childrenToText(children: unknown): string {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (typeof children === "object" && "props" in (children as any)) {
    return childrenToText((children as any).props?.children);
  }
  return "";
}

type TocItem = { depth: number; text: string; id: string };
type TocNode = TocItem & { children: TocNode[] };

function buildTocTree(items: TocItem[]) {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];

  for (const item of items) {
    const node: TocNode = { ...item, children: [] };

    while (stack.length && item.depth <= stack[stack.length - 1].depth) {
      stack.pop();
    }

    if (stack.length === 0) root.push(node);
    else stack[stack.length - 1].children.push(node);

    stack.push(node);
  }

  return root;
}

function TocList({ nodes, level = 0 }: { nodes: TocNode[]; level?: number }) {
  return (
    <ul
      className={[
        "space-y-2",
        level === 0 ? "list-disc pl-6" : "list-[circle] pl-6",
        "marker:text-muted-foreground",
      ].join(" ")}
    >
      {nodes.map((n) => (
        <li key={n.id}>
          <a href={`#${n.id}`} className="text-muted-foreground hover:text-link-hover">
            {n.text}
          </a>

          {n.children.length > 0 && (
            <div className="mt-2">
              <TocList nodes={n.children} level={level + 1} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const blog = slug ? getBlogBySlug(slug) : undefined;

  if (!blog) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Blog not found</h1>
          <p className="text-muted-foreground">
            The blog you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/blogs" className="text-link-hover hover:underline">
            Back to blogs
          </Link>
        </div>
      </main>
    );
  }

  const markdown = useMemo(() => normalizeEmbeds(blog.content), [blog.content]);
  const toc = useMemo(() => extractToc(markdown, blog.title), [blog.title, markdown]);
  const tocTree = useMemo(() => buildTocTree(toc), [toc]);

  // Minimal TOC UX: collapsed by default on mobile, open by default on desktop
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const mq =
      typeof window !== "undefined" ? window.matchMedia?.("(min-width: 768px)") : null;
    const setFromMq = () => setIsTocOpen(Boolean(mq?.matches));
    setFromMq();
    mq?.addEventListener?.("change", setFromMq);
    return () => mq?.removeEventListener?.("change", setFromMq);
  }, []);

  const tocIdsByKey = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const item of toc) {
      const key = `${item.depth}|${item.text}`;
      const existing = map.get(key);
      if (existing) existing.push(item.id);
      else map.set(key, [item.id]);
    }
    return map;
  }, [toc]);

  const fallbackSlugger = createSlugger();
  const tocCursor = new Map<string, number>();
  const tocIdFor = (depth: number, text: string) => {
    const key = `${depth}|${text}`;
    const ids = tocIdsByKey.get(key);
    if (!ids || ids.length === 0) return undefined;
    const index = tocCursor.get(key) ?? 0;
    tocCursor.set(key, index + 1);
    return ids[index] ?? ids[ids.length - 1];
  };

  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;

    const attempt = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      return true;
    };

    if (attempt()) return;
    const t1 = window.setTimeout(attempt, 0);
    const t2 = window.setTimeout(attempt, 50);
    const t3 = window.setTimeout(attempt, 250);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [location.hash, markdown]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8">
        <Link to="/blogs" className="text-sm text-muted-foreground hover:text-link-hover">
          ← Back to blogs
        </Link>
      </div>

      <header className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {blog.title}
          </h1>
          <span className="text-sm text-muted-foreground">{formatBlogDate(blog.date)}</span>
        </div>

        {blog.description && (
          <p className="text-base md:text-lg text-muted-foreground">{blog.description}</p>
        )}

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="mt-4 w-full max-h-[28rem] object-cover rounded-xl"
            loading="lazy"
          />
        )}
      </header>

      {toc.length > 0 && (
        <nav aria-label="Table of contents" className="mt-8">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <button
              type="button"
              aria-expanded={isTocOpen}
              aria-controls="blog-toc-items"
              onClick={() => setIsTocOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 text-left text-base font-semibold text-foreground"
            >
              <span>Table of Contents</span>
              <span className="text-muted-foreground">
                {isTocOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </span>
            </button>

            {isTocOpen && (
              <div id="blog-toc-items" className="mt-4">
                <TocList nodes={tocTree} />
              </div>
            )}
          </div>
        </nav>
      )}

      <section className="mt-10">
        <div
          className={[
            "prose prose-zinc dark:prose-invert max-w-none",
            "prose-headings:scroll-mt-24",
            "prose-a:font-medium prose-a:underline prose-a:underline-offset-4",
            "prose-img:rounded-xl",
            "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4",
            "prose-code:before:content-none prose-code:after:content-none prose-code:text-zinc-800 dark:prose-code:text-zinc-200",
          ].join(" ")}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ children, ...props }) => {
                const href = typeof props.href === "string" ? props.href : "";
                const isExternal = /^https?:\/\//i.test(href);
                return (
                  <a
                    {...props}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                );
              },
              img: ({ src, ...props }) => {
                const baseSrc =
                  src && src.startsWith("/")
                    ? `${import.meta.env.BASE_URL}${src.slice(1)}`
                    : src;
                return <img {...props} src={baseSrc} loading="lazy" />;
              },
              h1: ({ children, ...props }) => {
                const text = plainText(childrenToText(children));
                const id = tocIdFor(1, text) ?? fallbackSlugger.slug(text);
                return (
                  <h1 {...props} id={id}>
                    {children}
                  </h1>
                );
              },
              h2: ({ children, ...props }) => {
                const text = plainText(childrenToText(children));
                const id = tocIdFor(2, text) ?? fallbackSlugger.slug(text);
                return (
                  <h2 {...props} id={id}>
                    {children}
                  </h2>
                );
              },
              h3: ({ children, ...props }) => {
                const text = plainText(childrenToText(children));
                const id = tocIdFor(3, text) ?? fallbackSlugger.slug(text);
                return (
                  <h3 {...props} id={id}>
                    {children}
                  </h3>
                );
              },
              code: ({ className, children, ...props }) => {
                const isGist =
                  typeof className === "string" && className.includes("language-gist");

                if (isGist) {
                  const src = String(children).trim();
                  return (
                    <div className="not-prose my-4">
                      <GistEmbed src={src} />
                    </div>
                  );
                }

                return (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </section>
    </main>
  );
}
