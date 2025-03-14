
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import NotesList from "./NotesList";
import Editor from "./Editor";
import { NotesProvider } from "@/context/NotesContext";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileNotesListOpen, setIsMobileNotesListOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    if (isMobileNotesListOpen) setIsMobileNotesListOpen(false);
  };

  const toggleMobileNotesList = () => {
    setIsMobileNotesListOpen(!isMobileNotesListOpen);
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  return (
    <NotesProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar 
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Notes List */}
        <NotesList 
          isMobileNotesListOpen={isMobileNotesListOpen}
          onCloseMobileNotesList={() => setIsMobileNotesListOpen(false)}
        />
        
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor 
            onMobileSidebarToggle={toggleMobileSidebar}
            onMobileNotesListToggle={toggleMobileNotesList}
          />
        </div>

        {/* Overlay for mobile when sidebar or notes list is open */}
        {(isMobileSidebarOpen || isMobileNotesListOpen) && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => {
              setIsMobileSidebarOpen(false);
              setIsMobileNotesListOpen(false);
            }}
          />
        )}
      </div>
    </NotesProvider>
  );
};

export default Layout;
