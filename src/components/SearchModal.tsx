"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Clock, TrendingUp, FileText, Calendar, User, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { 
  searchDatabase, 
  getRecentSearches, 
  saveRecentSearch, 
  clearRecentSearches as clearStoredSearches,
  getSearchSuggestions,
  SearchResult
} from '@/lib/search-service';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchSuggestions] = useState<string[]>(getSearchSuggestions());
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      setIsLoading(true);
      const timeout = setTimeout(async () => {
        try {
          const results = await searchDatabase(searchQuery, {
            maxResults: 20,
            includeTypes: ['blog', 'page', 'feature', 'user'],
            sortBy: 'relevance'
          });
          setFilteredResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300); // 300ms debounce

      searchTimeoutRef.current = timeout;
    } else {
      setFilteredResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      saveRecentSearch(query);
      setRecentSearches(getRecentSearches());
      setSearchQuery(query);
    }
  };

  const handleResultClick = () => {
    saveRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    onClose();
  };

  const clearRecentSearches = () => {
    clearStoredSearches();
    setRecentSearches([]);
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
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Search className="w-5 h-5" />
            Search Trade Pulse
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col max-h-[60vh]">
          {/* Search Input */}
          <div className="p-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search posts, features, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearch(searchQuery);
                  }
                }}
                className="pl-10 pr-10 h-12 text-base"
                autoFocus
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
              )}
              {searchQuery && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {!searchQuery.trim() ? (
              <div className="px-6 pb-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Suggestions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleSearch(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 pb-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2 text-gray-500">Searching...</span>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                    </h3>
                    {filteredResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link 
                          href={result.href} 
                          onClick={() => handleResultClick()}
                          className="block p-4 rounded-lg border dark:border-gray-700 dark:hover:border-gray-600 hover:bg-muted/50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getTypeBadgeColor(result.type)}`}>
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-gray-100 line-clamp-1">
                                  {result.title}
                                </h4>
                                {result.date && (
                                  <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {result.date}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {result.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {result.category || result.type}
                                </Badge>
                                {result.metadata?.tags && result.metadata.tags.length > 0 && (
                                  <div className="flex gap-1">
                                    {result.metadata.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {result.metadata.tags.length > 2 && (
                                      <span className="text-xs text-gray-500">
                                        +{result.metadata.tags.length - 2} more
                                      </span>
                                    )}
                                  </div>
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
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search terms or browse our popular content below.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {searchSuggestions.slice(0, 4).map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleSearch(suggestion)}
                        >
                          {suggestion}
                        </Badge>
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