import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // If no authorId, just use fallback
    if (!authorId) {
      setAuthorProfile(fallbackAuthor);
      return;
    }

    // Check cache first
    const now = Date.now();
    const cached = profileCache.get(authorId);
    const cacheTime = cacheTimestamps.get(authorId);
    
    if (cached && cacheTime && (now - cacheTime) < CACHE_DURATION) {
      setAuthorProfile({
        name: cached.displayName || fallbackAuthor.name,
        avatar: cached.photoURL || fallbackAuthor.avatar,
        avatarUrl: cached.photoURL || fallbackAuthor.avatarUrl,
        bio: fallbackAuthor.bio,
        role: fallbackAuthor.role
      });
      return;
    }

    // Fetch profile from Firestore
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getUserProfile(authorId)
      .then((profile) => {
        if (cancelled) return;

        // Cache the result
        profileCache.set(authorId, profile);
        cacheTimestamps.set(authorId, now);

        if (profile) {
          setAuthorProfile({
            name: profile.displayName || fallbackAuthor.name,
            avatar: profile.photoURL || fallbackAuthor.avatar,
            avatarUrl: profile.photoURL || fallbackAuthor.avatarUrl,
            bio: fallbackAuthor.bio,
            role: fallbackAuthor.role
          });
        } else {
          setAuthorProfile(fallbackAuthor);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setAuthorProfile(fallbackAuthor);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authorId, fallbackAuthor]);

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