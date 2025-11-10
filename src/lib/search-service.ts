import { 
  collection, 
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { BlogPost } from './blog-firestore-service';
import { UserProfile } from './firestore-service';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'blog' | 'page' | 'feature' | 'user';
  href: string;
  date?: string;
  category?: string;
  score?: number;
  metadata?: {
    author?: string;
    tags?: string[];
    asset?: string;
    sentiment?: string;
  };
}

export interface SearchOptions {
  maxResults?: number;
  includeTypes?: ('blog' | 'page' | 'feature' | 'user')[];
  sortBy?: 'relevance' | 'date' | 'title';
}

/**
 * Search blog posts in Firestore
 */
async function searchBlogPosts(searchTerm: string, maxResults = 10): Promise<SearchResult[]> {
  try {
    const postsRef = collection(db, 'posts');
    const results: SearchResult[] = [];

    // Search by title (case-insensitive)
    const titleQuery = query(
      postsRef,
      where('isDraft', '==', false),
      orderBy('publishedAt', 'desc'),
      limit(maxResults)
    );

    const titleSnapshot = await getDocs(titleQuery);
    
    titleSnapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() } as BlogPost;
      
      // Check if search term matches title, content, tags, or category
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = post.title?.toLowerCase().includes(searchLower);
      const contentMatch = post.content?.toLowerCase().includes(searchLower);
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      const categoryMatch = post.category?.toLowerCase().includes(searchLower);
      const assetMatch = post.primaryAsset?.toLowerCase().includes(searchLower) ||
                        post.relatedAssets?.some(asset => asset.toLowerCase().includes(searchLower));

      if (titleMatch || contentMatch || tagMatch || categoryMatch || assetMatch) {
        let score = 0;
        if (titleMatch) score += 10;
        if (contentMatch) score += 5;
        if (tagMatch) score += 8;
        if (categoryMatch) score += 6;
        if (assetMatch) score += 7;

        const publishedDate = post.publishedAt instanceof Date 
          ? post.publishedAt 
          : post.publishedAt?.toDate?.() || new Date();

        results.push({
          id: post.id || doc.id,
          title: post.title || 'Untitled',
          description: post.metaDescription || post.content?.substring(0, 200) + '...' || '',
          type: 'blog',
          href: `/blog/${post.slug || post.id}`,
          date: formatRelativeDate(publishedDate),
          category: post.category || 'Article',
          score,
          metadata: {
            author: post.authorName,
            tags: post.tags,
            asset: post.primaryAsset,
            sentiment: post.sentiment
          }
        });
      }
    });

    return results.sort((a, b) => (b.score || 0) - (a.score || 0));
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

/**
 * Search users in Firestore
 */
async function searchUsers(searchTerm: string, maxResults = 5): Promise<SearchResult[]> {
  try {
    const usersRef = collection(db, 'users');
    const results: SearchResult[] = [];

    // Get all users (we'll filter client-side since Firestore doesn't support full-text search)
    const usersQuery = query(usersRef, limit(maxResults * 2));
    const usersSnapshot = await getDocs(usersQuery);
    
    usersSnapshot.forEach((doc) => {
      const user = { id: doc.id, ...doc.data() } as unknown as UserProfile;
      
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = user.displayName?.toLowerCase().includes(searchLower);
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      const bioMatch = user.bio?.toLowerCase().includes(searchLower);

      if (nameMatch || emailMatch || bioMatch) {
        let score = 0;
        if (nameMatch) score += 10;
        if (emailMatch) score += 8;
        if (bioMatch) score += 5;

        results.push({
          id: user.uid,
          title: user.displayName || 'Anonymous User',
          description: user.bio || user.email || 'Trade Pulse User',
          type: 'user',
          href: `/profile/${user.uid}`,
          category: 'User',
          score
        });
      }
    });

    return results
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, maxResults);
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Get static page results (features, tools, etc.)
 */
function getStaticResults(searchTerm: string): SearchResult[] {
  const staticPages = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Access your trading dashboard with real-time market data and insights.',
      type: 'page' as const,
      href: '/dashboard',
      category: 'Tools'
    },
    {
      id: 'create-post',
      title: 'Create Post',
      description: 'Create and publish trading insights and market analysis.',
      type: 'feature' as const,
      href: '/create-post',
      category: 'Content'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage your account preferences and notification settings.',
      type: 'page' as const,
      href: '/settings',
      category: 'Account'
    },
    {
      id: 'blog',
      title: 'Trading Blog',
      description: 'Read the latest trading insights and market analysis.',
      type: 'page' as const,
      href: '/blog',
      category: 'Content'
    },
    {
      id: 'pre-market',
      title: 'Pre-Market Analysis',
      description: 'Get pre-market insights and trading opportunities.',
      type: 'feature' as const,
      href: '/dashboard',
      category: 'Analysis'
    },
    {
      id: 'alerts',
      title: 'Trading Alerts',
      description: 'Set up and manage your trading alerts and notifications.',
      type: 'feature' as const,
      href: '/dashboard',
      category: 'Tools'
    }
  ];

  const searchLower = searchTerm.toLowerCase();
  
  return staticPages
    .filter(page => 
      page.title.toLowerCase().includes(searchLower) ||
      page.description.toLowerCase().includes(searchLower) ||
      page.category.toLowerCase().includes(searchLower)
    )
    .map(page => ({
      ...page,
      score: page.title.toLowerCase().includes(searchLower) ? 10 : 5
    }));
}

/**
 * Main search function that combines all search sources
 */
export async function searchDatabase(
  searchTerm: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const {
    maxResults = 20,
    includeTypes = ['blog', 'page', 'feature', 'user'],
    sortBy = 'relevance'
  } = options;

  if (!searchTerm.trim()) {
    return [];
  }

  try {
    const allResults: SearchResult[] = [];

    // Search blog posts
    if (includeTypes.includes('blog')) {
      const blogResults = await searchBlogPosts(searchTerm, Math.ceil(maxResults * 0.6));
      allResults.push(...blogResults);
    }

    // Search users
    if (includeTypes.includes('user')) {
      const userResults = await searchUsers(searchTerm, Math.ceil(maxResults * 0.2));
      allResults.push(...userResults);
    }

    // Search static pages and features
    if (includeTypes.includes('page') || includeTypes.includes('feature')) {
      const staticResults = getStaticResults(searchTerm);
      const filteredStatic = staticResults.filter(result => 
        includeTypes.includes(result.type)
      );
      allResults.push(...filteredStatic);
    }

    // Sort results
    let sortedResults = allResults;
    
    switch (sortBy) {
      case 'relevance':
        sortedResults = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'date':
        sortedResults = allResults.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'title':
        sortedResults = allResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return sortedResults.slice(0, maxResults);
  } catch (error) {
    console.error('Error performing database search:', error);
    return [];
  }
}

/**
 * Get recent popular searches from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading recent searches:', error);
    return [];
  }
}

/**
 * Save search to recent searches
 */
export function saveRecentSearch(searchTerm: string): void {
  if (typeof window === 'undefined' || !searchTerm.trim()) return;
  
  try {
    const recent = getRecentSearches();
    const updated = [searchTerm, ...recent.filter(s => s !== searchTerm)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('recent_searches');
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 7) {
    return date.toLocaleDateString();
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Get trending or popular search suggestions
 */
export function getSearchSuggestions(): string[] {
  return [
    'Bitcoin analysis',
    'Trading strategies',
    'Market sentiment',
    'Pre-market data',
    'Cryptocurrency trends',
    'Risk management',
    'Technical analysis',
    'Options trading'
  ];
}