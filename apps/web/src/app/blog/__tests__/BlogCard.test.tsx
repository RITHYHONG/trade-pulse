import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock next/link to render children directly
vi.mock('next/link', () => ({ default: ({ children }: any) => children }));
// Mock ImageWithFallback to render a simple img
vi.mock('../../figma/ImageWithFallback', () => ({ ImageWithFallback: (props: any) => <img src={props.src} alt={props.alt} /> }));

import { BlogCard } from '../BlogCard';

const mockPost = {
  id: '1',
  slug: 'test-post',
  title: 'Test Post',
  excerpt: 'This is a test excerpt',
  publishedAt: new Date().toISOString(),
  category: 'News',
  featuredImage: '/test.jpg',
  author: { name: 'Alice', avatar: '/a.jpg', avatarUrl: '/a.jpg' },
  primaryAsset: 'BTC',
  confidenceLevel: 72,
} as any;

describe('BlogCard', () => {
  it('renders primary asset and confidence badge', () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText('BTC')).toBeTruthy();
    expect(screen.getByText('72%')).toBeTruthy();
  });
});
