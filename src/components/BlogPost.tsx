import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { loadBlogPost } from "../utils/blogUtils";
import "highlight.js/styles/github.css";

interface BlogPostData {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) {
        setError("No blog post specified");
        setLoading(false);
        return;
      }

      try {
        const result = await loadBlogPost(slug);
        if (!result) {
          throw new Error("Blog post not found");
        }
        
        const { data, content } = result;
        setPost({
          title: (data.title as string) || 'Untitled',
          date: (data.date as string) || '',
          excerpt: (data.excerpt as string) || '',
          tags: (data.tags as string[]) || [],
          content
        });
      } catch (error) {
        console.error('Error loading blog post:', error);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading blog post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested blog post could not be found."}</p>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
          ← Back to Blog
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 mb-4 text-gray-600">
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              
              {post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {post.excerpt && (
              <p className="text-xl text-gray-700 italic border-l-4 border-blue-500 pl-4">
                {post.excerpt}
              </p>
            )}
          </header>
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>;
                  }
                  return <code className={className}>{children}</code>;
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;