"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DomainSuggesterProps {
  onSuggestionSelect: (domain: string) => void;
}

export const DomainSuggester = ({ onSuggestionSelect }: DomainSuggesterProps) => {
  const [keywords, setKeywords] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getSuggestions = async () => {
    if (!keywords.trim()) {
      toast({
        title: 'Keywords required',
        description: 'Please enter some keywords to get suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch('/api/domains/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch suggestions.');
      }

      setSuggestions(data.suggestions || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    toast({
      title: 'Selected!',
      description: `"${suggestion}" has been added to the purchase form.`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      getSuggestions();
    }
  };

  return (
    <div className="my-6 sm:my-8 p-4 sm:p-6 border border-slate-700/50 rounded-xl shadow-lg bg-slate-900/30 backdrop-blur-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-cyan-400" />
        <h3 className="text-base sm:text-lg font-semibold text-slate-100">
          Need ideas? Get AI-powered domain suggestions!
        </h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="e.g., 'saas for developers', 'ai photo editor'"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-grow bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
          aria-label="Enter keywords for domain suggestions"
        />
        <Button 
          onClick={getSuggestions} 
          disabled={isLoading || !keywords.trim()} 
          className="w-full sm:w-auto bg-cyan-500 text-black hover:bg-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
          aria-label={isLoading ? "Loading suggestions" : "Get domain suggestions"}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="hidden sm:inline">Loading...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Suggest Domains</span>
              <span className="sm:hidden">Suggest</span>
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="flex space-x-2 sm:space-x-3 overflow-hidden pb-2" role="status" aria-label="Loading suggestions">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-8 sm:h-10 w-24 sm:w-36 bg-slate-700/50 rounded-full animate-pulse shrink-0" 
            />
          ))}
        </div>
      )}

      {suggestions.length > 0 && !isLoading && (
        <div className="relative" role="region" aria-label="Domain suggestions">
          <div className="flex gap-2 sm:gap-3 pb-2 overflow-x-auto scrollbar-hide">
            {suggestions.map((domain) => (
              <button
                key={domain}
                onClick={() => handleSuggestionClick(domain)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSuggestionClick(domain);
                  }
                }}
                className="
                  shrink-0
                  whitespace-nowrap
                  px-3 py-2 sm:px-4 sm:py-2
                  text-sm sm:text-base
                  rounded-full
                  border-2 border-cyan-400/50
                  text-cyan-400
                  font-semibold
                  transition-all
                  duration-300
                  hover:bg-cyan-400 hover:text-black
                  hover:shadow-lg hover:shadow-cyan-500/30
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900
                  active:scale-95
                "
                aria-label={`Select domain suggestion: ${domain}`}
                tabIndex={0}
              >
                {domain}
              </button>
            ))}
          </div>
          
          {/* Fade effects for scrollable area */}
          <div className="absolute top-0 right-0 h-full w-4 sm:w-8 bg-gradient-to-l from-slate-900/30 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 h-full w-4 sm:w-8 bg-gradient-to-r from-slate-900/30 to-transparent pointer-events-none" />
        </div>
      )}

      {suggestions.length === 0 && !isLoading && keywords.trim() && (
        <div className="text-center py-4 text-slate-400 text-sm">
          No suggestions found. Try different keywords.
        </div>
      )}
    </div>
  );
};
