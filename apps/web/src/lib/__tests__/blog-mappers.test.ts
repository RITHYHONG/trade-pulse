import { describe, it, expect } from 'vitest';
import { mapFirestoreToUI } from '../blog-mappers';

describe('mapFirestoreToUI', () => {
  it('maps Firestore post to UI format correctly', () => {
    const firestorePost = {
      id: '123',
      slug: 'test-post',
      title: 'Test Title',
      metaDescription: 'Test description',
      content: 'Full content here',
      publishedAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      tags: ['tag1', 'tag2'],
      featuredImage: 'image.jpg',
      authorName: 'John Doe',
      authorAvatar: 'avatar.jpg',
      authorId: 'author123',
      category: 'Stocks',
      views: 100,
      sentiment: 'bullish' as const,
      confidenceLevel: 0.8,
    };

    const uiPost = mapFirestoreToUI(firestorePost);

    expect(uiPost.id).toBe('123');
    expect(uiPost.title).toBe('Test Title');
    expect(uiPost.excerpt).toBe('Test description');
    expect(uiPost.publishedAt).toBe('2023-01-01T00:00:00.000Z');
    expect(uiPost.author.name).toBe('John Doe');
    expect(uiPost.views).toBe(100);
  });

  it('handles missing metaDescription by truncating content', () => {
    const firestorePost = {
      id: '123',
      slug: 'test-post',
      title: 'Test Title',
      content: 'This is a very long content that should be truncated to 160 characters or less for the excerpt.',
      publishedAt: new Date(),
    } as any;

    const uiPost = mapFirestoreToUI(firestorePost);

    expect(uiPost.excerpt.length).toBeLessThanOrEqual(160);
    expect(uiPost.excerpt).toBe('This is a very long content that should be truncated to 160 characters or less for the excerpt.'.substring(0, 160));
  });

  it('handles legacy author structure', () => {
    const firestorePost = {
      id: '123',
      slug: 'test-post',
      title: 'Test Title',
      publishedAt: new Date(),
      author: {
        name: 'Legacy Author',
        avatar: 'legacy-avatar.jpg',
        role: 'admin',
        bio: 'Bio text',
      },
    } as any;

    const uiPost = mapFirestoreToUI(firestorePost);

    expect(uiPost.author.name).toBe('Legacy Author');
    expect(uiPost.author.avatar).toBe('legacy-avatar.jpg');
    expect(uiPost.author.role).toBe('admin');
  });

  it('handles invalid date gracefully', () => {
    const firestorePost = {
      id: '123',
      slug: 'test-post',
      title: 'Test Title',
      publishedAt: 'invalid-date',
    } as any;

    const uiPost = mapFirestoreToUI(firestorePost);

    expect(uiPost.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO string format
  });

  it('provides fallbacks for missing fields', () => {
    const firestorePost = {
      id: '123',
      slug: 'test-post',
      title: 'Test Title',
    } as any;

    const uiPost = mapFirestoreToUI(firestorePost);

    expect(uiPost.excerpt).toBe('');
    expect(uiPost.featuredImage).toBe('/images/placeholder-blog.svg');
    expect(uiPost.author.name).toBe('Anonymous');
    expect(uiPost.views).toBe(0);
  });
});