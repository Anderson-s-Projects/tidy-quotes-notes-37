
import React, { useEffect, useState } from "react";
import { Quote } from "@/types";
import { getRandomQuote } from "@/utils/sampleData";
import { RefreshCw, Share2, Bookmark, ArrowRight } from "lucide-react";
import { CustomButton } from "./ui/CustomButton";
import { toast } from "sonner";

const QuoteWidget: React.FC = () => {
  const [quote, setQuote] = useState<Quote>(getRandomQuote());
  const [isChanging, setIsChanging] = useState(false);

  const handleNewQuote = () => {
    setIsChanging(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsChanging(false);
    }, 300);
  };

  const handleSaveQuote = () => {
    toast.success("Quote saved to favorites");
  };

  const handleShareQuote = () => {
    toast.success("Quote copied to clipboard");
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
  };

  return (
    <div className="glass-panel rounded-lg p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Daily Inspiration <ArrowRight size={14} />
        </h3>
        <CustomButton 
          variant="ghost" 
          size="sm" 
          onClick={handleNewQuote} 
          className="h-7 w-7 p-0 rounded-full"
        >
          <RefreshCw size={14} />
          <span className="sr-only">New Quote</span>
        </CustomButton>
      </div>
      
      <div className={`space-y-3 transition-opacity duration-300 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
        <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
      
      <div className="flex items-center justify-end space-x-2 pt-2">
        <CustomButton 
          variant="ghost" 
          size="sm" 
          onClick={handleSaveQuote}
          className="h-8 w-8 p-0 rounded-full"
        >
          <Bookmark size={16} />
          <span className="sr-only">Save Quote</span>
        </CustomButton>
        <CustomButton 
          variant="ghost" 
          size="sm" 
          onClick={handleShareQuote}
          className="h-8 w-8 p-0 rounded-full"
        >
          <Share2 size={16} />
          <span className="sr-only">Share Quote</span>
        </CustomButton>
      </div>
    </div>
  );
};

export default QuoteWidget;
