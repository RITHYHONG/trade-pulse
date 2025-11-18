import { useState, useEffect, useRef } from 'react';
import { getUserProfile, UserProfile } from '@/lib/firestore-service';
import { BlogAuthor } from '@/types/blog';

// Simple in-memory cache for user profiles
const profileCache = new Map<string, UserProfile | null>();
const cacheTimestamps = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseAuthorProfileOptions {
  authorId?: string;
  fallbackAuthor: BlogAuthor;
}

export function useAuthorProfile({ authorId, fallbackAuthor }: UseAuthorProfileOptions) {
  const [authorProfile, setAuthorProfile] = useState<BlogAuthor>(fallbackAuthor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);
  const fallbackRef = useRef(fallbackAuthor);

  // Update fallback ref when it changes
  useEffect(() => {
    fallbackRef.current = fallbackAuthor;
  }, [fallbackAuthor]);

  useEffect(() => {
    // Prevent duplicate fetches for the same authorId
    if (!authorId || fetchedRef.current === authorId) {
      if (!authorId) {
        setAuthorProfile(fallbackRef.current);
      }
      return;
    }

    const fetchAuthorProfile = async () => {
      const fallback = fallbackRef.current;
      
      // Check cache first
      const now = Date.now();
      const cached = profileCache.get(authorId);
      const cacheTime = cacheTimestamps.get(authorId);
      
      if (cached && cacheTime && (now - cacheTime) < CACHE_DURATION) {
        setAuthorProfile({
          name: cached.displayName || fallback.name,
          avatar: cached.photoURL || fallback.avatar,
          avatarUrl: cached.photoURL || fallback.avatarUrl,
          bio: fallback.bio,
          role: fallback.role
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const profile = await getUserProfile(authorId);
        
        // Cache the result (even if null)
        profileCache.set(authorId, profile);
        cacheTimestamps.set(authorId, now);

        if (profile) {
          setAuthorProfile({
            name: profile.displayName || fallback.name,
            avatar: profile.photoURL || fallback.avatar,
            avatarUrl: profile.photoURL || fallback.avatarUrl,
            bio: fallback.bio,
            role: fallback.role
          });
        } else {
          setAuthorProfile(fallback);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setAuthorProfile(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchedRef.current = authorId;
    fetchAuthorProfile();
  }, [authorId]);

  return {
    authorProfile,
    isLoading,
    error
  };
}

// Utility function to clear cache (useful for testing or when user logs out)
export function clearAuthorProfileCache() {
  profileCache.clear();
  cacheTimestamps.clear();
}