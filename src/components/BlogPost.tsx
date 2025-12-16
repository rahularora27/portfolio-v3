import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useLocation, useParams } from "react-router-dom";
import { formatBlogDate, getBlogBySlug } from "../lib/blog";
import GistEmbed from "./GistEmbed";
import { useEffect, useMemo } from "react";

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const blog = slug ? getBlogBySlug(slug) : undefined;

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center flex-grow p-6">
        <div className="w-full max-w-2xl text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Blog Not Found
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            The blog you're looking for doesn't exist.
          </p>
          <Link
            to="/blogs"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const markdown = useMemo(() => normalizeEmbeds(blog.content), [blog.content]);
  const toc = useMemo(() => extractToc(markdown, blog.title), [blog.title, markdown]);

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
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <article className="w-full max-w-4xl space-y-6">
        <Link
          to="/blogs"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Blogs
        </Link>

        <div className="space-y-4 rounded-xl border border-border bg-card text-card-foreground p-6 md:p-10">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {blog.title}
              </h1>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatBlogDate(blog.date)}
              </span>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {blog.description}
            </p>
          </div>

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-96 object-cover rounded-lg border border-border"
              loading="lazy"
            />
          )}

          {toc.length > 0 && (
            <nav
              aria-label="Table of contents"
              className="rounded-lg border border-border bg-muted/30 p-4"
            >
              <div className="text-sm font-semibold text-foreground">On this page</div>
              <ul className="mt-3 space-y-1 text-sm">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={
                      item.depth === 1
                        ? ""
                        : item.depth === 2
                          ? "ml-3"
                          : "ml-6"
                    }
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-pre:p-4 prose-code:before:content-none prose-code:after:content-none prose-img:rounded-lg prose-img:border prose-img:border-border">
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
                img: ({ ...props }) => <img {...props} loading="lazy" />,
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
                    typeof className === "string" &&
                    className.includes("language-gist");

                  if (isGist) {
                    const src = String(children).trim();
                    return <GistEmbed src={src} />;
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
        </div>
      </article>
    </div>
  );
}
