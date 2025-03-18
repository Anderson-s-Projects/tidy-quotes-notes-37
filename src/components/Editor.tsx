
import React, { useEffect, useRef, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { formatMarkdown, insertTab, downloadNote } from "@/utils/markdown";
import { Menu, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { useEditorUtils } from "@/hooks/useEditorUtils";

// Import our new components
import EditorToolbar from "./editor/EditorToolbar";
import NoteHeader from "./editor/NoteHeader";
import EditorContent from "./editor/EditorContent";
import EditorFooter from "./editor/EditorFooter";
import EmptyEditorState from "./editor/EmptyEditorState";

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
  const [showTagManager, setShowTagManager] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"txt" | "md" | "html">("txt");
  
  const { renderMarkdown, updateCodePreview, previewRef } = useEditorUtils();

  useEffect(() => {
    if (selectedNoteId) {
      const note = getNote(selectedNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setWordCount(countWords(note.content));
        setLastSaved(note.updatedAt);
        
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

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
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

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }
  };

  const handleDownloadNote = (format: "txt" | "md" | "html") => {
    if (selectedNoteId) {
      const note = getNote(selectedNoteId);
      if (note) {
        downloadNote(note.title, note.content, format);
        toast.success(`Note downloaded as ${format.toUpperCase()}`);
      }
    }
  };

  const updateCodePreviewWrapper = () => {
    updateCodePreview(content, codeLanguage);
  };

  return (
    <div className={`flex flex-col h-full relative neu-flat m-2 md:m-0 rounded-lg ${isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none bg-background' : ''}`}>
      {!selectedNoteId ? (
        <EmptyEditorState 
          onMobileNotesListToggle={onMobileNotesListToggle}
          onMobileSidebarToggle={onMobileSidebarToggle}
        />
      ) : (
        <>
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="md:hidden flex items-center gap-2">
              <button onClick={onMobileSidebarToggle} className="h-8 w-8 rounded-lg neu-button flex items-center justify-center">
                <Menu size={16} />
              </button>
              <button onClick={onMobileNotesListToggle} className="h-8 w-8 rounded-lg neu-button flex items-center justify-center">
                <FileIcon size={16} />
              </button>
            </div>
            
            <EditorToolbar 
              isCodeMode={isCodeMode}
              codeLanguage={codeLanguage}
              setCodeLanguage={setCodeLanguage}
              setIsCodeMode={setIsCodeMode}
              handleFormat={handleFormat}
              isPreviewMode={isPreviewMode}
              setIsPreviewMode={setIsPreviewMode}
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
            />
          </div>

          <NoteHeader 
            title={title}
            handleTitleChange={handleTitleChange}
            selectedNoteId={selectedNoteId}
            getNote={getNote}
            downloadFormat={downloadFormat}
            setDownloadFormat={setDownloadFormat}
            handleDownloadNote={handleDownloadNote}
            isCodeMode={isCodeMode}
          />

          <EditorContent 
            isCodeMode={isCodeMode}
            isPreviewMode={isPreviewMode}
            content={content}
            handleContentChange={handleContentChange}
            handleCodeChange={handleCodeChange}
            handleTabKey={handleTabKey}
            codeLanguage={codeLanguage}
            renderMarkdown={renderMarkdown}
            updateCodePreview={updateCodePreviewWrapper}
          />

          <EditorFooter 
            lastSaved={lastSaved}
            isSaving={isSaving}
            wordCount={wordCount}
            isCodeMode={isCodeMode}
            handleSave={handleSave}
            handleDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default Editor;
