
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NotesList from "./NotesList";
import Editor from "./Editor";
import { NotesProvider } from "@/context/NotesContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileNotesListOpen, setIsMobileNotesListOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile panels when switching to desktop
  useEffect(() => {
    if (!isMobile && (isMobileSidebarOpen || isMobileNotesListOpen)) {
      setIsMobileSidebarOpen(false);
      setIsMobileNotesListOpen(false);
    }
  }, [isMobile, isMobileSidebarOpen, isMobileNotesListOpen]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    if (isMobileNotesListOpen) setIsMobileNotesListOpen(false);
  };

  const toggleMobileNotesList = () => {
    setIsMobileNotesListOpen(!isMobileNotesListOpen);
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  const closeMobilePanels = () => {
    setIsMobileSidebarOpen(false);
    setIsMobileNotesListOpen(false);
  };

  return (
    <NotesProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar 
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={closeMobilePanels}
        />
        
        {/* Notes List */}
        <NotesList 
          isMobileNotesListOpen={isMobileNotesListOpen}
          onCloseMobileNotesList={closeMobilePanels}
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
            onClick={closeMobilePanels}
            aria-hidden="true"
          />
        )}
      </div>
    </NotesProvider>
  );
};

export default Layout;
