
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NotesList from "./NotesList";
import Editor from "./Editor";
import { NotesProvider } from "@/context/NotesContext";
import { useMobileNav } from "@/context/MobileNavContext";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, isNotesListOpen, closePanels, openSidebar, openNotesList } = useMobileNav();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [collapsedNotesList, setCollapsedNotesList] = useState(false);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      const editorElement = document.querySelector('.editor-container');
      if (editorElement instanceof HTMLElement) {
        if (editorElement.requestFullscreen) {
          editorElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        } else if ((editorElement as any).webkitRequestFullscreen) {
          (editorElement as any).webkitRequestFullscreen();
        } else if ((editorElement as any).mozRequestFullScreen) {
          (editorElement as any).mozRequestFullScreen();
        } else if ((editorElement as any).msRequestFullscreen) {
          (editorElement as any).msRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };
  
  const toggleSidebar = () => {
    setCollapsedSidebar(!collapsedSidebar);
  };
  
  const toggleNotesList = () => {
    setCollapsedNotesList(!collapsedNotesList);
  };

  return (
    <NotesProvider>
      <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-background">
        {/* Desktop layout */}
        <div className="hidden md:flex h-full w-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Sidebar Panel */}
            {!collapsedSidebar ? (
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="relative h-full">
                  <Sidebar 
                    isMobileSidebarOpen={isSidebarOpen}
                    onCloseMobileSidebar={closePanels}
                  />
                  <button 
                    onClick={toggleSidebar}
                    className="sidebar-toggle-button"
                    aria-label="Toggle sidebar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                </div>
              </ResizablePanel>
            ) : (
              <div className="relative">
                <button 
                  onClick={toggleSidebar}
                  className="absolute top-4 left-2 bg-background rounded-full h-8 w-8 flex items-center justify-center z-10 shadow"
                  aria-label="Show sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
            
            {!collapsedSidebar && <ResizableHandle withHandle />}
            
            {/* Notes List Panel */}
            {!collapsedNotesList ? (
              <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                <div className="relative h-full">
                  <NotesList 
                    isMobileNotesListOpen={isNotesListOpen}
                    onCloseMobileNotesList={closePanels}
                  />
                  <button 
                    onClick={toggleNotesList}
                    className="sidebar-toggle-button"
                    aria-label="Toggle notes list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                </div>
              </ResizablePanel>
            ) : (
              <div className="relative">
                <button 
                  onClick={toggleNotesList}
                  className="absolute top-4 left-2 bg-background rounded-full h-8 w-8 flex items-center justify-center z-10 shadow"
                  aria-label="Show notes list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
            
            {!collapsedNotesList && <ResizableHandle withHandle />}
            
            {/* Editor Panel */}
            <ResizablePanel defaultSize={collapsedSidebar && collapsedNotesList ? 100 : 50} minSize={30}>
              <Editor 
                onMobileSidebarToggle={openSidebar}
                onMobileNotesListToggle={openNotesList}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile layout - Separate drawer approach */}
        <div className="md:hidden flex flex-col h-full w-full">
          {/* Mobile header with buttons */}
          <div className="flex justify-between items-center p-2 border-b border-border">
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

          {/* Main content area */}
          <div className="flex-1 overflow-hidden">
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
      </div>
    </NotesProvider>
  );
};

export default Layout;
