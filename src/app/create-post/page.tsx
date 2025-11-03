'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Upload
} from 'lucide-react';
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
    icon: '📋',
    color: '#00F5FF',
    fields: ['bullet_points', 'market_impact', 'time_horizon']
  },
  {
    type: 'technical_analysis',
    title: 'Technical Setup',
    icon: '📊',
    color: '#0066FF',
    fields: ['chart_analysis', 'key_levels', 'indicators', 'trade_setup']
  },
  {
    type: 'fundamental_analysis',
    title: 'Fundamental Drivers',
    icon: '🏛️',
    color: '#10B981',
    fields: ['economic_data', 'company_fundamentals', 'market_sentiment']
  },
  {
    type: 'trade_idea',
    title: 'Trade Recommendation',
    icon: '💡',
    color: '#F59E0B',
    fields: ['entry_exit', 'stop_loss', 'targets', 'position_size']
  },
  {
    type: 'risk_assessment',
    title: 'Risk Analysis',
    icon: '⚖️',
    color: '#EF4444',
    fields: ['risk_factors', 'hedging_strategies', 'portfolio_impact']
  },
  {
    type: 'market_context',
    title: 'Broader Market View',
    icon: '🌍',
    color: '#8B5CF6',
    fields: ['sector_correlation', 'macro_environment', 'global_influences']
  }
];

const marketCategories = ['Stocks', 'Forex', 'Crypto', 'Commodities', 'Macro'];
const sentimentOptions = ['Strong Bullish', 'Bullish', 'Neutral', 'Bearish', 'Strong Bearish'];
const timeHorizons = ['Intraday', 'Swing (1-4 weeks)', 'Position (1-3 months)', 'Long-term'];

export default function CreatePostPage() {
  const router = useRouter();
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

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
    
    setIsSaving(true);
    // Simulate auto-save
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
  }, [post.title, post.content]);

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

  const handlePublish = async () => {
    // Validate required fields
    if (!post.title || !post.content || !post.primaryAsset) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    // Simulate publish
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    // Navigate to blog or success page
    router.push('/blog');
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
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
              {isSaving && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse"></div>
                  Saving...
                </span>
              )}
              
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-[#2D3246] hover:border-[#00F5FF] hover:text-[#00F5FF]"
              >
                <Save size={16} className="mr-2" />
                Save Draft
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-[#2D3246] hover:border-[#0066FF] hover:text-[#0066FF]"
              >
                <Eye size={16} className="mr-2" />
                Preview
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
                className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-black font-semibold hover:opacity-90"
              >
                <Send size={16} className="mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
              {post.blocks.map((block) => {
                const blockConfig = blockTypes.find(bt => bt.type === block.type);
                const blockBorderClass = `blockBorder${blockConfig?.title.replace(/\s+/g, '')}` as keyof typeof styles;
                
                return (
                  <div 
                    key={block.id}
                    className={`bg-[#1A1D28] rounded-lg border border-gray-800 overflow-hidden ${styles[blockBorderClass] || ''}`}
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-label={blockConfig?.title}>{blockConfig?.icon}</span>
                        <div>
                          <h3 className="text-white font-semibold">{blockConfig?.title}</h3>
                          <p className="text-sm text-gray-400">{block.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(block.id)}
                        className="text-gray-400 hover:text-red-400"
                        aria-label={`Remove ${blockConfig?.title} block`}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Textarea
                        placeholder={`Enter ${blockConfig?.title.toLowerCase()} details...`}
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        className="min-h-[150px] bg-[#0F1116] border-gray-700 text-gray-300 placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                );
              })}

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
                          <span className="text-2xl" role="img" aria-label={blockType.title}>{blockType.icon}</span>
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
              
              {post.featuredImage ? (
                <div className="relative">
                  <Image 
                    src={post.featuredImage} 
                    alt="Featured image preview" 
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPost(prev => ({ ...prev, featuredImage: '' }))}
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    aria-label="Remove featured image"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00F5FF] transition-colors cursor-pointer">
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
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#00F5FF]" />
                  <span className="text-sm text-gray-300">Auto-share on Twitter</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#00F5FF]" />
                  <span className="text-sm text-gray-300">Auto-share on LinkedIn</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#00F5FF]" />
                  <span className="text-sm text-gray-300">Include in newsletter</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#00F5FF]" />
                  <span className="text-sm text-gray-300">Premium content</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#00F5FF]" />
                  <span className="text-sm text-gray-300">Enable comments</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
