"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
      postId: string;
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
      const hasTracked = useRef(false);

      useEffect(() => {
            if (hasTracked.current) return;

            const trackView = async () => {
                  try {
                        await fetch("/api/blog/view", {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ postId }),
                        });
                        hasTracked.current = true;
                  } catch (error) {
                        console.error("Failed to track view:", error);
                  }
            };

            // Track after a small delay to ensure it's a real view
            const timer = setTimeout(() => {
                  trackView();
            }, 2000);

            return () => clearTimeout(timer);
      }, [postId]);

      return null;
}
