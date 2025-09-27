"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Check, X, ShoppingCart, Star, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Suggestion {
  domain: string;
  tld: string;
  available: boolean;
  price?: string;
  premium?: boolean;
  category?: string;
}

interface DomainSearchConceptProps {
  className?: string;
}

export default function DomainSearchConcept({ className }: DomainSearchConceptProps) {
  const [query, setQuery] = useState("");
  const [selectedTld, setSelectedTld] = useState(".com");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [hasSearched, setHasSearched] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // TLD options with pricing and popularity - memoized to prevent re-renders
  const tldOptions = useMemo(() => [
    { value: ".com", label: ".com", price: "$12.99", popular: true },
    { value: ".io", label: ".io", price: "$49.99", popular: true },
    { value: ".app", label: ".app", price: "$19.99", popular: false },
    { value: ".dev", label: ".dev", price: "$15.99", popular: false },
    { value: ".ai", label: ".ai", price: "$89.99", popular: false },
    { value: ".co", label: ".co", price: "$29.99", popular: false },
  ], []);

  // Enhanced suggestions generator
  const generateSuggestions = React.useCallback((searchTerm: string): Suggestion[] => {
    if (!searchTerm.trim()) return [];
    
    const prefixes = ["get", "try", "use", "my", "go", "the", "pro"];
    const suffixes = ["hub", "app", "pro", "lab", "zone", "tech", "ly", "io", "ai"];
    const categories = ["Business", "Tech", "Creative", "Personal", "Startup"];
    
    const suggestions: Suggestion[] = [];
    
    // Add direct match for selected TLD
    suggestions.push({
      domain: searchTerm,
      tld: selectedTld,
      available: Math.random() > 0.4,
      price: tldOptions.find(t => t.value === selectedTld)?.price || "$12.99",
      premium: Math.random() > 0.8,
      category: categories[Math.floor(Math.random() * categories.length)]
    });
    
    // Add variations for other TLDs
    tldOptions.forEach(tldOption => {
      if (tldOption.value !== selectedTld) {
        suggestions.push({
          domain: searchTerm,
          tld: tldOption.value,
          available: Math.random() > 0.3,
          price: tldOption.price,
          premium: Math.random() > 0.9,
          category: categories[Math.floor(Math.random() * categories.length)]
        });
      }
    });
    
    // Add prefix variations
    prefixes.slice(0, 3).forEach(prefix => {
      suggestions.push({
        domain: `${prefix}${searchTerm}`,
        tld: selectedTld,
        available: Math.random() > 0.6,
        price: tldOptions.find(t => t.value === selectedTld)?.price || "$12.99",
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    });
    
    // Add suffix variations
    suffixes.slice(0, 3).forEach(suffix => {
      const randomTld = tldOptions[Math.floor(Math.random() * tldOptions.length)];
      suggestions.push({
        domain: `${searchTerm}${suffix}`,
        tld: randomTld.value,
        available: Math.random() > 0.5,
        price: randomTld.price,
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    });
    
    return suggestions.slice(0, 12);
  }, [selectedTld, tldOptions]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);
        setAvailabilityStatus("checking");
        setHasSearched(true);
        
        // Simulate API call
        setTimeout(() => {
          const newSuggestions = generateSuggestions(query);
          setSuggestions(newSuggestions);
          setShowSuggestions(true);
          setIsLoading(false);
          
          // Set availability status based on first result
          if (newSuggestions.length > 0) {
            setAvailabilityStatus(newSuggestions[0].available ? "available" : "taken");
          }
        }, 1200);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setAvailabilityStatus("idle");
        setHasSearched(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, selectedTld, generateSuggestions]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const selected = suggestions[highlightedIndex];
          setQuery(selected.domain);
          setSelectedTld(selected.tld);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setIsLoading(true);
      setAvailabilityStatus("checking");
      setHasSearched(true);
      
      setTimeout(() => {
        const newSuggestions = generateSuggestions(query);
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        setIsLoading(false);
        
        if (newSuggestions.length > 0) {
          setAvailabilityStatus(newSuggestions[0].available ? "available" : "taken");
        }
      }, 1200);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Search Interface */}
      <div className="max-w-4xl mx-auto">
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5 blur-sm" />
          
          <div className="relative z-10">
            {/* Search Input Row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <div className={cn(
                  "relative flex items-center rounded-2xl border-2 transition-all duration-500",
                  "bg-gray-900/60 backdrop-blur-sm",
                  query ? "border-cyan-500/60 shadow-2xl shadow-cyan-500/25" : "border-gray-600/40",
                  "focus-within:border-cyan-400 focus-within:shadow-2xl focus-within:shadow-cyan-400/40",
                  "hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20"
                )}>
                  <Search className="absolute left-6 w-6 h-6 text-gray-400" />
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your domain name..."
                    className="w-full pl-16 pr-20 py-6 bg-transparent text-white placeholder-gray-400 text-xl font-medium focus:outline-none"
                    style={{ 
                      fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                    }}
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute right-6 flex items-center">
                    {isLoading ? (
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    ) : availabilityStatus === "available" ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-semibold">Available</span>
                      </div>
                    ) : availabilityStatus === "taken" ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <X className="w-5 h-5" />
                        <span className="text-sm font-semibold">Taken</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 border-0 rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* TLD Quick Selector */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-gray-400 text-sm font-medium mr-2">Popular extensions:</span>
              {tldOptions.slice(0, 4).map((tld) => (
                <button
                  key={tld.value}
                  onClick={() => setSelectedTld(tld.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform",
                    "backdrop-blur-sm border border-gray-600/40",
                    "hover:scale-105 hover:brightness-125",
                    selectedTld === tld.value
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 border-transparent"
                      : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/60 hover:text-white hover:border-gray-500/60"
                  )}
                >
                  {tld.label} <span className="text-xs opacity-75">{tld.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="max-w-6xl mx-auto mt-12">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-cyan-400 text-lg">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                Searching millions of domains...
              </div>
            </div>
          ) : showSuggestions && suggestions.length > 0 ? (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Search Results for "{query}"
                </h2>
                <p className="text-gray-400">
                  Found {suggestions.length} domain suggestions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={`${suggestion.domain}${suggestion.tld}`}
                    className={cn(
                      "group relative backdrop-blur-sm bg-gray-900/40 border border-gray-700/50 rounded-xl p-6 transition-all duration-300",
                      "hover:bg-gray-800/60 hover:border-gray-600/60 hover:shadow-lg hover:shadow-cyan-500/10",
                      "hover:-translate-y-1",
                      suggestion.available ? "hover:border-green-500/30" : "hover:border-red-500/30"
                    )}
                  >
                    {suggestion.premium && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Premium
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-bold text-lg">
                          {suggestion.domain}
                        </span>
                        <span className="px-2 py-1 bg-gray-700/60 text-gray-300 text-sm rounded-md font-medium">
                          {suggestion.tld}
                        </span>
                      </div>
                      
                      {suggestion.category && (
                        <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                          {suggestion.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-lg">
                          {suggestion.price}
                        </span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          suggestion.available
                            ? "bg-green-500/20 text-green-400 border border-green-500/40"
                            : "bg-red-500/20 text-red-400 border border-red-500/40"
                        )}>
                          {suggestion.available ? "Available" : "Taken"}
                        </span>
                      </div>

                      {suggestion.available && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : hasSearched && !isLoading ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg">
                No domains found for "{query}". Try a different search term.
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Popular Domains Section (shown when no search) */}
      {!hasSearched && (
        <div className="max-w-4xl mx-auto text-center mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {["startup", "tech", "app", "blog"].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="group p-4 backdrop-blur-sm bg-gray-900/30 border border-gray-700/40 rounded-xl hover:bg-gray-800/50 hover:border-gray-600/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-cyan-400 mb-2">
                  <Zap className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-white font-medium">{term}</div>
                <div className="text-gray-400 text-sm">Popular choice</div>
              </button>
            ))}
          </div>
          
          <p className="text-gray-400 text-sm">
            Click on a popular term above or start typing to search for your perfect domain.
          </p>
        </div>
      )}
    </div>
  );
}
