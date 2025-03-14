
import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types";
import { format } from "date-fns";
import { Search, Plus, Filter, SortDesc, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomButton } from "./ui/CustomButton";

interface NotesListProps {
  isMobileNotesListOpen: boolean;
  onCloseMobileNotesList: () => void;
}

const NotesList: React.FC<NotesListProps> = ({
  isMobileNotesListOpen,
  onCloseMobileNotesList
}) => {
  const { 
    notes, 
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
    if (window.innerWidth < 768) {
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
    // Remove markdown syntax for preview
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
        "flex flex-col bg-background border-r border-border h-full transition-all duration-300 ease-in-out",
        "w-full md:w-72 lg:w-80",
        "md:translate-x-0 md:relative",
        isMobileNotesListOpen ? "translate-x-0 absolute inset-y-0 left-0 z-40" : "-translate-x-full"
      )}
    >
      <div className="flex justify-between items-center p-3 border-b border-border">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full h-9 pl-9 pr-3 rounded-md bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="md:hidden ml-2 p-1 rounded-md hover:bg-accent"
          onClick={onCloseMobileNotesList}
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex justify-between items-center p-3 border-b border-border">
        <h2 className="font-semibold text-sm truncate">
          {selectedFolderId 
            ? folders.find(f => f.id === selectedFolderId)?.name || 'Selected Folder'
            : 'All Notes'
          }
        </h2>
        <div className="flex gap-1">
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={toggleSortOrder}
            className="h-7 w-7 p-0 rounded-full"
            title={`Sort by ${sortOrder === 'newest' ? 'oldest first' : sortOrder === 'oldest' ? 'alphabetical' : 'newest first'}`}
          >
            {sortOrder === 'alphabetical' ? <ArrowUpDown size={14} /> : <SortDesc size={14} />}
            <span className="sr-only">Sort</span>
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full"
            title="Filter notes"
          >
            <Filter size={14} />
            <span className="sr-only">Filter</span>
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={handleCreateNote}
            className="h-7 w-7 p-0 rounded-full bg-primary/10 hover:bg-primary/20"
            title="Create new note"
          >
            <Plus size={14} className="text-primary" />
            <span className="sr-only">New Note</span>
          </CustomButton>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-muted-foreground text-sm mb-3">No notes found</p>
            <CustomButton 
              variant="outline" 
              size="sm" 
              onClick={handleCreateNote}
              className="flex items-center gap-1"
            >
              <Plus size={14} /> Create New Note
            </CustomButton>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotes.map((note, index) => (
              <div 
                key={note.id}
                className={cn(
                  "note-item p-3 cursor-pointer transition-all",
                  selectedNoteId === note.id ? "bg-accent/30" : "hover:bg-accent/10",
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
                        className="tag"
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
