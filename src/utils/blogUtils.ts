import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

// Function to get all blog post files
// This is a simple implementation that requires manual updating of the file list
// In a real application, you might use a build-time plugin to generate this list
const getBlogFileNames = async (): Promise<string[]> => {
  // This would ideally be generated at build time
  // For now, we'll try to fetch a few common patterns and handle errors gracefully
  const possibleFiles = [
    'first-post.md',
    'second-post.md',
    // Add more files here as you create them
  ];
  
  const existingFiles: string[] = [];
  
  for (const filename of possibleFiles) {
    try {
      const response = await fetch(`/blog/${filename}`, { method: 'HEAD' });
      if (response.ok) {
        existingFiles.push(filename);
      }
    } catch {
      // File doesn't exist, skip it
      continue;
    }
  }
  
  return existingFiles;
};

export const loadBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const fileNames = await getBlogFileNames();
    const blogPosts: BlogPost[] = [];

    for (const filename of fileNames) {
      try {
        const response = await fetch(`/blog/${filename}`);
        if (!response.ok) continue;
        
        const content = await response.text();
        const { data } = matter(content);
        
        blogPosts.push({
          slug: filename.replace('.md', ''),
          title: data.title || 'Untitled',
          date: data.date || '',
          excerpt: data.excerpt || '',
          tags: data.tags || []
        });
      } catch (error) {
        console.error(`Error loading ${filename}:`, error);
      }
    }

    // Sort by date, newest first
    return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
};

export const loadBlogPost = async (slug: string): Promise<{ data: Record<string, unknown>; content: string } | null> => {
  try {
    const response = await fetch(`/blog/${slug}.md`);
    if (!response.ok) {
      return null;
    }
    
    const markdown = await response.text();
    return matter(markdown);
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
};