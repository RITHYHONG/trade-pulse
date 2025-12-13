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
      className={`inline-block bg-gray-100 text-center align-middle ${rest.className ?? ''}`}
      style={rest.style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Image 
          src={ERROR_IMG_SRC} 
          alt="Error loading image" 
          {...imageProps} 
          data-original-url={src} 
        />
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
