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
  publishBlogPost,
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
  Globe
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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

// Types
interface ContentBlock {
  id: string;
  type: 'executive_summary' | 'technical_analysis' | 'fundamental_analysis' | 'trade_idea' | 'risk_assessment' | 'market_context';
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
  }
  ,
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
      className={`bg-[#1A1D28] rounded-lg overflow-hidden ${styles[blockBorderClass] || ''} ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center justify-between p-4 bg-[#0F1116] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#00F5FF] transition-colors"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>
          {blockConfig.icon && <blockConfig.icon size={20} className="text-gray-400" />}
          {!blockConfig.noTitle && (
            <h3 className="text-white font-semibold">{blockConfig.title}</h3>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeBlock(block.id)}
          className="text-gray-400 hover:text-red-400 font-extrabold"
          aria-label={`Remove ${blockConfig.title} block`}
        >
          <X size={16}  />
        </Button>
      </div>
      {!isDragging && (
        <div className="p-4">
          <RichTextEditor
            value={block.content}
            onChange={(value) => updateBlock(block.id, value)}
            placeholder={`Enter ${blockConfig.title.toLowerCase()} details...`}
            className="min-h-[150px]"
          />
        </div>
      )}
      {isDragging && (
        <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">
          <p>Moving {blockConfig.title}...</p>
        </div>
      )}
    </div>
  );
}

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Check auth state and load draft if editing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email, displayName: user.displayName });
        
        // Check if we're editing an existing post
        const editPostId = searchParams?.get('id');
        if (editPostId) {
          setPostId(editPostId);
          try {
            const existingPost = await getBlogPost(editPostId);
            if (existingPost) {
              setPost({
                title: existingPost.title,
                slug: existingPost.slug,
                content: existingPost.content,
                blocks: existingPost.blocks,
                primaryAsset: existingPost.primaryAsset,
                relatedAssets: existingPost.relatedAssets,
                sentiment: existingPost.sentiment,
                confidenceLevel: existingPost.confidenceLevel,
                timeHorizon: existingPost.timeHorizon,
                tags: existingPost.tags,
                category: existingPost.category,
                metaDescription: existingPost.metaDescription,
                focusKeyword: existingPost.focusKeyword,
                featuredImage: existingPost.featuredImage,
                isDraft: existingPost.isDraft,
                scheduledDate: existingPost.scheduledDate
              });
            }
          } catch (error) {
            console.error('Error loading post:', error);
            alert('Failed to load post');
          }
        }
      } else {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/create-post');
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

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!post.title && !post.content) return;
    if (!currentUser) return;
    if (!postId) return; // Only auto-save if we have a post ID (after first save)
    
    setIsSaving(true);
    try {
      let finalFeaturedImage = post.featuredImage;

      // If featured image is a data URL, upload it
      if (post.featuredImage && post.featuredImage.startsWith('data:')) {
        const imageFile = dataURLtoFile(post.featuredImage, 'featured-image.jpg');
        finalFeaturedImage = await uploadFeaturedImage(imageFile, postId);
      }

      await updateBlogPost(postId, {
        ...post,
        featuredImage: finalFeaturedImage
      });
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [post, currentUser, postId]);

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
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
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
    setShowBlockMenu(false);
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
      alert('Invalid file type. Please upload a PNG or JPG image.');
      return;
    }

    if (file.size > maxSize) {
      alert('File too large. Maximum size is 10MB.');
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
      alert('Please fill in all required fields');
      return;
    }

    if (!currentUser) {
      alert('You must be logged in to publish');
      return;
    }

    setIsSaving(true);
    try {
      let finalFeaturedImage = post.featuredImage;

      // If featured image is a data URL, upload it first
      if (post.featuredImage && post.featuredImage.startsWith('data:')) {
        setIsUploading(true);
        const imageFile = dataURLtoFile(post.featuredImage, 'featured-image.jpg');
        const tempPostId = postId || `temp_${Date.now()}`;
        finalFeaturedImage = await uploadFeaturedImage(imageFile, tempPostId, setUploadProgress);
        setIsUploading(false);
      }

      const postData = {
        ...post,
        featuredImage: finalFeaturedImage,
        isDraft: false
      };

      if (postId) {
        // Update existing post and publish
        await updateBlogPost(postId, postData);
        await publishBlogPost(postId);
      } else {
        // Create new post
        const newPostId = await createBlogPost(postData, currentUser.uid, currentUser.email || 'unknown@example.com', currentUser.displayName || undefined);
        setPostId(newPostId);
      }

      alert('Post published successfully!');
      router.push('/blog');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser) {
      alert('You must be logged in to save drafts');
      return;
    }

    setIsSaving(true);
    try {
      let finalFeaturedImage = post.featuredImage;

      // If featured image is a data URL, upload it first
      if (post.featuredImage && post.featuredImage.startsWith('data:')) {
        setIsUploading(true);
        const imageFile = dataURLtoFile(post.featuredImage, 'featured-image.jpg');
        const tempPostId = postId || `temp_${Date.now()}`;
        finalFeaturedImage = await uploadFeaturedImage(imageFile, tempPostId, setUploadProgress);
        setIsUploading(false);
      }

      const postData = {
        ...post,
        featuredImage: finalFeaturedImage,
        isDraft: true
      };

      if (postId) {
        // Update existing draft
        await updateBlogPost(postId, postData);
      } else {
        // Create new draft
        const newPostId = await createBlogPost(postData, currentUser.uid, currentUser.email || 'unknown@example.com', currentUser.displayName || undefined);
        setPostId(newPostId);
        // Update URL with post ID
        router.push(`/create-post?id=${newPostId}`);
      }

      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
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
    <div className="min-h-screen bg-[#0F1116]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#1A1D28]/95 backdrop-blur-sm">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="hover:text-[#00F5FF] cursor-pointer">Dashboard</span>
              <ChevronRight size={16} />
              <span className="hover:text-[#00F5FF] cursor-pointer">Blog</span>
              <ChevronRight size={16} />
              <span className="text-white">Create Post</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {(isSaving || isUploading) && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse"></div>
                  {isUploading ? `Uploading image... ${uploadProgress}%` : 'Saving...'}
                </span>
              )}
              
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving || isUploading}
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-[#2D3246] hover:border-[#00F5FF] hover:text-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} className="mr-2" />
                Save Draft
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className={`bg-transparent border-gray-700 text-gray-300 hover:bg-[#2D3246] hover:border-[#0066FF] hover:text-[#0066FF] ${
                  showPreview ? 'border-[#0066FF] text-[#0066FF]' : ''
                }`}
              >
                <Eye size={16} className="mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-[#2D3246] hover:border-[#F59E0B] hover:text-[#F59E0B]"
              >
                <Clock size={16} className="mr-2" />
                Schedule
              </Button>

              <Button
                onClick={handlePublish}
                disabled={isSaving || isUploading}
                className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} className="mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview Mode */}
      {showPreview ? (
        <div className="min-h-screen bg-[#0F1116]">
          {/* Preview Navigation Header */}
          <div className="sticky top-0 z-50 bg-[#0F1116]/95 backdrop-blur-sm border-b border-[#2D3246]">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                  className="text-gray-300 hover:text-white hover:bg-[#1A1D28]"
                >
                  <X size={16} className="mr-2" />
                  Close Preview
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-[#00F5FF] text-sm font-medium">Preview Mode</span>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="mb-8">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-4">
                    {post.category || 'Uncategorized'}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title || 'Untitled Post'}
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {post.metaDescription || ''}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#2D3246]">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
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
                        <TrendingUp size={16} className={
                          post.sentiment === 'Bullish' ? 'text-green-500' :
                          post.sentiment === 'Bearish' ? 'text-red-500' :
                          'text-gray-400'
                        } />
                        <span className={
                          post.sentiment === 'Bullish' ? 'text-green-500' :
                          post.sentiment === 'Bearish' ? 'text-red-500' :
                          'text-gray-400'
                        }>{post.sentiment}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Scale size={16} />
                    <span>Confidence: {post.confidenceLevel}%</span>
                  </div>
                </div>
                
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                    <Image
                      src={post.featuredImage}
                      alt={post.title || 'Featured image'}
                      width={1200}
                      height={630}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </header>

              {/* Main Content */}
              {post.content && (
                <article className="prose prose-lg prose-invert max-w-none mb-12">
                  <div 
                    className="text-gray-300 leading-relaxed space-y-6"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </article>
              )}

              {/* Content Blocks */}
              {post.blocks.length > 0 && (
                <div className="space-y-8 mt-12">
                  {post.blocks.map((block) => {
                    const blockConfig = blockTypes.find(bt => bt.type === block.type);
                    if (!blockConfig) return null;

                    return (
                      <section key={block.id}>
                        {!blockConfig.noTitle && (
                          <h2 className="text-2xl font-semibold text-white mt-10 mb-4 border-l-4 border-cyan-500 pl-4 flex items-center gap-3">
                            {blockConfig.icon && <blockConfig.icon size={24} className="text-cyan-500" />}
                            {blockConfig.title}
                          </h2>
                        )}
                        <div 
                          className="text-gray-300 leading-relaxed space-y-4 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      </section>
                    );
                  })}
                </div>
              )}

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-[#2D3246]">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 border border-[#2D3246] text-gray-400 rounded text-sm hover:border-cyan-500/30 transition-colors"
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
                    <div className="flex flex-wrap gap-2">
                      {post.relatedAssets.map((asset, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] rounded text-sm font-medium"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Horizon */}
                {post.timeHorizon && (
                  <div className="bg-[#1A1D28] border border-[#2D3246] rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock size={20} className="text-[#00F5FF]" />
                      <h4 className="text-lg font-semibold text-white">Time Horizon</h4>
                    </div>
                    <p className="text-gray-300">{post.timeHorizon}</p>
                  </div>
                )}

                {/* Engagement Actions */}
                <div className="flex items-center justify-between py-6 border-y border-[#2D3246] my-8">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Helpful
                    </Button>
                    <Button variant="outline" className="border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Article
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500">
                    <Eye className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      ) : (
        /* Main Content - Editor Mode */
        <div className="mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column - Content Creation */}
            <div className="space-y-6">
            {/* Title Section */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <Input
                    type="text"
                    placeholder="Catchy, SEO-optimized headline..."
                    value={post.title}
                    onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold bg-transparent border-0 p-0 text-white placeholder:text-gray-600 focus-visible:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={optimizeHeadline}
                    className="text-[#00F5FF] hover:bg-[#00F5FF]/10"
                  >
                    <Sparkles size={16} />
                  </Button>
                </div>

                {/* Title Metrics */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Characters:</span>
                    <span className={characterCount > 60 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>
                      {characterCount}/70
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">SEO Score:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={styles.seoProgressBar}
                          style={{ width: `${seoScore}%` }}
                          role="progressbar"
                          aria-valuenow={seoScore}
                          aria-valuemin={0}
                          aria-valuemax={100}
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

            {/* Short Meta Description (inline) */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-4">
              <label className="text-sm text-gray-400 mb-2 block">Short Description (shown in preview)</label>
              <Input
                type="text"
                placeholder="Short summary for preview and search snippets (max 160 chars)"
                value={post.metaDescription}
                onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value.slice(0, 160) }))}
                className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">{post.metaDescription.length}/160 characters</p>
            </div>

            {/* Main Content Editor */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800">
              {/* Content Area with Rich Text Editor */}
              <div className="p-6">
                <RichTextEditor
                  value={post.content}
                  onChange={(value) => setPost(prev => ({ ...prev, content: value }))}
                  placeholder="Start writing your market analysis... Use content blocks below for structured sections."
                  className="min-h-[300px]"
                />
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-4">
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
                </SortableContext>
                
                <DragOverlay>
                  {activeId ? (
                    <div className="bg-[#1A1D28] rounded-lg border-2 border-[#00F5FF] p-6 shadow-2xl opacity-90">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const block = post.blocks.find(b => b.id === activeId);
                          const blockConfig = blockTypes.find(bt => bt.type === block?.type);
                          return (
                            <>
                              <div className="flex items-center justify-center w-12 h-12 bg-[#00F5FF]/20 rounded-lg">
                                <GripVertical size={28} className="text-[#00F5FF]" />
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

              {/* Add Block Button */}
              <div className="relative">
                <Button
                  onClick={() => setShowBlockMenu(!showBlockMenu)}
                  className="w-full bg-[#2D3246] border-2 border-dashed border-gray-700 text-[#00F5FF] hover:bg-[#2D3246] hover:border-[#00F5FF] py-6"
                >
                  <Plus size={20} className="mr-2" />
                  Add Content Block
                </Button>

                {/* Block Menu */}
                {showBlockMenu && (
                  <div className="absolute top-full mt-2 w-full bg-[#1A1D28] border border-gray-800 rounded-lg shadow-xl z-10 p-2 grid grid-cols-2 gap-2">
                    {blockTypes.map((blockType) => {
                      const blockBorderClass = `blockBorder${blockType.title.replace(/\s+/g, '')}` as keyof typeof styles;
                      
                      return (
                        <button
                          key={blockType.type}
                          onClick={() => addBlock(blockType.type as ContentBlock['type'])}
                          className={`flex items-center gap-3 p-4 rounded-lg hover:bg-[#2D3246] text-left transition-colors ${styles[blockBorderClass] || ''}`}
                          aria-label={`Add ${blockType.title} block`}
                        >
                          {blockType.icon ? (
                            <blockType.icon size={20} className="text-gray-400" aria-label={blockType.title} />
                          ) : (
                            <div className="w-6 h-6 bg-gray-700 rounded" aria-hidden="true" />
                          )}
                          <div>
                            <div className="text-white font-medium text-sm">{blockType.title}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              {blockType.fields.length} fields
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Tools & Settings */}
          <div className="space-y-6">
            {/* Success Metrics */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Target size={18} className="text-[#00F5FF]" />
                Success Metrics
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Quality Score</span>
                    <span className="text-[#00F5FF] font-semibold">{qualityScore}/100</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={styles.qualityProgressBar}
                      style={{ width: `${qualityScore}%` }}
                      role="progressbar"
                      aria-valuenow={qualityScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Completeness</span>
                    <span className="text-[#10B981] font-semibold">{completionPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={styles.successProgressBar}
                      style={{ width: `${completionPercentage}%` }}
                      role="progressbar"
                      aria-valuenow={completionPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">SEO Grade</span>
                    <span className="text-[#F59E0B] font-semibold text-lg">B</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Readability</span>
                    <span className="text-[#00F5FF] font-semibold">{readabilityScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={styles.readabilityProgressBar}
                      style={{ width: `${readabilityScore}%` }}
                      role="progressbar"
                      aria-valuenow={readabilityScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Market Selection */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-[#00F5FF]" />
                Market Category
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {marketCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setPost(prev => ({ ...prev, category }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      post.category === category
                        ? 'bg-[#00F5FF] text-blue-950 hover:bg-[#00F5FF]/90'
                        : 'bg-[#2D3246] text-gray-400 hover:bg-[#3D4256] hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Tagging */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#00F5FF]" />
                Asset Tagging
              </h3>
              
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
                      placeholder="Add related asset"
                      value={assetInput}
                      onChange={(e) => setAssetInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRelatedAsset())}
                      className="bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
                    />
                    <Button
                      onClick={addRelatedAsset}
                      size="sm"
                      className="bg-[#00F5FF] text-black hover:bg-[#00F5FF]/90 h-12"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  {post.relatedAssets.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.relatedAssets.map((asset) => (
                        <span
                          key={asset}
                          className="px-3 py-1 bg-[#2D3246] text-[#00F5FF] rounded-full text-sm flex items-center gap-2"
                        >
                          {asset}
                          <button
                            onClick={() => removeRelatedAsset(asset)}
                            className="hover:text-red-400"
                            aria-label={`Remove ${asset}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Scale size={18} className="text-[#00F5FF]" />
                Sentiment Analysis
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Overall Sentiment</label>
                  <select
                    value={post.sentiment}
                    onChange={(e) => setPost(prev => ({ ...prev, sentiment: e.target.value }))}
                    className="w-full bg-[#0F1116] border border-gray-700 rounded-lg px-3 py-2 text-white"
                    aria-label="Select overall sentiment"
                  >
                    {sentimentOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="confidenceSlider" className="text-sm text-gray-400">Confidence Level</label>
                    <span className="text-[#00F5FF] font-semibold">{post.confidenceLevel}%</span>
                  </div>
                  <input
                    id="confidenceSlider"
                    type="range"
                    min="0"
                    max="100"
                    value={post.confidenceLevel}
                    onChange={(e) => setPost(prev => ({ ...prev, confidenceLevel: parseInt(e.target.value) }))}
                    className={styles.confidenceSlider}
                    aria-label="Confidence level slider"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time Horizon</label>
                  <select
                    value={post.timeHorizon}
                    onChange={(e) => setPost(prev => ({ ...prev, timeHorizon: e.target.value }))}
                    className="w-full bg-[#0F1116] border border-gray-700 rounded-lg px-3 py-2 text-white"
                    aria-label="Select time horizon"
                  >
                    {timeHorizons.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SEO Optimization */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#00F5FF]" />
                SEO Optimization
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Meta Description</label>
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
                    placeholder="Brief description for search engines..."
                    value={post.metaDescription}
                    onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value.slice(0, 160) }))}
                    className="min-h-[80px] bg-[#0F1116] border-gray-700 text-white placeholder:text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">{post.metaDescription.length}/160 characters</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">URL Slug</label>
                  <Input
                    type="text"
                    value={post.slug}
                    onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
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
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4">Tags</h3>
              
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
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
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#00F5FF]" />
                Featured Image
              </h3>
              
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={onFileInputChange}
                  aria-label="Upload featured image"
                  title="Upload featured image"
                />

                {post.featuredImage ? (
                  <div
                    className="relative cursor-pointer"
                    onClick={onPlaceholderClick}
                    onDrop={onPlaceholderDrop}
                    onDragOver={onPlaceholderDragOver}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <Image
                      src={post.featuredImage}
                      alt={post.title || 'Featured image preview'}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPost(prev => ({ ...prev, featuredImage: '' }));
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      aria-label="Remove featured image"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00F5FF] transition-colors cursor-pointer"
                    onClick={onPlaceholderClick}
                    onDrop={onPlaceholderDrop}
                    onDragOver={onPlaceholderDragOver}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <Upload size={32} className="mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
            </div>

            {/* Advanced AI Tools */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#00F5FF]" />
                AI Assistant
              </h3>
              
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

            {/* Distribution Settings */}
            <div className="bg-[#1A1D28] rounded-lg border border-gray-800 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Share2 size={18} className="text-[#00F5FF]" />
                Distribution
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox className="w-5 h-5 border-gray-600 data-[state=checked]:bg-[#00F5FF] data-[state=checked]:border-[#00F5FF]" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Auto-share on Twitter</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox className="w-5 h-5 border-gray-600 data-[state=checked]:bg-[#00F5FF] data-[state=checked]:border-[#00F5FF]" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Auto-share on LinkedIn</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox className="w-5 h-5 border-gray-600 data-[state=checked]:bg-[#00F5FF] data-[state=checked]:border-[#00F5FF]" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Include in newsletter</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox className="w-5 h-5 border-gray-600 data-[state=checked]:bg-[#00F5FF] data-[state=checked]:border-[#00F5FF]" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Premium content</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox defaultChecked className="w-5 h-5 border-gray-600 data-[state=checked]:bg-[#00F5FF] data-[state=checked]:border-[#00F5FF]" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Enable comments</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
