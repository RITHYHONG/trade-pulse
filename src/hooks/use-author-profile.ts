import { useState, useEffect, useCallback } from 'react';
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

  const fetchAuthorProfile = useCallback(async () => {
    if (!authorId) {
      console.log('No authorId provided, using fallback author');
      setAuthorProfile(fallbackAuthor);
      return;
    }

    console.log('Fetching author profile for ID:', authorId);

    // Check cache first
    const now = Date.now();
    const cached = profileCache.get(authorId);
    const cacheTime = cacheTimestamps.get(authorId);
    
    if (cached && cacheTime && (now - cacheTime) < CACHE_DURATION) {
      console.log('Using cached profile for:', authorId);
      setAuthorProfile({
        name: cached.displayName || fallbackAuthor.name,
        avatar: cached.photoURL || fallbackAuthor.avatar,
        avatarUrl: cached.photoURL || fallbackAuthor.avatarUrl,
        bio: fallbackAuthor.bio,
        role: fallbackAuthor.role
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling getUserProfile for:', authorId);
      const profile = await getUserProfile(authorId);
      console.log('Profile fetched:', profile);
      
      // Cache the result (even if null)
      profileCache.set(authorId, profile);
      cacheTimestamps.set(authorId, now);

      if (profile) {
        const updatedProfile = {
          name: profile.displayName || fallbackAuthor.name,
          avatar: profile.photoURL || fallbackAuthor.avatar,
          avatarUrl: profile.photoURL || fallbackAuthor.avatarUrl,
          bio: fallbackAuthor.bio,
          role: fallbackAuthor.role
        };
        console.log('Setting updated profile:', updatedProfile);
        setAuthorProfile(updatedProfile);
      } else {
        console.log('No profile found, using fallback');
        setAuthorProfile(fallbackAuthor);
      }
    } catch (err) {
      console.error('Failed to fetch author profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setAuthorProfile(fallbackAuthor);
    } finally {
      setIsLoading(false);
    }
  }, [authorId, fallbackAuthor]);

  useEffect(() => {
    fetchAuthorProfile();
  }, [fetchAuthorProfile]);

  return {
    authorProfile,
    isLoading,
    error,
    refetch: fetchAuthorProfile
  };
}

// Utility function to clear cache (useful for testing or when user logs out)
export function clearAuthorProfileCache() {
  profileCache.clear();
  cacheTimestamps.clear();
}