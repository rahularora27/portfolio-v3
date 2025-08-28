
export interface BlogPost {
  title: string;
  date: string;
  url: string;
}


const parseXML = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  return xmlDoc;
};

const extractTextContent = (element: Element | null): string => {
  if (!element) return '';
  return element.textContent || '';
};

const fetchMediumPosts = async (username: string): Promise<BlogPost[]> => {
  try {
    console.log('Fetching Medium posts for:', username);
    
    // Try multiple proxy services
    const proxyUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://medium.com/feed/@${username}`)}`,
      `https://corsproxy.io/?${encodeURIComponent(`https://medium.com/feed/@${username}`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://medium.com/feed/@${username}`)}`
    ];
    
    for (const proxyUrl of proxyUrls) {
      try {
        console.log('Trying proxy:', proxyUrl);
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const xmlText = await response.text();
        const xmlDoc = parseXML(xmlText);
        
        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          throw new Error('XML parsing failed');
        }
        
        const items = xmlDoc.querySelectorAll('item');
        console.log('Found items:', items.length);
        
        if (items.length > 0) {
          const posts: BlogPost[] = [];
          
          items.forEach((item) => {
            const title = extractTextContent(item.querySelector('title'));
            const link = extractTextContent(item.querySelector('link'));
            const pubDate = extractTextContent(item.querySelector('pubDate'));
            posts.push({
              title: title || 'Untitled',
              date: pubDate || '',
              url: link
            });
          });
          
          console.log('Successfully parsed posts:', posts.length);
          return posts;
        }
      } catch (proxyError) {
        console.warn('Proxy failed:', proxyUrl, proxyError);
        continue;
      }
    }
    
    throw new Error('All proxies failed');
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
};

export const loadBlogPosts = async (mediumUsername: string): Promise<BlogPost[]> => {
  const mediumPosts = await fetchMediumPosts(mediumUsername);
  // Sort by date, newest first
  return mediumPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

