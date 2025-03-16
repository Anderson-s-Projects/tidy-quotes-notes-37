
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
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [collapsedNotesList, setCollapsedNotesList] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    
    if (!isFullScreen) {
      const editorElement = document.querySelector('.editor-container');
      if (editorElement instanceof HTMLElement) {
        if (editorElement.requestFullscreen) {
          editorElement.requestFullscreen();
        } else if ((editorElement as any).webkitRequestFullscreen) {
          (editorElement as any).webkitRequestFullscreen();
        } else if ((editorElement as any).msRequestFullscreen) {
          (editorElement as any).msRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
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
      <div className={`h-full w-full flex overflow-hidden bg-background ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Resizable layout for desktop */}
        <div className="hidden md:flex h-full w-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Sidebar Panel */}
            {!collapsedSidebar ? (
              <ResizablePanel defaultSize={20} minSize={15}>
                <div className="relative h-full">
                  <Sidebar 
                    isMobileSidebarOpen={isSidebarOpen}
                    onCloseMobileSidebar={closePanels}
                  />
                  <button 
                    onClick={toggleSidebar}
                    className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-background rounded-full h-6 w-6 flex items-center justify-center z-10 shadow"
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
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-background rounded-full h-6 w-6 flex items-center justify-center z-10 shadow"
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
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="relative h-full">
                  <NotesList 
                    isMobileNotesListOpen={isNotesListOpen}
                    onCloseMobileNotesList={closePanels}
                  />
                  <button 
                    onClick={toggleNotesList}
                    className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-background rounded-full h-6 w-6 flex items-center justify-center z-10 shadow"
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
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-background rounded-full h-6 w-6 flex items-center justify-center z-10 shadow"
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
