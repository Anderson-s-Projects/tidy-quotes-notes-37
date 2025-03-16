
import React, { useEffect, useRef, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { formatMarkdown, insertTab } from "@/utils/markdown";
import { Bold, Italic, Heading1, Heading2, Heading3, Link, List, ListOrdered, Code, Quote, Eye, Save, Trash2, Clock, FileText, Menu, FileIcon, Maximize, Minimize, Globe, Play } from "lucide-react";
import { CustomButton } from "./ui/CustomButton";
import { toast } from "sonner";
import CodeEditor from "./CodeEditor";

interface EditorProps {
  onMobileSidebarToggle: () => void;
  onMobileNotesListToggle: () => void;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
}

const Editor: React.FC<EditorProps> = ({
  onMobileSidebarToggle,
  onMobileNotesListToggle,
  isFullScreen = false,
  toggleFullScreen
}) => {
  const {
    selectedNoteId,
    getNote,
    updateNote,
    deleteNote
  } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<"html" | "css" | "javascript">("html");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (selectedNoteId) {
      const note = getNote(selectedNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setWordCount(countWords(note.content));
        setLastSaved(note.updatedAt);
        
        // Detect if note contains code
        if (note.title.toLowerCase().includes('.html') || 
            note.title.toLowerCase().includes('.css') || 
            note.title.toLowerCase().includes('.js')) {
          setIsCodeMode(true);
          if (note.title.toLowerCase().includes('.html')) setCodeLanguage("html");
          else if (note.title.toLowerCase().includes('.css')) setCodeLanguage("css");
          else if (note.title.toLowerCase().includes('.js')) setCodeLanguage("javascript");
        } else {
          setIsCodeMode(false);
        }
      }
    } else {
      setTitle("");
      setContent("");
      setWordCount(0);
      setLastSaved(null);
      setIsCodeMode(false);
    }
  }, [selectedNoteId, getNote]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Effect to update preview when in code mode
  useEffect(() => {
    if (isCodeMode && isPreviewMode && previewRef.current) {
      updateCodePreview();
    }
  }, [content, isCodeMode, isPreviewMode, codeLanguage]);

  const updateCodePreview = () => {
    if (!previewRef.current) return;

    const iframe = previewRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) return;
    
    let htmlContent = "";
    
    if (codeLanguage === "html") {
      htmlContent = content;
    } else if (codeLanguage === "css") {
      htmlContent = `
        <html>
          <head>
            <style>${content}</style>
          </head>
          <body>
            <div class="demo-element">CSS Preview</div>
            <div class="demo-paragraph">This is a paragraph to demonstrate your CSS.</div>
            <button class="demo-button">Button Element</button>
            <a href="#" class="demo-link">Link Element</a>
          </body>
        </html>
      `;
    } else if (codeLanguage === "javascript") {
      htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; }
              #output { border: 1px solid #ddd; padding: 15px; margin-top: 20px; min-height: 100px; }
            </style>
          </head>
          <body>
            <h4>JavaScript Preview</h4>
            <div>Open the console (F12) to see output</div>
            <div id="output">Output will appear here</div>
            <script>
              // Redirect console.log to the output div
              const originalLog = console.log;
              console.log = function(...args) {
                originalLog.apply(console, args);
                const output = document.getElementById('output');
                if (output) {
                  const text = args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  ).join(' ');
                  output.innerHTML += '<div>' + text + '</div>';
                }
              };
              
              // Run the user code
              try {
                ${content}
              } catch (error) {
                console.log('Error: ' + error.message);
              }
            </script>
          </body>
        </html>
      `;
    }
    
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-detect code mode based on file extension in the title
    if (newTitle.toLowerCase().includes('.html')) {
      setIsCodeMode(true);
      setCodeLanguage("html");
    } else if (newTitle.toLowerCase().includes('.css')) {
      setIsCodeMode(true);
      setCodeLanguage("css");
    } else if (newTitle.toLowerCase().includes('.js')) {
      setIsCodeMode(true);
      setCodeLanguage("javascript");
    }
    
    scheduleSave(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(countWords(newContent));
    scheduleSave(title, newContent);
  };

  const handleCodeChange = (value: string) => {
    setContent(value);
    scheduleSave(title, value);
  };

  const scheduleSave = (newTitle: string, newContent: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => {
      if (selectedNoteId) {
        updateNote(selectedNoteId, {
          title: newTitle,
          content: newContent
        });
        setIsSaving(false);
        setLastSaved(new Date());
      }
    }, 1000);
  };

  const handleFormat = (type: string) => {
    if (textareaRef.current) {
      const newContent = formatMarkdown(content, type);
      setContent(newContent);
      scheduleSave(title, newContent);
    }
  };

  const handleSave = () => {
    if (selectedNoteId) {
      updateNote(selectedNoteId, {
        title,
        content
      });
      setIsSaving(false);
      setLastSaved(new Date());
      toast.success("Note saved successfully");
    }
  };

  const handleDelete = () => {
    if (selectedNoteId && confirm("Are you sure you want to delete this note?")) {
      deleteNote(selectedNoteId);
    }
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const newContent = insertTab(content, selectionStart, selectionEnd);
      setContent(newContent);

      // Set cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }
  };

  const renderMarkdown = (text: string) => {
    let html = text.replace(/^# (.*$)/gm, '<h1>$1</h1>').replace(/^## (.*$)/gm, '<h2>$1</h2>').replace(/^### (.*$)/gm, '<h3>$1</h3>').replace(/^#### (.*$)/gm, '<h4>$1</h4>').replace(/^##### (.*$)/gm, '<h5>$1</h5>').replace(/^###### (.*$)/gm, '<h6>$1</h6>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');

    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');

    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 rounded">$1</code>');

    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>');

    let isInUl = false;
    const ulLines = html.split('\n').map(line => {
      if (line.match(/^- (.*$)/)) {
        const listItem = line.replace(/^- (.*)$/, '<li>$1</li>');
        if (!isInUl) {
          isInUl = true;
          return '<ul class="list-disc pl-5 my-2">' + listItem;
        }
        return listItem;
      } else if (isInUl) {
        isInUl = false;
        return '</ul>' + line;
      }
      return line;
    });
    if (isInUl) {
      ulLines.push('</ul>');
    }
    html = ulLines.join('\n');

    let isInOl = false;
    const olLines = html.split('\n').map(line => {
      if (line.match(/^\d+\. (.*$)/)) {
        const listItem = line.replace(/^\d+\. (.*)$/, '<li>$1</li>');
        if (!isInOl) {
          isInOl = true;
          return '<ol class="list-decimal pl-5 my-2">' + listItem;
        }
        return listItem;
      } else if (isInOl) {
        isInOl = false;
        return '</ol>' + line;
      }
      return line;
    });
    if (isInOl) {
      olLines.push('</ol>');
    }
    html = olLines.join('\n');

    html = html.replace(/\n/g, '<br />');
    return html;
  };

  return <div className={`flex flex-col h-full relative neu-flat m-2 md:m-0 rounded-lg ${isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none bg-background' : ''}`}>
      {!selectedNoteId ? <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 p-6 neu-card max-w-md">
            <FileText size={48} className="mx-auto text-muted-foreground opacity-50" />
            <h2 className="text-xl font-medium">No Note Selected</h2>
            <p className="text-muted-foreground">
              Select a note from the list or create a new one to start editing.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={onMobileNotesListToggle} className="md:hidden py-2 px-3 rounded-lg neu-button flex items-center gap-2">
                <FileIcon size={16} />
                View Notes
              </button>
              <button onClick={onMobileSidebarToggle} className="md:hidden py-2 px-3 rounded-lg neu-button flex items-center gap-2">
                <Menu size={16} />
                View Folders
              </button>
            </div>
          </div>
        </div> : <>
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="md:hidden flex items-center gap-2">
              <button onClick={onMobileSidebarToggle} className="h-8 w-8 rounded-lg neu-button flex items-center justify-center">
                <Menu size={16} />
              </button>
              <button onClick={onMobileNotesListToggle} className="h-8 w-8 rounded-lg neu-button flex items-center justify-center">
                <FileIcon size={16} />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-between ml-2 md:ml-0">
              <div className="flex items-center flex-wrap gap-1">
                {isCodeMode ? (
                  <>
                    <button 
                      onClick={() => setCodeLanguage("html")} 
                      className={`px-2 py-1 text-xs rounded-lg ${codeLanguage === "html" ? 'neu-pressed' : 'neu-button'}`}
                    >
                      HTML
                    </button>
                    <button 
                      onClick={() => setCodeLanguage("css")} 
                      className={`px-2 py-1 text-xs rounded-lg ${codeLanguage === "css" ? 'neu-pressed' : 'neu-button'}`}
                    >
                      CSS
                    </button>
                    <button 
                      onClick={() => setCodeLanguage("javascript")} 
                      className={`px-2 py-1 text-xs rounded-lg ${codeLanguage === "javascript" ? 'neu-pressed' : 'neu-button'}`}
                    >
                      JS
                    </button>
                    <button onClick={() => setIsCodeMode(false)} className="px-2 py-1 text-xs rounded-lg neu-button">
                      Text Mode
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleFormat("bold")} className="toolbar-button neu-button" title="Bold">
                      <Bold size={15} />
                    </button>
                    <button onClick={() => handleFormat("italic")} className="toolbar-button neu-button" title="Italic">
                      <Italic size={15} />
                    </button>
                    <button onClick={() => handleFormat("heading1")} className="toolbar-button neu-button" title="Heading 1">
                      <Heading1 size={15} />
                    </button>
                    <button onClick={() => handleFormat("heading2")} className="toolbar-button neu-button" title="Heading 2">
                      <Heading2 size={15} />
                    </button>
                    <button onClick={() => handleFormat("heading3")} className="toolbar-button neu-button" title="Heading 3">
                      <Heading3 size={15} />
                    </button>
                    <button onClick={() => handleFormat("link")} className="toolbar-button neu-button" title="Link">
                      <Link size={15} />
                    </button>
                    <button onClick={() => handleFormat("unorderedList")} className="toolbar-button neu-button" title="Bullet List">
                      <List size={15} />
                    </button>
                    <button onClick={() => handleFormat("orderedList")} className="toolbar-button neu-button" title="Numbered List">
                      <ListOrdered size={15} />
                    </button>
                    <button onClick={() => handleFormat("code")} className="toolbar-button neu-button" title="Code">
                      <Code size={15} />
                    </button>
                    <button onClick={() => handleFormat("quote")} className="toolbar-button neu-button" title="Quote">
                      <Quote size={15} />
                    </button>
                    <button onClick={() => setIsCodeMode(true)} className="px-2 py-1 text-xs rounded-lg neu-button">
                      Code Mode
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPreviewMode(!isPreviewMode)} 
                  className={`toolbar-button ${isPreviewMode ? 'neu-pressed' : 'neu-button'}`} 
                  title={isCodeMode ? "Toggle Live Preview" : "Toggle Preview Mode"}
                >
                  {isCodeMode ? <Globe size={15} /> : <Eye size={15} />}
                </button>
                {toggleFullScreen && (
                  <button onClick={toggleFullScreen} className="toolbar-button neu-button" title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Mode'}>
                    {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-3">
            <input 
              type="text" 
              value={title} 
              onChange={handleTitleChange} 
              placeholder={isCodeMode ? "Filename (e.g. index.html, styles.css, script.js)" : "Note title..."} 
              className="w-full text-xl font-medium bg-transparent border-none outline-none focus:ring-0 px-2 py-1 rounded-lg" 
            />
          </div>

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

          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
              </span>
              {isSaving && <span>Saving...</span>}
            </div>

            <div className="flex items-center gap-3">
              {!isCodeMode && <span>{wordCount} words</span>}
              
              <div className="flex items-center gap-1">
                <button onClick={handleSave} className="h-7 px-2 rounded-lg neu-button flex items-center text-xs">
                  <Save size={14} className="mr-1" />
                  Save
                </button>
                <button onClick={handleDelete} className="h-7 px-2 rounded-lg neu-button flex items-center text-xs text-destructive">
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>}
    </div>;
};

export default Editor;
