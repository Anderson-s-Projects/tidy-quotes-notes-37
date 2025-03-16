import React, { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "javascript";
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  className = "" 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to handle tab indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert 2 spaces for tab
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      
      // Move cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Auto-detect language specific indent patterns
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      
      // Auto-close brackets and tags for corresponding languages
      const selectionStart = target.selectionStart;
      
      if (language === "html" && value.slice(selectionStart - 1, selectionStart) === "<") {
        // Check if we're trying to close a tag
        const tagMatches = value.slice(0, selectionStart).match(/<([a-zA-Z0-9]+)(?:\s[^>]*)?>(?:[^<]*)/g);
        if (tagMatches && value.slice(selectionStart, selectionStart + 1) === "/") {
          const lastTag = tagMatches[tagMatches.length - 1];
          const tagName = lastTag.match(/<([a-zA-Z0-9]+)/)?.[1];
          
          if (tagName) {
            // Auto-complete closing tag
            const closingTag = `/${tagName}>`;
            const newValue = value.slice(0, selectionStart) + closingTag + value.slice(selectionStart);
            onChange(newValue);
            
            // Position cursor after closing tag
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + closingTag.length;
              }
            }, 0);
          }
        }
      }

      // Auto-close brackets
      const lastChar = value.slice(selectionStart - 1, selectionStart);
      let closingChar = "";
      
      if (lastChar === "{") closingChar = "}";
      else if (lastChar === "(") closingChar = ")";
      else if (lastChar === "[") closingChar = "]";
      else if (lastChar === '"' && 
               !value.slice(0, selectionStart - 1).match(/\\$/)) closingChar = '"';
      else if (lastChar === "'" && 
               !value.slice(0, selectionStart - 1).match(/\\$/)) closingChar = "'";
      
      if (closingChar) {
        const newValue = value.slice(0, selectionStart) + closingChar + value.slice(selectionStart);
        onChange(newValue);
        
        // Keep cursor between brackets
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart;
          }
        }, 0);
      }
    };

    textarea.addEventListener("input", handleInput);
    return () => {
      textarea.removeEventListener("input", handleInput);
    };
  }, [value, language, onChange]);

  return (
    <div className={`relative font-mono text-sm ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full resize-none p-4 bg-transparent border-none outline-none focus:ring-0 custom-scrollbar"
        placeholder={language === "html" 
          ? "Enter HTML code..." 
          : language === "css" 
            ? "Enter CSS code..." 
            : "Enter JavaScript code..."}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-language={language}
      />
    </div>
  );
};

export default CodeEditor;
