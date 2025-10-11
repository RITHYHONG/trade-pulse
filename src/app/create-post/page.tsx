"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { X, Plus, Save, Eye, ArrowLeft } from 'lucide-react';
import { BlogPost as BlogPostType } from '../../types/blog';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomBreadcrumb } from '@/components/navigation/Breadcrumb';

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Daily Recaps' as BlogPostType['category'],
    authorName: '',
    authorAvatar: '',
    authorBio: '',
    publishDate: new Date().toISOString().split('T')[0],
    readTime: '',
    featuredImage: '',
    isFeatured: false,
    tags: [] as string[],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Please enter an excerpt');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter content');
      return;
    }
    if (!formData.authorName.trim()) {
      toast.error('Please enter author name');
      return;
    }
    if (!formData.featuredImage.trim()) {
      toast.error('Please enter a featured image URL');
      return;
    }
    if (!formData.readTime.trim()) {
      toast.error('Please enter read time');
      return;
    }

    const newPost: BlogPostType = {
      id: Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      author: {
        name: formData.authorName,
        avatar: formData.authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: formData.authorBio || 'Contributing writer at Trader Puls',
      },
      publishDate: formData.publishDate,
      readTime: formData.readTime,
      featuredImage: formData.featuredImage,
      isFeatured: formData.isFeatured,
      tags: formData.tags,
    };

    // In a real app, you would save this to your database
    console.log('New post created:', newPost);
    toast.success('Post created successfully!');
    
    // Navigate back to blog
    router.push('/blog');
    toast.success('Post created successfully!');
    
    // Reset form
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Daily Recaps',
      authorName: '',
      authorAvatar: '',
      authorBio: '',
      publishDate: new Date().toISOString().split('T')[0],
      readTime: '',
      featuredImage: '',
      isFeatured: false,
      tags: [],
    });
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-[#0F1116] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => setShowPreview(false)}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          </div>

          {/* Preview Content */}
          <article className="bg-[#1A1D28] rounded-xl overflow-hidden">
            {formData.featuredImage && (
              <div className="aspect-[21/9] w-full overflow-hidden">
                <ImageWithFallback
                  src={formData.featuredImage}
                  alt={formData.title || 'Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#00F5FF]/10 text-[#00F5FF] rounded-full text-sm">
                  {formData.category}
                </span>
                {formData.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="mb-4">{formData.title || 'Untitled Post'}</h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  {formData.authorAvatar && (
                    <ImageWithFallback
                      src={formData.authorAvatar}
                      alt={formData.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{formData.authorName || 'Anonymous'}</span>
                </div>
                <span>•</span>
                <span>{formData.publishDate}</span>
                <span>•</span>
                <span>{formData.readTime || '0 min read'}</span>
              </div>

              <p className="text-gray-300 mb-6">{formData.excerpt}</p>

              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{formData.content}</div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-700">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1116] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <CustomBreadcrumb className="mb-6" />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/blog">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <h1>Create New Post</h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#00F5FF] text-black hover:bg-[#00F5FF]/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Publish Post
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <Label htmlFor="title" className="text-gray-300 mb-2 block">
                Post Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter an engaging title for your post..."
                className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
              />
            </Card>

            {/* Excerpt */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <Label htmlFor="excerpt" className="text-gray-300 mb-2 block">
                Excerpt *
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief summary that appears in post listings..."
                rows={3}
                className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
              />
            </Card>

            {/* Content */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <Label htmlFor="content" className="text-gray-300 mb-2 block">
                Post Content * (Markdown supported)
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your post content here. You can use markdown formatting..."
                rows={20}
                className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Use markdown syntax for headings (#), lists (-), and formatting (**bold**)
              </p>
            </Card>

            {/* Author Information */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <h3 className="mb-4">Author Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="authorName" className="text-gray-300 mb-2 block">
                    Author Name *
                  </Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => handleInputChange('authorName', e.target.value)}
                    placeholder="Full name"
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="authorAvatar" className="text-gray-300 mb-2 block">
                    Author Avatar URL
                  </Label>
                  <Input
                    id="authorAvatar"
                    value={formData.authorAvatar}
                    onChange={(e) => handleInputChange('authorAvatar', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="authorBio" className="text-gray-300 mb-2 block">
                    Author Bio
                  </Label>
                  <Textarea
                    id="authorBio"
                    value={formData.authorBio}
                    onChange={(e) => handleInputChange('authorBio', e.target.value)}
                    placeholder="Short bio or credentials..."
                    rows={2}
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <h3 className="mb-4">Publishing</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-gray-300 mb-2 block">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value as BlogPostType['category'])}
                  >
                    <SelectTrigger className="bg-[#0F1116] border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D28] border-gray-700">
                      <SelectItem value="Daily Recaps">Daily Recaps</SelectItem>
                      <SelectItem value="Weekly Deep Dives">Weekly Deep Dives</SelectItem>
                      <SelectItem value="How-To Guides">How-To Guides</SelectItem>
                      <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="publishDate" className="text-gray-300 mb-2 block">
                    Publish Date *
                  </Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="bg-[#0F1116] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="readTime" className="text-gray-300 mb-2 block">
                    Read Time *
                  </Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange('readTime', e.target.value)}
                    placeholder="e.g., 5 min read"
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="isFeatured" className="text-gray-300">
                    Featured Post
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                </div>
              </div>
            </Card>

            {/* Featured Image */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <h3 className="mb-4">Featured Image</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="featuredImage" className="text-gray-300 mb-2 block">
                    Image URL *
                  </Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                {formData.featuredImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700">
                    <ImageWithFallback
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card className="bg-[#1A1D28] border-gray-800 p-6">
              <h3 className="mb-4">Tags</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="icon"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#00F5FF]/10 text-[#00F5FF] rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
