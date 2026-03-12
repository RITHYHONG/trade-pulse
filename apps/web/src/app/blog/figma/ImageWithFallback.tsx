"use client";

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZWRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, width, height, fill, ...rest } = props

  // Handle empty or undefined src
  const shouldShowError = didError || !src || src === '';

  const imageProps: Partial<ImageProps & { fill?: boolean; width?: number; height?: number }> = {
    ...rest,
    onError: handleError,
  };

  if (fill) {
    imageProps.fill = true;
  } else {
    const w = typeof width === 'string' ? parseInt(width as string, 10) : (width as number | undefined);
    const h = typeof height === 'string' ? parseInt(height as string, 10) : (height as number | undefined);
    imageProps.width = w ?? 88;
    imageProps.height = h ?? 88;
  }

  return shouldShowError ? (
    <div
      className={`inline-block bg-muted/20 text-center align-middle ring-1 ring-border/20 ${rest.className ?? ''}`}
      style={rest.style}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4">
        {/* Placeholder SVG */}
        <div className="opacity-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </div>
        <div className="text-[10px] text-muted-foreground/40 font-mono truncate max-w-full px-2" title={src}>
          {src ? (src.length > 30 ? src.substring(0, 27) + '...' : src) : 'No Image Source'}
        </div>
      </div>
    </div>
  ) : (
    <Image 
      src={src} 
      alt={alt} 
      {...imageProps}
    />
  )
}
