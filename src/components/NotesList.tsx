
import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { useMobileNav } from "@/context/MobileNavContext";
import { format } from "date-fns";
import { Search, Plus, Filter, SortDesc, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesListProps {
  isMobileNotesListOpen: boolean;
  onCloseMobileNotesList: () => void;
}

const NotesList: React.FC<NotesListProps> = ({
  isMobileNotesListOpen,
  onCloseMobileNotesList
}) => {
  const { isMobile } = useMobileNav();
  const { 
    notes, 
    folders,
    selectedNoteId, 
    setSelectedNoteId, 
    selectedFolderId,
    createNote
  } = useNotes();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  const filteredNotes = notes
    .filter(note => 
      (selectedFolderId ? note.folderId === selectedFolderId : true) &&
      (searchTerm 
        ? note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      )
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else if (sortOrder === 'oldest') {
        return a.updatedAt.getTime() - b.updatedAt.getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    if (isMobile) {
      onCloseMobileNotesList();
    }
  };

  const handleCreateNote = () => {
    createNote({ 
      title: "Untitled Note", 
      content: "", 
      folderId: selectedFolderId || undefined 
    });
  };

  const toggleSortOrder = () => {
    if (sortOrder === 'newest') {
      setSortOrder('oldest');
    } else if (sortOrder === 'oldest') {
      setSortOrder('alphabetical');
    } else {
      setSortOrder('newest');
    }
  };

  const renderPreview = (content: string) => {
    return content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\n/g, ' ')
      .slice(0, 80) + (content.length > 80 ? '...' : '');
  };

  return (
    <div 
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out neu-flat",
        "md:h-full md:w-72 lg:w-80 md:mr-2 md:m-0",
        "md:translate-x-0 md:relative",
        isMobile ? (
          isMobileNotesListOpen 
            ? "fixed inset-y-0 right-0 z-40 w-[280px] m-0 h-full rounded-none" 
            : "hidden"
        ) : ""
      )}
    >
      <div className="flex justify-between items-center p-3 border-b border-border">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-background text-sm focus:outline-none neu-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {isMobile && (
          <button 
            className="ml-2 p-1 rounded-lg neu-button"
            onClick={onCloseMobileNotesList}
            aria-label="Close notes list"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className="flex justify-between items-center p-3 border-b border-border">
        <h2 className="font-semibold text-sm truncate">
          {selectedFolderId 
            ? folders.find(f => f.id === selectedFolderId)?.name || 'Selected Folder'
            : 'All Notes'
          }
        </h2>
        <div className="flex gap-1">
          <button
            onClick={toggleSortOrder}
            className="h-7 w-7 rounded-full neu-button flex items-center justify-center"
            title={`Sort by ${sortOrder === 'newest' ? 'oldest first' : sortOrder === 'oldest' ? 'alphabetical' : 'newest first'}`}
            aria-label="Change sort order"
          >
            {sortOrder === 'alphabetical' ? <ArrowUpDown size={14} /> : <SortDesc size={14} />}
          </button>
          <button
            className="h-7 w-7 rounded-full neu-button flex items-center justify-center"
            title="Filter notes"
            aria-label="Filter notes"
          >
            <Filter size={14} />
          </button>
          <button
            onClick={handleCreateNote}
            className="h-7 w-7 rounded-full neu-button flex items-center justify-center"
            title="Create new note"
            aria-label="Create new note"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-muted-foreground text-sm mb-3">No notes found</p>
            <button 
              onClick={handleCreateNote}
              className="flex items-center gap-1 py-2 px-3 rounded-lg neu-button"
            >
              <Plus size={14} /> Create New Note
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredNotes.map((note, index) => (
              <div 
                key={note.id}
                className={cn(
                  "p-3 cursor-pointer transition-all rounded-lg",
                  selectedNoteId === note.id ? "neu-pressed" : "neu-button",
                  "animate-slide-in-left"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleNoteClick(note.id)}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-sm truncate">{note.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {renderPreview(note.content)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {format(note.updatedAt, 'MMM d, yyyy')}
                    </span>
                    {note.tags.length > 0 && (
                      <span 
                        className="tag px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${note.tags[0].color}20`, color: note.tags[0].color }}
                      >
                        {note.tags[0].name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
