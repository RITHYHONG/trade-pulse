"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Clock, TrendingUp, FileText, Calendar, User, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        const result = filteredResults[selectedIndex];
        if (result) {
          handleResultClick(result.href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

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
            maxResults: 10,
            includeTypes: ['blog', 'page', 'feature', 'user'],
            sortBy: 'relevance'
          });
          setFilteredResults(results);
          setSelectedIndex(results.length > 0 ? 0 : -1);
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
      setSelectedIndex(-1);
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

  const handleResultClick = (href: string) => {
    saveRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    onClose();
    window.location.href = href;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-none bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 ring-1 ring-white/10 [&>button]:hidden">
        {/* Modern Search Bar */}
        <div className="relative group p-4 border-b border-white/5 bg-white/5">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
          <Input
            placeholder="Search Trade Pulse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-100 placeholder:text-slate-500 font-medium"
            autoFocus
          />
          <div className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 border border-white/10 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <span>ESC</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="max-h-[min(480px,70vh)] overflow-y-auto">
          {!searchQuery.trim() ? (
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/5 hover:bg-slate-800 hover:border-blue-500/50 text-sm text-slate-300 transition-all"
                      >
                        <Search className="w-3 h-3 text-slate-500" />
                        {search}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Quick Jump Suggestions */}
              <section>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Popular Topics
                </h3>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {searchSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-blue-500/5 hover:border-blue-500/30 text-left transition-all"
                    >
                      <span className="text-sm text-slate-200 font-medium">{suggestion}</span>
                      <TrendingUp className="w-4 h-4 text-blue-500/50" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="p-2" ref={scrollContainerRef}>
              {filteredResults.length > 0 ? (
                <div className="space-y-1">
                  {filteredResults.map((result, idx) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Link 
                        href={result.href} 
                        onClick={(e) => {
                          e.preventDefault();
                          handleResultClick(result.href);
                        }}
                        className={`group flex items-center gap-4 p-3 rounded-xl transition-all ${
                          idx === selectedIndex 
                            ? 'bg-blue-500/10 border-blue-500/30' 
                            : 'hover:bg-white/5 border-transparent'
                        } border`}
                      >
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          idx === selectedIndex 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors'
                        }`}>
                          {getTypeIcon(result.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm font-semibold truncate ${
                              idx === selectedIndex ? 'text-blue-400' : 'text-slate-200'
                            }`}>
                              {result.title}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter shrink-0 px-2 py-0.5 rounded-full bg-slate-900 border border-white/5">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {result.description}
                          </p>
                        </div>

                        {idx === selectedIndex && (
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-blue-500/20 text-[10px] font-bold text-blue-400">
                            <span>ENTER</span>
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : !isLoading && (
                <div className="py-12 text-center">
                  <div className="inline-flex p-4 rounded-full bg-slate-900 border border-white/5 mb-4">
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-slate-200 font-semibold mb-1">No results for "{searchQuery}"</h3>
                  <p className="text-sm text-slate-500 px-12">
                    Try searching for something else or browse popular topics above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shortcuts Footer */}
        <div className="p-3 border-t border-white/5 bg-slate-900/30 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-300">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-300">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            Powered by <span className="text-blue-400 font-bold tracking-tight">TradePulse AI</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}