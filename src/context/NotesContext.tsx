
import React, { createContext, useContext, useEffect, useState } from "react";
import { Folder, Note, Tag } from "@/types";
import { sampleFolders, sampleNotes, sampleTags } from "@/utils/sampleData";
import { toast } from "sonner";

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  selectedNoteId: string | null;
  selectedFolderId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  setSelectedFolderId: (id: string | null) => void;
  getNote: (id: string) => Note | undefined;
  getNotesInFolder: (folderId: string) => Note[];
  getAllNotes: () => Note[];
  createNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addNoteToFolder: (noteId: string, folderId: string) => void;
  createFolder: (folder: Partial<Folder>) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [folders, setFolders] = useState<Folder[]>(sampleFolders);
  const [tags] = useState<Tag[]>(sampleTags);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(sampleNotes[0]?.id || null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const getNote = (id: string) => {
    return notes.find(note => note.id === id);
  };

  const getNotesInFolder = (folderId: string) => {
    return notes.filter(note => note.folderId === folderId);
  };
  
  const getAllNotes = () => {
    return notes;
  };

  const createNote = (note: Partial<Note>) => {
    const newNote: Note = {
      id: `note${Date.now()}`,
      title: note.title || "Untitled",
      content: note.content || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: note.tags || [],
      folderId: note.folderId || "folder1",
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    toast.success("Note created");
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date() } 
          : note
      )
    );
    toast.success("Note updated");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(notes.find(note => note.id !== id)?.id || null);
    }
    toast.success("Note deleted");
  };

  const addNoteToFolder = (noteId: string, folderId: string) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId 
          ? { ...note, folderId, updatedAt: new Date() } 
          : note
      )
    );
  };

  const createFolder = (folder: Partial<Folder>) => {
    const newFolder: Folder = {
      id: `folder${Date.now()}`,
      name: folder.name || "Untitled Folder",
      parentId: folder.parentId,
    };

    if (folder.parentId) {
      setFolders(prev => 
        prev.map(f => 
          f.id === folder.parentId 
            ? { 
                ...f, 
                children: [...(f.children || []), newFolder] 
              } 
            : f
        )
      );
    } else {
      setFolders(prev => [...prev, newFolder]);
    }
    toast.success("Folder created");
  };

  return (
    <NotesContext.Provider 
      value={{
        notes,
        folders,
        tags,
        selectedNoteId,
        selectedFolderId,
        setSelectedNoteId,
        setSelectedFolderId,
        getNote,
        getNotesInFolder,
        getAllNotes,
        createNote,
        updateNote,
        deleteNote,
        addNoteToFolder,
        createFolder,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
