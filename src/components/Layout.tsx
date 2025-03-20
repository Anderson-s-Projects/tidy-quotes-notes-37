
import React from "react";
import { NotesProvider } from "@/context/NotesContext";
import DesktopLayout from "./layout/DesktopLayout";
import MobileLayout from "./layout/MobileLayout";
import { useFullScreen } from "@/hooks/useFullScreen";
import { useViewportHeight } from "@/hooks/useViewportHeight";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  useViewportHeight();

  return (
    <NotesProvider>
      <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-background">
        <DesktopLayout 
          isFullScreen={isFullScreen} 
          toggleFullScreen={toggleFullScreen} 
        />
        <MobileLayout 
          isFullScreen={isFullScreen} 
          toggleFullScreen={toggleFullScreen} 
        />
      </div>
    </NotesProvider>
  );
};

export default Layout;
