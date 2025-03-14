
import React, { useEffect, useRef, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { formatMarkdown, insertTab } from "@/utils/markdown";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link,
  List,
  ListOrdered,
  Code,
  Quote,
  Eye,
  Save,
  Trash2,
  Clock,
  FileText
} from "lucide-react";
import { CustomButton } from "./ui/CustomButton";
import { toast } from "sonner";

interface EditorProps {
  onMobileSidebarToggle: () => void;
  onMobileNotesListToggle: () => void;
}

const Editor: React.FC<EditorProps> = ({ 
  onMobileSidebarToggle,
  onMobileNotesListToggle
}) => {
  const { selectedNoteId, getNote, updateNote, deleteNote } = useNotes();
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
        updateNote(selectedNoteId, { title: newTitle, content: newContent });
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
      updateNote(selectedNoteId, { title, content });
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

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    // Convert headings
    let html = text
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // Convert bold and italic
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
    
    // Convert code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 rounded">$1</code>');
    
    // Convert blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>');
    
    // Convert unordered lists
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
    
    // Convert ordered lists
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
    
    // Convert line breaks
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {!selectedNoteId ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <FileText size={48} className="mx-auto text-muted-foreground opacity-50" />
            <h2 className="text-xl font-medium">No Note Selected</h2>
            <p className="text-muted-foreground max-w-md">
              Select a note from the list or create a new one to start editing.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <CustomButton 
                variant="outline" 
                size="sm"
                onClick={onMobileNotesListToggle}
                className="md:hidden"
              >
                View Notes
              </CustomButton>
              <CustomButton 
                variant="outline" 
                size="sm"
                onClick={onMobileSidebarToggle}
                className="md:hidden"
              >
                View Folders
              </CustomButton>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="md:hidden flex items-center gap-2">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={onMobileSidebarToggle}
                className="h-8 w-8 p-0 rounded-full"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" />
                </svg>
              </CustomButton>
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={onMobileNotesListToggle}
                className="h-8 w-8 p-0 rounded-full"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 3C4.22386 3 4 3.22386 4 3.5C4 3.77614 4.22386 4 4.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H4.5ZM1.95419 3.2059C1.9232 3.20857 1.89255 3.21407 1.86268 3.22239C1.83281 3.2307 1.8039 3.24178 1.7764 3.25548C1.74889 3.26918 1.72296 3.28539 1.69895 3.30386C1.67494 3.32233 1.65303 3.34292 1.63358 3.36533C1.61412 3.38775 1.59723 3.41184 1.58324 3.43726C1.56926 3.46268 1.5583 3.48925 1.55062 3.51656C1.54293 3.54387 1.53859 3.57172 1.5377 3.5998C1.5368 3.62789 1.53937 3.65582 1.54535 3.68329C1.55132 3.71075 1.56066 3.73753 1.57318 3.76313C1.5857 3.78873 1.60131 3.81297 1.61969 3.83528C1.63807 3.85759 1.65903 3.87777 1.68218 3.8954C1.70532 3.91303 1.73046 3.92799 1.75711 3.94001C1.78376 3.95203 1.81177 3.96099 1.84041 3.96671C1.86905 3.97243 1.89812 3.97486 1.92718 3.97398C2.0992 3.97001 2.26346 3.89938 2.3798 3.7798C2.49614 3.66021 2.56243 3.5011 2.5625 3.33542C2.56256 3.16973 2.49641 3.01058 2.38016 2.89092C2.26391 2.77126 2.09969 2.70052 1.92768 2.69645C1.89862 2.69556 1.86954 2.69799 1.8409 2.70371C1.81227 2.70944 1.78425 2.7184 1.7576 2.73041C1.73095 2.74243 1.70581 2.7574 1.68267 2.77503C1.65953 2.79266 1.63857 2.81284 1.62019 2.83515C1.60181 2.85745 1.5862 2.8817 1.57368 2.9073C1.56115 2.9329 1.55182 2.95968 1.54584 2.98714C1.53987 3.01461 1.5373 3.04254 1.5382 3.07063C1.53909 3.09871 1.54343 3.12656 1.55111 3.15387C1.5588 3.18118 1.56975 3.20775 1.58374 3.23317C1.59773 3.25859 1.61461 3.28267 1.63407 3.3051C1.65353 3.32752 1.67544 3.34811 1.69945 3.36658C1.72346 3.38505 1.74939 3.40126 1.7769 3.41496C1.8044 3.42865 1.83332 3.43974 1.86318 3.44805C1.89305 3.45637 1.9237 3.46187 1.95469 3.46454C1.98568 3.46721 2.01682 3.46721 2.04781 3.46454C2.12194 3.45935 2.195 3.44265 2.2648 3.4149C2.2648 3.4149 2.2648 3.20557 2.2648 3.20557C2.16714 3.24385 2.0604 3.25472 1.95714 3.2357C1.95616 3.2357 1.95518 3.2357 1.95419 3.2059ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H4.5ZM1.95419 7.2059C1.60339 7.25104 1.33533 7.54478 1.34393 7.89175C1.35254 8.23871 1.63736 8.51286 1.98475 8.53073C2.33214 8.54861 2.63889 8.28166 2.66841 7.93581C2.69794 7.58997 2.44141 7.27579 2.09875 7.22975C2.0533 7.22975 2.00785 7.22975 1.96241 7.22975C1.95967 7.22975 1.95693 7.22975 1.95419 7.2059ZM4.5 11C4.22386 11 4 11.2239 4 11.5C4 11.7761 4.22386 12 4.5 12H13.5C13.7761 12 14 11.7761 14 11.5C14 11.2239 13.7761 11 13.5 11H4.5ZM1.95419 11.2059C1.60339 11.251 1.33533 11.5448 1.34393 11.8918C1.35254 12.2387 1.63736 12.5129 1.98475 12.5307C2.33214 12.5486 2.63889 12.2817 2.66841 11.9358C2.69794 11.59 2.44141 11.2758 2.09875 11.2298C2.0533 11.2298 2.00785 11.2298 1.96241 11.2298C1.95967 11.2298 1.95693 11.2298 1.95419 11.2059Z" fill="currentColor" />
                </svg>
              </CustomButton>
            </div>
            
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("bold")}
                  className="toolbar-button"
                  title="Bold"
                >
                  <Bold size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("italic")}
                  className="toolbar-button"
                  title="Italic"
                >
                  <Italic size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("heading1")}
                  className="toolbar-button"
                  title="Heading 1"
                >
                  <Heading1 size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("heading2")}
                  className="toolbar-button"
                  title="Heading 2"
                >
                  <Heading2 size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("heading3")}
                  className="toolbar-button"
                  title="Heading 3"
                >
                  <Heading3 size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("link")}
                  className="toolbar-button"
                  title="Link"
                >
                  <Link size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("unorderedList")}
                  className="toolbar-button"
                  title="Bullet List"
                >
                  <List size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("orderedList")}
                  className="toolbar-button"
                  title="Numbered List"
                >
                  <ListOrdered size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("code")}
                  className="toolbar-button"
                  title="Code"
                >
                  <Code size={15} />
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormat("quote")}
                  className="toolbar-button"
                  title="Quote"
                >
                  <Quote size={15} />
                </CustomButton>
              </div>

              <div className="flex items-center">
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  isActive={isPreviewMode}
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="toolbar-button"
                  title="Toggle Preview Mode"
                >
                  <Eye size={15} />
                </CustomButton>
              </div>
            </div>
          </div>

          <div className="px-4 py-3">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note title..."
              className="w-full text-xl font-medium bg-transparent border-none outline-none focus:ring-0"
            />
          </div>

          <div className="flex-1 overflow-hidden editor-container">
            {isPreviewMode ? (
              <div 
                className="editor-content custom-scrollbar prose prose-sm max-w-none note-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleTabKey}
                placeholder="Start writing..."
                className="editor-content custom-scrollbar resize-none bg-transparent border-none outline-none focus:ring-0 font-mono text-sm leading-relaxed"
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
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSave}
                  className="h-7 px-2 text-xs"
                >
                  <Save size={14} className="mr-1" />
                  Save
                </CustomButton>
                <CustomButton 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDelete}
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </CustomButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Editor;
