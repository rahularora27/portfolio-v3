import { useState, useEffect } from "react";
import { loadBlogPosts, type BlogPost } from "@/lib/blogUtils";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await loadBlogPosts('rahularora2715');
        setPosts(blogPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Blog</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No blog posts found.</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Add markdown files to the public/blog directory to get started!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <article key={post.url || index} className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                  <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    {post.title}
                    <span className="text-sm ml-2 text-gray-500 dark:text-gray-400">↗</span>
                  </h2>
                </a>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;