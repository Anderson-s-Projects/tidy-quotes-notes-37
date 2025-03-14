
import React, { createContext, useContext, useState } from "react";

interface MobileNavContextType {
  isSidebarOpen: boolean;
  isNotesListOpen: boolean;
  openSidebar: () => void;
  openNotesList: () => void;
  closePanels: () => void;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export const MobileNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);

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
