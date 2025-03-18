
import React, { useEffect, useRef } from "react";
import CodeEditor from "../CodeEditor";

interface EditorContentProps {
  isCodeMode: boolean;
  isPreviewMode: boolean;
  content: string;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCodeChange: (value: string) => void;
  handleTabKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  codeLanguage: "html" | "css" | "javascript";
  renderMarkdown: (text: string) => string;
  updateCodePreview: () => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  isCodeMode,
  isPreviewMode,
  content,
  handleContentChange,
  handleCodeChange,
  handleTabKey,
  codeLanguage,
  renderMarkdown,
  updateCodePreview
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (isCodeMode && isPreviewMode && previewRef.current) {
      updateCodePreview();
    }
  }, [content, isCodeMode, isPreviewMode, codeLanguage, updateCodePreview]);

  return (
    <div className="flex-1 overflow-hidden editor-container p-2">
      {isCodeMode ? (
        <div className="h-full flex flex-col md:flex-row">
          <div className={`${isPreviewMode ? 'md:w-1/2 h-1/2 md:h-full' : 'w-full h-full'}`}>
            <CodeEditor 
              value={content}
              onChange={handleCodeChange}
              language={codeLanguage}
              className="h-full w-full neu-input p-0 overflow-auto"
            />
          </div>
          {isPreviewMode && (
            <div className="md:w-1/2 h-1/2 md:h-full md:pl-2 pt-2 md:pt-0">
              <div className="h-full neu-card p-0 overflow-hidden">
                <iframe
                  ref={previewRef}
                  title="Code Preview"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          )}
        </div>
      ) : isPreviewMode ? (
        <div 
          className="editor-content custom-scrollbar note-content p-4 neu-card h-full overflow-auto" 
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} 
        />
      ) : (
        <textarea 
          ref={textareaRef} 
          value={content} 
          onChange={handleContentChange} 
          onKeyDown={handleTabKey} 
          placeholder="Start writing..." 
          className="editor-content custom-scrollbar resize-none bg-transparent border-none outline-none focus:ring-0 font-mono text-sm leading-relaxed p-4 neu-input h-full w-full max-w-full" 
        />
      )}
    </div>
  );
};

export default EditorContent;
