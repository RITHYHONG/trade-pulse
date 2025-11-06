"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Clock, TrendingUp, FileText, Calendar, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'blog' | 'page' | 'feature' | 'user';
  href: string;
  date?: string;
  category?: string;
}

// Mock search data - replace with actual search implementation
const searchData: SearchResult[] = [
  {
    id: '1',
    title: 'How Deep Are Bitcoin Traders Hedging After Recent Price Dip Below $100K?',
    description: 'Analysis of Bitcoin trading patterns and hedging strategies in the current market.',
    type: 'blog',
    href: '/blog/bitcoin-hedging-analysis',
    date: '6 hours ago',
    category: 'Analysis'
  },
  {
    id: '2',
    title: 'Tether Profits Topped $10B in First Nine Months',
    description: 'Comprehensive report on Tether\'s financial performance and market impact.',
    type: 'blog',
    href: '/blog/tether-profits-report',
    date: '5 days ago',
    category: 'News'
  },
  {
    id: '3',
    title: 'Retail Bitcoin Traders Sentiment Analysis',
    description: 'Understanding retail trader behavior since the October 20 crypto crash.',
    type: 'blog',
    href: '/blog/retail-sentiment-analysis',
    date: '6 days ago',
    category: 'Research'
  },
  {
    id: '4',
    title: 'Pre-Market Dashboard',
    description: 'Access real-time pre-market data and trading insights.',
    type: 'page',
    href: '/dashboard',
    category: 'Tools'
  },
  {
    id: '5',
    title: 'Market Calendar',
    description: 'View upcoming market events and economic indicators.',
    type: 'page',
    href: '/calendar',
    category: 'Tools'
  },
  {
    id: '6',
    title: 'User Settings',
    description: 'Manage your account preferences and notification settings.',
    type: 'page',
    href: '/settings',
    category: 'Account'
  }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Save to recent searches
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'page':
        return <TrendingUp className="w-4 h-4" />;
      case 'feature':
        return <Calendar className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'page':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'feature':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'user':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Trader Pulse
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for articles, tools, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearch(searchQuery);
                }
              }}
              className="pl-10 pr-4 py-3 text-base"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() ? (
              <div>
                {filteredResults.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Search Results ({filteredResults.length})
                    </h3>
                    {filteredResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={result.href}
                          onClick={() => {
                            handleSearch(searchQuery);
                            onClose();
                          }}
                          className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                  {result.title}
                                </h4>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getTypeBadgeColor(result.type)} flex-shrink-0`}
                                >
                                  {result.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 overflow-hidden">
                                <span className="line-clamp-2">{result.description}</span>
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {result.category && (
                                  <span className="bg-muted px-2 py-1 rounded">
                                    {result.category}
                                  </span>
                                )}
                                {result.date && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {result.date}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No results found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try searching for articles, tools, or features using different keywords.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="flex items-center gap-2 w-full p-2 text-left rounded hover:bg-muted/50 transition-colors"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}