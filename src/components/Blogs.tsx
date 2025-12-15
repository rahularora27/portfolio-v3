import { Link } from "react-router-dom";
import { formatBlogDate, getAllBlogSummaries } from "../lib/blog";

export default function Blogs() {
  const blogs = getAllBlogSummaries();

  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 text-center">
            No blogs yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                to={`/blogs/${blog.slug}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                )}

                <div className="p-6 space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {blog.title}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatBlogDate(blog.date)}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {blog.description}
                  </p>

                  <span className="inline-block text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                    Read More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

