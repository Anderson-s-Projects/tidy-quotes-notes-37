
import React, { createContext, useContext, useState, useEffect } from "react";

interface MobileNavContextType {
  isSidebarOpen: boolean;
  isNotesListOpen: boolean;
  openSidebar: () => void;
  openNotesList: () => void;
  closePanels: () => void;
  isMobile: boolean;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export const MobileNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
    setIsNotesListOpen(false);
  };

  const openNotesList = () => {
    setIsNotesListOpen(true);
    setIsSidebarOpen(false);
  };

  const closePanels = () => {
    setIsSidebarOpen(false);
    setIsNotesListOpen(false);
  };

  return (
    <MobileNavContext.Provider
      value={{
        isSidebarOpen,
        isNotesListOpen,
        openSidebar,
        openNotesList,
        closePanels,
        isMobile
      }}
    >
      {children}
    </MobileNavContext.Provider>
  );
};

export const useMobileNav = () => {
  const context = useContext(MobileNavContext);
  if (context === undefined) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }
  return context;
};
