'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  createBlogPost,
  updateBlogPost,
  getBlogPost,
  dataURLtoFile,
  type BlogPost as FirestoreBlogPost
} from '@/lib/blog-firestore-service';
import { tempUploadFeaturedImage as uploadFeaturedImage } from '@/lib/temp-image-upload';
import {
  Save,
  Eye,
  Send,
  Clock,
  Plus,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Scale,
  Image as ImageIcon,
  Share2,
  Users,
  Target,
  Sparkles,
  X,
  Upload,
  GripVertical,
  ClipboardList,
  BarChart3,
  Building2,
  Lightbulb,
  AlertTriangle,
  Globe,
  Zap,
  AlertCircle,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/editor/RichTextEditor';
import styles from './styles.module.css';
import { toast } from 'sonner';

// Types
interface ContentBlock {
  id: string;
  type: 'executive_summary' | 'technical_analysis' | 'fundamental_analysis' | 'trade_idea' | 'risk_assessment' | 'market_context' | 'plain_section';
  content: string;
  metadata?: Record<string, string | number | boolean>;
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  blocks: ContentBlock[];
  primaryAsset: string;
  relatedAssets: string[];
  sentiment: string;
  confidenceLevel: number;
  timeHorizon: string;
  tags: string[];
  category: string;
  metaDescription: string;
  focusKeyword: string;
  featuredImage: string;
  isDraft: boolean;
  scheduledDate?: Date;
}

// Block Type Configurations
const blockTypes = [
  {
    type: 'executive_summary',
    title: 'Key Takeaways',
    icon: ClipboardList,
    color: '#00F5FF',
    fields: ['bullet_points', 'market_impact', 'time_horizon']
  },
  {
    type: 'technical_analysis',
    title: 'Technical Setup',
    icon: BarChart3,
    color: '#0066FF',
    fields: ['chart_analysis', 'key_levels', 'indicators', 'trade_setup']
  },
  {
    type: 'fundamental_analysis',
    title: 'Fundamental Drivers',
    icon: Building2,
    color: '#10B981',
    fields: ['economic_data', 'company_fundamentals', 'market_sentiment']
  },
  {
    type: 'trade_idea',
    title: 'Trade Recommendation',
    icon: Lightbulb,
    color: '#F59E0B',
    fields: ['entry_exit', 'stop_loss', 'targets', 'position_size']
  },
  {
    type: 'risk_assessment',
    title: 'Risk Analysis',
    icon: AlertTriangle,
    color: '#EF4444',
    fields: ['risk_factors', 'hedging_strategies', 'portfolio_impact']
  },
  {
    type: 'market_context',
    title: 'Broader Market View',
    icon: Globe,
    color: '#8B5CF6',
    fields: ['sector_correlation', 'macro_environment', 'global_influences']
  },
  {
    type: 'plain_section',
    title: 'Plain Section (no title)',
    icon: undefined,
    noTitle: true,
    color: '#9CA3AF',
    fields: ['body']
  }
];

const marketCategories = ['Stocks', 'Forex', 'Crypto', 'Commodities', 'Macro'];
const sentimentOptions = ['Strong Bullish', 'Bullish', 'Neutral', 'Bearish', 'Strong Bearish'];
const timeHorizons = ['Intraday', 'Swing (1-4 weeks)', 'Position (1-3 months)', 'Long-term'];

// Sortable Block Component
interface SortableBlockProps {
  block: ContentBlock;
  blockConfig: typeof blockTypes[0] | undefined;
  updateBlock: (id: string, content: string) => void;
  removeBlock: (id: string) => void;
  styles: Record<string, string>;
}

function SortableBlock({ block, blockConfig, updateBlock, removeBlock, styles }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!blockConfig) return null;

  const blockBorderClass = `blockBorder${blockConfig.title.replace(/\s+/g, '')}` as keyof typeof styles;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#1A1D28] rounded-xl overflow-hidden border border-gray-800/50 ${styles[blockBorderClass] || ''} ${isDragging ? 'opacity-40 shadow-2xl' : ''} transition-all duration-200`}
    >
      <div className="flex items-center justify-between p-4 bg-[#0F1116] border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <button
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#00F5FF] transition-colors p-1 rounded hover:bg-[#00F5FF]/10"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          {blockConfig.icon && <blockConfig.icon size={18} style={{ color: blockConfig.color }} />}
          {!blockConfig.noTitle && (
            <h3 className="text-white font-semibold text-sm">{blockConfig.title}</h3>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeBlock(block.id)}
          className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 p-1"
          aria-label="Remove block"
        >
          <X size={16} />
        </Button>
      </div>
      <div className="p-4">
        <RichTextEditor
          value={block.content}
          onChange={(value) => updateBlock(block.id, value)}
          placeholder={`Add your ${blockConfig.title.toLowerCase()} content here...`}
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showToolsPanel, setShowToolsPanel] = useState(true);

  // Auth state
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Post state
  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    blocks: [],
    primaryAsset: '',
    relatedAssets: [],
    sentiment: 'Neutral',
    confidenceLevel: 70,
    timeHorizon: 'Swing (1-4 weeks)',
    tags: [],
    category: 'Stocks',
    metaDescription: '',
    focusKeyword: '',
    featuredImage: '',
    isDraft: true
  });

  const [seoScore] = useState(65);
  const [readabilityScore] = useState(72);
  const [qualityScore] = useState(58);
  const [completionPercentage, setCompletionPercentage] = useState(15);
  const [characterCount, setCharacterCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [assetInput, setAssetInput] = useState('');

  // Check auth state and load draft if editing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email, displayName: user.displayName });
        const id = searchParams.get('id');
        if (id) {
          try {
            const postData = await getBlogPost(id);
            if (postData) {
              setPost({
                title: postData.title || '',
                slug: postData.slug || '',
                content: postData.content || '',
                blocks: (postData.blocks || []).map(block => ({
                  id: block.id,
                  type: block.type as ContentBlock['type'],
                  content: block.content,
                  metadata: block.metadata
                })),
                primaryAsset: postData.primaryAsset || '',
                relatedAssets: postData.relatedAssets || [],
                sentiment: postData.sentiment || 'Neutral',
                confidenceLevel: postData.confidenceLevel || 70,
                timeHorizon: postData.timeHorizon || 'Swing (1-4 weeks)',
                tags: postData.tags || [],
                category: postData.category || 'Stocks',
                metaDescription: postData.metaDescription || '',
                focusKeyword: postData.focusKeyword || '',
                featuredImage: postData.featuredImage || '',
                isDraft: postData.isDraft ?? true
              });
              setPostId(id);
            }
          } catch (error) {
            console.error('Error loading post:', error);
          }
        }
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-save functionality
  const ensureDraftExists = useCallback(async () => {
    if (!currentUser) return null;
    try {
      // Create a minimal draft so auto-save can continue - use explicit fields to satisfy service typing
      const minimal: FirestoreBlogPost = {
        title: post.title || 'Untitled Draft',
        slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `draft-${Date.now()}`),
        content: post.content || '',
        blocks: post.blocks || [],
        primaryAsset: post.primaryAsset || '',
        relatedAssets: post.relatedAssets || [],
        sentiment: post.sentiment || 'Neutral',
        confidenceLevel: post.confidenceLevel || 70,
        timeHorizon: post.timeHorizon || 'Swing (1-4 weeks)',
        tags: post.tags || [],
        category: post.category || 'Stocks',
        metaDescription: post.metaDescription || '',
        focusKeyword: post.focusKeyword || '',
        featuredImage: post.featuredImage || '',
        isDraft: true
      } as FirestoreBlogPost;
      const id = await createBlogPost(minimal, currentUser.uid, currentUser.email || '', currentUser.displayName || undefined);
      setPostId(id);
      // Update URL with the new post ID if not present
      try {
        const sp = new URLSearchParams(window.location.search);
        if (!sp.get('id')) {
          router.replace(`/create-post?id=${id}`);
        }
      } catch {
        // Fall back to window history if router.replace fails
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.get('id')) {
          searchParams.set('id', id);
          const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      }
      return id;
    } catch (error) {
      console.error('Failed to create draft for auto-save:', error);
      return null;
    }
  }, [currentUser, post, router]);

  const uploadFeaturedImageIfNeeded = useCallback(async (currentPost: BlogPost, pId?: string) => {
    let finalFeaturedImage = currentPost.featuredImage;
    if (finalFeaturedImage && finalFeaturedImage.startsWith('data:')) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const imageFile = dataURLtoFile(finalFeaturedImage, 'featured-image.jpg');
        finalFeaturedImage = await uploadFeaturedImage(imageFile, pId || 'temp', (progress: number) => {
          setUploadProgress(progress);
        });
      } catch (error) {
        console.error('Featured image upload failed:', error);
        toast.error('Failed to upload featured image');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
    return finalFeaturedImage;
  }, []);

  const autoSave = useCallback(async () => {
    if (!post.title && !post.content) return;
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // If postId not set, create a minimal draft automatically
      let id = postId;
      if (!id) id = await ensureDraftExists();

      if (!id) {
        console.warn('Auto-save aborted: no post ID available');
        return;
      }

      // Handle featured image upload if needed
      const finalFeaturedImage = await uploadFeaturedImageIfNeeded(post, id);

      await updateBlogPost(id, {
        ...post,
        featuredImage: finalFeaturedImage,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [post, currentUser, postId, ensureDraftExists, uploadFeaturedImageIfNeeded]);

  useEffect(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }

    autoSaveRef.current = setTimeout(() => {
      autoSave();
    }, 30000); // 30 seconds

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [post, autoSave]);

  // Generate slug from title
  useEffect(() => {
    if (post.title) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setPost(prev => ({ ...prev, slug }));
    }
  }, [post.title]);

  // Update character count
  useEffect(() => {
    setCharacterCount(post.title.length);
  }, [post.title]);

  // Calculate completion percentage
  useEffect(() => {
    const fields = [
      post.title,
      post.content,
      post.primaryAsset,
      post.metaDescription,
      post.focusKeyword,
      post.featuredImage,
      post.tags.length > 0,
      post.blocks.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    setCompletionPercentage(Math.round((completed / fields.length) * 100));
  }, [post]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      metadata: {}
    };
    setPost(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = (id: string, content: string) => {
    setPost(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === id ? { ...block, content } : block
      )
    }));
  };

  const removeBlock = (id: string) => {
    setPost(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id)
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPost(prev => {
        const oldIndex = prev.blocks.findIndex(block => block.id === active.id);
        const newIndex = prev.blocks.findIndex(block => block.id === over.id);

        return {
          ...prev,
          blocks: arrayMove(prev.blocks, oldIndex, newIndex)
        };
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setPost(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addRelatedAsset = () => {
    if (assetInput.trim() && !post.relatedAssets.includes(assetInput.trim())) {
      setPost(prev => ({ ...prev, relatedAssets: [...prev.relatedAssets, assetInput.trim()] }));
      setAssetInput('');
    }
  };

  const removeRelatedAsset = (asset: string) => {
    setPost(prev => ({ ...prev, relatedAssets: prev.relatedAssets.filter(a => a !== asset) }));
  };

  // Featured image file input + drag/drop handlers (client-side preview)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PNG or JPG image.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPost(prev => ({ ...prev, featuredImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFileSelect(f);
    // reset so same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onPlaceholderClick = () => fileInputRef.current?.click();

  const onPlaceholderDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] ?? null;
    handleFileSelect(f);
  };

  const onPlaceholderDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handlePublish = async () => {
    // Validate required fields
    if (!post.title || !post.content || !post.primaryAsset) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to publish');
      return;
    }

    setIsSaving(true);
    try {
      const finalFeaturedImage = await uploadFeaturedImageIfNeeded(post, postId ?? undefined);

      const postData = {
        ...post,
        featuredImage: finalFeaturedImage,
        isDraft: false
      };

      if (postId) {
        await updateBlogPost(postId, postData);
      } else {
        const newPostId = await createBlogPost(postData, currentUser.uid, currentUser.email || '', currentUser.displayName || undefined);
        setPostId(newPostId);
      }

      toast.success('Post published successfully!');
      router.push('/blog');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to save drafts');
      return;
    }

    setIsSaving(true);
    try {
      const finalFeaturedImage = await uploadFeaturedImageIfNeeded(post, postId ?? undefined);

      const postData = {
        ...post,
        featuredImage: finalFeaturedImage,
        isDraft: true
      };

      if (postId) {
        await updateBlogPost(postId, postData);
      } else {
        const newPostId = await createBlogPost(postData, currentUser.uid, currentUser.email || '', currentUser.displayName || undefined);
        setPostId(newPostId);
        // Update URL with post ID
        router.push(`/create-post?id=${newPostId}`);
      }

      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const generateAIDescription = () => {
    // Simulate AI generation
    const description = `${post.title.slice(0, 100)}... Analysis covering ${post.primaryAsset} with ${post.sentiment.toLowerCase()} outlook for ${post.timeHorizon.toLowerCase()} traders.`;
    setPost(prev => ({ ...prev, metaDescription: description.slice(0, 160) }));
  };

  const optimizeHeadline = () => {
    // Simulate headline optimization
    const suggestions = [
      `Breaking: ${post.title}`,
      `${post.title} - What Traders Need to Know`,
      `${post.title}: Complete Analysis & Trade Ideas`
    ];
    // In real implementation, show modal with suggestions
    console.log('Headline suggestions:', suggestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1116] via-[#1A1D28] to-[#0F1116]">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-[#0F1116]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-[#00F5FF] transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight size={16} className="text-gray-600" />
              <button
                onClick={() => router.push('/blog')}
                className="text-gray-400 hover:text-[#00F5FF] transition-colors"
              >
                Blog
              </button>
              <ChevronRight size={16} className="text-gray-600" />
              <span className="text-[#00F5FF] font-medium">Create Post</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              {(isSaving || isUploading) && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse"></div>
                  {isUploading ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                </div>
              )}

              {/* Tools Panel Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToolsPanel(!showToolsPanel)}
                className="text-gray-400 hover:text-[#00F5FF] hover:bg-[#00F5FF]/10"
              >
                {showToolsPanel ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                <span className="ml-2 hidden sm:inline">Tools</span>
              </Button>

              {/* Preview Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className={`text-gray-400 hover:text-[#00F5FF] hover:bg-[#00F5FF]/10 ${showPreview ? 'text-[#00F5FF]' : ''}`}
              >
                <Eye size={16} />
                <span className="ml-2 hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
              </Button>

              {/* Save Draft */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving || isUploading}
                className="border-gray-700 text-gray-300 hover:bg-[#2D3246] hover:border-[#00F5FF] hover:text-[#00F5FF] disabled:opacity-50"
              >
                <Save size={16} className="mr-2" />
                <span className="hidden sm:inline">Save Draft</span>
              </Button>

              {/* Publish */}
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isSaving || isUploading || !post.title || !post.content || !post.primaryAsset}
                className="bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                <Send size={16} className="mr-2" />
                <span className="hidden sm:inline">Publish</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${showToolsPanel ? 'mr-96' : ''}`}>
          {showPreview ? (
            /* Preview Mode */
            <div className="min-h-screen">
              {/* Preview Header */}
              <div className="sticky top-16 z-40 bg-[#0F1116]/95 backdrop-blur-sm border-b border-gray-800/50">
                <div className="mx-auto max-w-4xl px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-[#00F5FF] rounded-full"></div>
                      <span className="text-[#00F5FF] font-medium">Live Preview</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 "
                    >
                      <X size={16} className="mr-2" />
                      Exit Preview
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-4xl px-6 py-8">
                {/* Article Header */}
                <header className="mb-12">
                  {/* Category Badge */}
                  <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-full text-sm font-medium">
                      {post.category || 'Uncategorized'}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                    {post.title || 'Untitled Post'}
                  </h1>

                  {/* Meta Description */}
                  {post.metaDescription && (
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                      {post.metaDescription}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    {post.primaryAsset && (
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-[#00F5FF]" />
                        <span className="text-[#00F5FF] font-medium">{post.primaryAsset}</span>
                      </div>
                    )}
                    {post.sentiment && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className={post.sentiment === 'Bullish' ? 'text-green-500' : post.sentiment === 'Bearish' ? 'text-red-500' : 'text-gray-400'} />
                        <span className={post.sentiment === 'Bullish' ? 'text-green-500' : post.sentiment === 'Bearish' ? 'text-red-500' : 'text-gray-400'}>{post.sentiment}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Scale size={16} />
                      <span>Confidence: {post.confidenceLevel}%</span>
                    </div>
                  </div>

                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                      <Image
                        src={post.featuredImage}
                        alt={post.title || 'Featured image'}
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </header>

                {/* Main Content */}
                {post.content && (
                  <article className="prose prose-xl prose-invert max-w-none mb-16">
                    <div
                      className="text-gray-300 leading-relaxed space-y-8 text-lg"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </article>
                )}

                {/* Content Blocks */}
                {post.blocks.length > 0 && (
                  <div className="space-y-12 mb-16">
                    {post.blocks.map((block) => {
                      const blockConfig = blockTypes.find(bt => bt.type === block.type);
                      if (!blockConfig) return null;

                      return (
                        <section key={block.id} className="bg-[#1A1D28]/50 rounded-xl p-8 border border-gray-800/30">
                          {!blockConfig.noTitle && (
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800/50">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-700">
                                {blockConfig.icon && <blockConfig.icon size={24} className="text-gray-400" />}
                              </div>
                              <h2 className="text-2xl font-bold text-white">{blockConfig.title}</h2>
                            </div>
                          )}
                          <div
                            className="text-gray-300 leading-relaxed space-y-4 prose prose-invert max-w-none text-lg"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        </section>
                      );
                    })}
                  </div>
                )}

                {/* Article Footer */}
                <footer className="border-t border-gray-800/50 pt-12">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
                      <div className="flex flex-wrap gap-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-[#2D3246] border border-gray-700 text-gray-300 rounded-full text-sm hover:border-[#00F5FF]/50 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Assets */}
                  {post.relatedAssets.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-4">Related Assets</h4>
                      <div className="flex flex-wrap gap-3">
                        {post.relatedAssets.map((asset, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] rounded-full text-sm font-medium"
                          >
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Horizon */}
                  {post.timeHorizon && (
                    <div className="bg-[#1A1D28] border border-gray-800/50 rounded-xl p-6 mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock size={20} className="text-[#00F5FF]" />
                        <h4 className="text-lg font-semibold text-white">Time Horizon</h4>
                      </div>
                      <p className="text-gray-300">{post.timeHorizon}</p>
                    </div>
                  )}

                  {/* Engagement Actions */}
                  <div className="flex items-center justify-between py-8 border-y border-gray-800/50 my-12">
                    <div className="flex items-center gap-6">
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:border-[#00F5FF] hover:bg-[#00F5FF]/10">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Helpful
                      </Button>
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:border-[#00F5FF] hover:bg-[#00F5FF]/10">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Article
                      </Button>
                    </div>

                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:border-[#00F5FF] hover:bg-[#00F5FF]/10">
                      <Eye className="w-4 h-4 mr-2" />
                      Save for Later
                    </Button>
                  </div>
                </footer>
              </div>
            </div>
          ) : (
            /* Editor Mode */
            <div className="mx-auto max-w-4xl px-6 py-8">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Post Completion</h2>
                  <span className="text-[#00F5FF] font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-lg shadow-primary/25 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Title Section */}
              <div className="bg-[#1A1D28] rounded-2xl border border-gray-800/50 p-8 mb-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Write a compelling headline that captures attention..."
                        value={post.title}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, 70);
                          setPost(prev => ({ ...prev, title: val }));
                          setCharacterCount(val.length);
                        }}
                        className="text-3xl font-bold bg-transparent border-0 p-0 text-white placeholder:text-gray-600 focus-visible:ring-0 resize-none"
                        aria-label="Post title"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={optimizeHeadline}
                      className="text-[#00F5FF] hover:bg-[#00F5FF]/10 shrink-0"
                    >
                      <Sparkles size={18} />
                    </Button>
                  </div>

                  {/* Title Analytics */}
                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Characters:</span>
                      <span className={characterCount > 60 ? 'text-green-400' : 'text-yellow-400'}>
                        {characterCount}/70
                      </span>
                      {characterCount > 60 && characterCount < 70 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <AlertCircle size={12} />
                          Close to limit
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">SEO Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00F5FF] rounded-full"
                            style={{ width: `${seoScore}%` }}
                          />
                        </div>
                        <span className="text-[#00F5FF] font-semibold">{seoScore}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Sentiment:</span>
                      <span className="text-[#00F5FF]">Neutral</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Description */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-300">Meta Description</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateAIDescription}
                    className="text-xs text-[#00F5FF] hover:bg-[#00F5FF]/10"
                  >
                    <Sparkles size={12} className="mr-1" />
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  placeholder="Brief summary for search engines and social sharing (max 160 characters)"
                  value={post.metaDescription}
                  onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value.slice(0, 160) }))}
                  className="min-h-[80px] bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">{post.metaDescription.length}/160 characters</p>
                  {post.metaDescription.length > 140 && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <AlertCircle size={12} />
                      Close to limit
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Editor */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-8 mb-8 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Main Content</h3>
                  <p className="text-sm text-gray-400">Write your primary analysis and insights here</p>
                </div>
                <RichTextEditor
                  value={post.content}
                  onChange={(value) => setPost(prev => ({ ...prev, content: value }))}
                  placeholder="Start writing your market analysis... Use content blocks below for structured sections."
                  className="min-h-[400px]"
                />
              </div>

              {/* Content Blocks */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Content Blocks</h3>
                    <p className="text-sm text-gray-400">Add structured sections to your analysis</p>
                  </div>
                  <div className="relative">
                    <Button
                      onClick={() => addBlock('executive_summary')}
                      className="bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Block
                    </Button>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <SortableContext
                    items={post.blocks.map(block => block.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {post.blocks.map((block) => {
                        const blockConfig = blockTypes.find(bt => bt.type === block.type);

                        return (
                          <SortableBlock
                            key={block.id}
                            block={block}
                            blockConfig={blockConfig}
                            updateBlock={updateBlock}
                            removeBlock={removeBlock}
                            styles={styles}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {activeId ? (
                      <div className="bg-[#1A1D28] rounded-xl border-2 border-[#00F5FF] p-6 shadow-2xl opacity-90">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const block = post.blocks.find(b => b.id === activeId);
                            const blockConfig = blockTypes.find(bt => bt.type === block?.type);
                            return (
                              <>
                                <div className="flex items-center justify-center w-12 h-12 bg-[#00F5FF]/20 rounded-lg">
                                  <GripVertical size={24} className="text-[#00F5FF]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {blockConfig?.icon && <blockConfig.icon size={20} className="text-gray-400" />}
                                    <h3 className="text-white font-semibold text-lg">{blockConfig?.title}</h3>
                                  </div>
                                  <p className="text-[#00F5FF] text-sm font-medium">Moving block...</p>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>

                {/* Empty State */}
                {post.blocks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#00F5FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus size={32} className="text-[#00F5FF]" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Add Your First Content Block</h4>
                    <p className="text-gray-400 mb-6">Structure your analysis with specialized sections</p>
                    <Button
                      onClick={() => addBlock('executive_summary')}
                      className="bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Key Takeaways
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tools Panel */}
        {showToolsPanel && (
          <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-[#0F1116] border-l border-gray-800/50 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Panel Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Post Tools</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowToolsPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <PanelLeftClose size={16} />
                </Button>
              </div>

              {/* Success Metrics */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">Quality Metrics</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Content Quality</span>
                      <span className="text-[#00F5FF] font-semibold">{qualityScore}/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00F5FF] rounded-full"
                        style={{ width: `${qualityScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">SEO Score</span>
                      <span className="text-[#00F5FF] font-semibold">{seoScore}/100</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00F5FF] rounded-full"
                        style={{ width: `${seoScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Readability</span>
                      <span className="text-[#00F5FF] font-semibold">{readabilityScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full"
                        style={{ width: `${readabilityScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">Featured Image</h4>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={onFileInputChange}
                  title="Upload featured image"
                />

                {post.featuredImage ? (
                  <div
                    className="relative cursor-pointer group"
                    onClick={onPlaceholderClick}
                    onDrop={onPlaceholderDrop}
                    onDragOver={onPlaceholderDragOver}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPlaceholderClick(); } }}
                    aria-label="Featured image preview"
                  >
                    <Image
                      src={post.featuredImage}
                      alt="Featured image preview"
                      width={320}
                      height={180}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPost(prev => ({ ...prev, featuredImage: '' }));
                        }}
                        className="text-white hover:text-red-400"
                        title="Remove image"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-[#00F5FF]/50 transition-colors cursor-pointer"
                    onClick={onPlaceholderClick}
                    onDrop={onPlaceholderDrop}
                    onDragOver={onPlaceholderDragOver}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPlaceholderClick(); } }}
                    aria-label="Upload featured image"
                  >
                    <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>

              {/* Market Category */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">Market Category</h4>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {marketCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setPost(prev => ({ ...prev, category }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        post.category === category
                          ? 'bg-[#00F5FF] text-black'
                          : 'bg-[#2D3246] text-gray-400 hover:bg-[#3D4256] hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Tagging */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">Asset Tagging</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Primary Asset *</label>
                    <Input
                      type="text"
                      placeholder="e.g., AAPL, EUR/USD, BTC"
                      value={post.primaryAsset}
                      onChange={(e) => setPost(prev => ({ ...prev, primaryAsset: e.target.value }))}
                      className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Related Assets</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Add asset"
                        value={assetInput}
                        onChange={(e) => setAssetInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addRelatedAsset()}
                        className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
                      />
                      <Button
                        onClick={addRelatedAsset}
                        size="sm"
                        className="bg-[#00F5FF] text-black hover:bg-[#00F5FF]/90"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    {post.relatedAssets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.relatedAssets.map((asset) => (
                          <span
                            key={asset}
                            className="px-3 py-1 bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] rounded-full text-sm flex items-center gap-2"
                          >
                            {asset}
                            <Button
                              onClick={() => removeRelatedAsset(asset)}
                              className="hover:text-red-400"
                            >
                              <X size={14} />
                            </Button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">Sentiment Analysis</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="sentiment-select" className="text-sm text-gray-400 mb-2 block">Overall Sentiment</label>
                    <select
                      id="sentiment-select"
                      value={post.sentiment}
                      onChange={(e) => setPost(prev => ({ ...prev, sentiment: e.target.value }))}
                      className="w-full bg-[#0F1116] border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      {sentimentOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-gray-400">Confidence Level</label>
                      <span className="text-[#00F5FF] font-semibold">{post.confidenceLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={post.confidenceLevel}
                      onChange={(e) => setPost(prev => ({ ...prev, confidenceLevel: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      title="Confidence Level"
                    />
                  </div>
                  <div>
                    <label htmlFor="time-horizon-select" className="text-sm text-gray-400 mb-2 block">Time Horizon</label>
                    <select
                      id="time-horizon-select"
                      value={post.timeHorizon}
                      onChange={(e) => setPost(prev => ({ ...prev, timeHorizon: e.target.value }))}
                      className="w-full bg-[#0F1116] border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      {timeHorizons.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  </div>
                </div> 
              {/* SEO Optimization */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">SEO Optimization</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">URL Slug</label>
                    <Input
                      type="text"
                      value={post.slug}
                      onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value.replace(/\s+/g, '-') }))}
                      className="bg-[#0F1116] border-gray-700 text-white font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Focus Keyword</label>
                    <Input
                      type="text"
                      placeholder="Primary keyword to target"
                      value={post.focusKeyword}
                      onChange={(e) => setPost(prev => ({ ...prev, focusKeyword: e.target.value }))}
                      className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <h4 className="font-semibold text-white mb-4">Tags</h4>

                <div className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
                  />
                  <Button
                    onClick={addTag}
                    size="sm"
                    className="bg-[#00F5FF] text-black hover:bg-[#00F5FF]/90"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#2D3246] text-gray-300 rounded-full text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <Button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400"
                        >
                          <X size={14} />
                        </Button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Assistant */}
              <div className="bg-[#1A1D28] rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={18} className="text-[#00F5FF]" />
                  <h4 className="font-semibold text-white">AI Assistant</h4>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-[#2D3246] border-gray-700 text-gray-300 hover:bg-[#3D4256] hover:border-[#00F5FF] hover:text-[#00F5FF]"
                  >
                    <Target size={16} className="mr-2" />
                    Analyze Content Gaps
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-[#2D3246] border-gray-700 text-gray-300 hover:bg-[#3D4256] hover:border-[#00F5FF] hover:text-[#00F5FF]"
                  >
                    <TrendingUp size={16} className="mr-2" />
                    Check Market Trends
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-[#2D3246] border-gray-700 text-gray-300 hover:bg-[#3D4256] hover:border-[#00F5FF] hover:text-[#00F5FF]"
                  >
                    <Users size={16} className="mr-2" />
                    Competitor Analysis
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}