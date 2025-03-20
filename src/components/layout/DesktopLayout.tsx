
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import NotesList from "../NotesList";
import Editor from "../Editor";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable";

interface DesktopLayoutProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ 
  isFullScreen, 
  toggleFullScreen 
}) => {
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [collapsedNotesList, setCollapsedNotesList] = useState(false);

  const toggleSidebar = () => {
    setCollapsedSidebar(!collapsedSidebar);
  };
  
  const toggleNotesList = () => {
    setCollapsedNotesList(!collapsedNotesList);
  };

  return (
    <div className="hidden md:flex h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Sidebar Panel */}
        {!collapsedSidebar ? (
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="relative h-full">
              <Sidebar 
                isMobileSidebarOpen={false}
                onCloseMobileSidebar={() => {}}
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
                isMobileNotesListOpen={false}
                onCloseMobileNotesList={() => {}}
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
            onMobileSidebarToggle={() => {}}
            onMobileNotesListToggle={() => {}}
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DesktopLayout;
