
import React from "react";
import Sidebar from "./Sidebar";
import NotesList from "./NotesList";
import Editor from "./Editor";
import { NotesProvider } from "@/context/NotesContext";
import { useMobileNav } from "@/context/MobileNavContext";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, isNotesListOpen, closePanels, openSidebar, openNotesList } = useMobileNav();

  return (
    <NotesProvider>
      <div className="h-full w-full flex overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar 
          isMobileSidebarOpen={isSidebarOpen}
          onCloseMobileSidebar={closePanels}
        />
        
        {/* Notes List */}
        <NotesList 
          isMobileNotesListOpen={isNotesListOpen}
          onCloseMobileNotesList={closePanels}
        />
        
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor 
            onMobileSidebarToggle={openSidebar}
            onMobileNotesListToggle={openNotesList}
          />
        </div>

        {/* Overlay for mobile when sidebar or notes list is open */}
        {(isSidebarOpen || isNotesListOpen) && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={closePanels}
            aria-hidden="true"
          />
        )}
      </div>
    </NotesProvider>
  );
};

export default Layout;
