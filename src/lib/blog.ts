import matter from "gray-matter";

export type BlogFrontMatter = {
  title: string;
  description: string;
  date: string;
  image?: string;
};

export type BlogPost = BlogFrontMatter & {
  slug: string;
  content: string;
};

export type BlogPostSummary = BlogFrontMatter & {
  slug: string;
};

function withBaseUrl(path: string) {
  const baseUrl = import.meta.env.BASE_URL ?? "/";
  if (!path.startsWith("/")) return path;
  return `${baseUrl}${path.slice(1)}`;
}

function extractSlug(modulePath: string) {
  const filename = modulePath.split("/").pop() ?? modulePath;
  return filename.replace(/\.md$/i, "");
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isValidDateString(value: string) {
  return !Number.isNaN(new Date(value).getTime());
}

const rawBlogModules = import.meta.glob("../content/blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function isBlogPost(value: BlogPost | null): value is BlogPost {
  return value !== null;
}

const allBlogPosts = Object.entries(rawBlogModules)
  .map(([modulePath, rawMarkdown]) => {
    const slug = extractSlug(modulePath);
    const { data, content } = matter(rawMarkdown);

    const title = asString(data.title);
    const description = asString(data.description);
    const date = asString(data.date);
    const image = asString(data.image);

    if (!title || !description || !date || !isValidDateString(date)) {
      console.warn(
        `[blogs] Skipping "${slug}" due to invalid frontmatter (needs title, description, valid date).`,
      );
      return null;
    }

    return {
      slug,
      title,
      description,
      date,
      ...(image ? { image: withBaseUrl(image) } : {}),
      content,
    };
  })
  .filter(isBlogPost)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAllBlogSummaries(): BlogPostSummary[] {
  return allBlogPosts.map(({ slug, title, description, date, image }) => ({
    slug,
    title,
    description,
    date,
    ...(image ? { image } : {}),
  }));
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return allBlogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
