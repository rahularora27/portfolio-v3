import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { formatBlogDate, getBlogBySlug } from "../lib/blog";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
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

  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-4xl space-y-6">
        <Link
          to="/blogs"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Blogs
        </Link>

        <div className="space-y-4">
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
              className="w-full max-h-96 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              loading="lazy"
            />
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ children, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                ),
                img: ({ ...props }) => (
                  <img
                    {...props}
                    className="rounded-lg border border-gray-200 dark:border-gray-700"
                    loading="lazy"
                  />
                ),
                h1: ({ children, ...props }) => (
                  <h1
                    {...props}
                    className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4"
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2
                    {...props}
                    className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3"
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3
                    {...props}
                    className="text-xl font-medium text-gray-900 dark:text-white mt-4 mb-2"
                  >
                    {children}
                  </h3>
                ),
                ul: ({ children, ...props }) => (
                  <ul {...props} className="list-disc pl-6">
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol {...props} className="list-decimal pl-6">
                    {children}
                  </ol>
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

