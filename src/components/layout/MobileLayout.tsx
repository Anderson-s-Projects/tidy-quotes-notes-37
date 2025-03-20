
import React from "react";
import { useMobileNav } from "@/context/MobileNavContext";
import Sidebar from "../Sidebar";
import NotesList from "../NotesList";
import Editor from "../Editor";
import { ThemeToggle } from "../ThemeToggle";

interface MobileLayoutProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  isFullScreen, 
  toggleFullScreen 
}) => {
  const { 
    isSidebarOpen, 
    isNotesListOpen, 
    closePanels, 
    openSidebar, 
    openNotesList 
  } = useMobileNav();

  return (
    <>
      <div className="md:hidden flex flex-col h-full w-full mobile-container">
        {/* Mobile header with buttons */}
        <div className="flex justify-between items-center p-2 border-b border-border mobile-header">
          <button 
            onClick={openSidebar}
            className="h-9 w-9 neu-button flex items-center justify-center rounded-full"
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18"></path>
              <path d="M3 6h18"></path>
              <path d="M3 18h18"></path>
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Notes</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={openNotesList}
              className="h-9 w-9 neu-button flex items-center justify-center rounded-full"
              aria-label="Open notes list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden mobile-content">
          <Editor 
            onMobileSidebarToggle={openSidebar}
            onMobileNotesListToggle={openNotesList}
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
          />
        </div>
        
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
      </div>

      {/* Overlay for mobile when sidebar or notes list is open */}
      {(isSidebarOpen || isNotesListOpen) && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={closePanels}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default MobileLayout;
