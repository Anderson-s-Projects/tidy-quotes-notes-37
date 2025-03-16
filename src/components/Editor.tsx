import React, { useEffect, useRef, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { formatMarkdown, insertTab } from "@/utils/markdown";
import { Bold, Italic, Heading1, Heading2, Heading3, Link, List, ListOrdered, Code, Quote, Eye, Save, Trash2, Clock, FileText, Menu, FileIcon, Maximize, Minimize } from "lucide-react";
import { CustomButton } from "./ui/CustomButton";
import { toast } from "sonner";

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
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedNoteId) {
      const note = getNote(selectedNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setWordCount(countWords(note.content));
        setLastSaved(note.updatedAt);
      }
    } else {
      setTitle("");
      setContent("");
      setWordCount(0);
      setLastSaved(null);
    }
  }, [selectedNoteId, getNote]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    scheduleSave(e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(countWords(newContent));
    scheduleSave(title, newContent);
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

  return <div className={`flex flex-col h-full relative neu-flat m-2 md:m-0 rounded-lg ${isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}>
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
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`toolbar-button ${isPreviewMode ? 'neu-pressed' : 'neu-button'}`} title="Toggle Preview Mode">
                  <Eye size={15} />
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
              placeholder="Note title..." 
              className="w-full text-xl font-medium bg-transparent border-none outline-none focus:ring-0 px-2 py-1 rounded-lg" 
            />
          </div>

          <div className="flex-1 overflow-hidden editor-container p-2">
            {isPreviewMode ? (
              <div 
                className="editor-content custom-scrollbar prose prose-sm max-w-none note-content p-4 neu-card h-full overflow-auto" 
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
              <span>{wordCount} words</span>
              
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
