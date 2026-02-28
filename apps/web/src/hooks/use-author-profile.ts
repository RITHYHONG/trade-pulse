import { useState, useEffect } from "react";
import { getUserProfile, UserProfile } from "@/lib/firestore-service";
import { BlogAuthor } from "@/types/blog";

// Simple in-memory cache for user profiles
const profileCache = new Map<string, UserProfile | null>();
const cacheTimestamps = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const LOCAL_STORAGE_PREFIX = "authorProfile_";
const LOCAL_STORAGE_DURATION = 60 * 60 * 1000; // 1 hour

interface UseAuthorProfileOptions {
  authorId?: string;
  fallbackAuthor: BlogAuthor;
}

export function useAuthorProfile({
  authorId,
  fallbackAuthor,
}: UseAuthorProfileOptions) {
  const [authorProfile, setAuthorProfile] =
    useState<BlogAuthor>(fallbackAuthor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no authorId, just use fallback
    if (!authorId) {
      setAuthorProfile(fallbackAuthor);
      return;
    }

    // Check localStorage first
    const localStorageKey = `${LOCAL_STORAGE_PREFIX}${authorId}`;
    const cachedData = localStorage.getItem(localStorageKey);
    if (cachedData) {
      try {
        const { profile, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        if (now - timestamp < LOCAL_STORAGE_DURATION) {
          if (profile) {
            setAuthorProfile({
              name: profile.displayName || fallbackAuthor.name,
              avatar: profile.photoURL || fallbackAuthor.avatar,
              avatarUrl: profile.photoURL || fallbackAuthor.avatarUrl,
              bio: fallbackAuthor.bio,
              role: fallbackAuthor.role,
            });
          } else {
            setAuthorProfile(fallbackAuthor);
          }
          return;
        } else {
          // Expired, remove from localStorage
          localStorage.removeItem(localStorageKey);
        }
      } catch (error) {
        console.error("Error parsing cached author profile:", error);
        localStorage.removeItem(localStorageKey);
      }
    }

    // Check in-memory cache
    const now = Date.now();
    const cached = profileCache.get(authorId);
    const cacheTime = cacheTimestamps.get(authorId);

    if (cacheTime && now - cacheTime < CACHE_DURATION) {
      if (cached) {
        setAuthorProfile({
          name: cached.displayName || fallbackAuthor.name,
          avatar: cached.photoURL || fallbackAuthor.avatar,
          avatarUrl: cached.photoURL || fallbackAuthor.avatarUrl,
          bio: fallbackAuthor.bio,
          role: fallbackAuthor.role,
        });
      } else {
        setAuthorProfile(fallbackAuthor);
      }
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

        // Also cache in localStorage
        const localStorageKey = `${LOCAL_STORAGE_PREFIX}${authorId}`;
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            profile,
            timestamp: now,
          }),
        );

        if (profile) {
          setAuthorProfile({
            name: profile.displayName || fallbackAuthor.name,
            avatar: profile.photoURL || fallbackAuthor.avatar,
            avatarUrl: profile.photoURL || fallbackAuthor.avatarUrl,
            bio: fallbackAuthor.bio,
            role: fallbackAuthor.role,
          });
        } else {
          setAuthorProfile(fallbackAuthor);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile",
        );
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
    error,
  };
}

// Utility function to clear cache (useful for testing or when user logs out)
export function clearAuthorProfileCache() {
  profileCache.clear();
  cacheTimestamps.clear();
  // Clear localStorage caches
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}
