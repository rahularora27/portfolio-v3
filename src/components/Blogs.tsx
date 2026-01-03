import { Link } from "react-router-dom";
import { formatBlogDate, getAllBlogSummaries } from "../lib/blog";

export default function Blogs() {
  const blogs = getAllBlogSummaries();

  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-4xl space-y-6">
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
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex h-full flex-col"
              >
                <div className="w-full h-44 bg-gray-100 dark:bg-gray-700">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="p-6 flex flex-1 flex-col gap-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[1.75rem_1.75rem] gap-x-3">
                    <h3 className="row-span-2 text-xl font-semibold text-gray-900 dark:text-white leading-7 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {blog.title}
                    </h3>
                    <span className="col-start-2 row-start-1 self-end text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatBlogDate(blog.date)}
                    </span>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed min-h-[3.25rem] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                    {blog.description}
                  </p>

                  <span className="inline-block text-gray-900 dark:text-gray-100 hover:text-link-hover dark:hover:text-link-hover font-medium mt-auto">
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
