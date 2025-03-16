
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import NotesList from "./NotesList";
import Editor from "./Editor";
import { NotesProvider } from "@/context/NotesContext";
import { useMobileNav } from "@/context/MobileNavContext";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, isNotesListOpen, closePanels, openSidebar, openNotesList } = useMobileNav();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <NotesProvider>
      <div className={`h-full w-full flex overflow-hidden bg-background ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Resizable layout for desktop */}
        <div className="hidden md:flex h-full w-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Sidebar Panel */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <Sidebar 
                isMobileSidebarOpen={isSidebarOpen}
                onCloseMobileSidebar={closePanels}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Notes List Panel */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
              <NotesList 
                isMobileNotesListOpen={isNotesListOpen}
                onCloseMobileNotesList={closePanels}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Editor Panel */}
            <ResizablePanel defaultSize={50}>
              <Editor 
                onMobileSidebarToggle={openSidebar}
                onMobileNotesListToggle={openNotesList}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex w-full h-full">
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
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
            />
          </div>
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
