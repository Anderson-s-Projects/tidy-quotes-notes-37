
import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import QuoteWidget from "./QuoteWidget";
import { 
  FolderIcon, 
  ChevronDown, 
  ChevronRight, 
  Tag, 
  Plus,
  Briefcase,
  User,
  LightbulbIcon,
  Settings,
  FileTextIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomButton } from "./ui/CustomButton";
import { toast } from "sonner";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileSidebarOpen,
  onCloseMobileSidebar
}) => {
  const { 
    folders, 
    tags, 
    selectedFolderId, 
    setSelectedFolderId,
    createFolder
  } = useNotes();
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    folder1: true,
    folder2: true
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId);
    if (window.innerWidth < 768) {
      onCloseMobileSidebar();
    }
  };
  
  const handleAllNotesClick = () => {
    setSelectedFolderId(null);
    if (window.innerWidth < 768) {
      onCloseMobileSidebar();
    }
  };

  const handleAddFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      createFolder({ name });
    }
  };

  const handleTagClick = (tagId: string) => {
    toast.info(`Tag filter not implemented yet`);
  };

  const iconMap = {
    "Personal": <User size={16} />,
    "Work": <Briefcase size={16} />,
    "Ideas": <LightbulbIcon size={16} />
  };

  const renderFolderIcon = (name: string) => {
    return iconMap[name as keyof typeof iconMap] || <FolderIcon size={16} />;
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full w-64 transition-all duration-300 ease-in-out neu-flat",
        "md:translate-x-0 md:relative mr-2 md:mr-3",
        isMobileSidebarOpen ? "translate-x-0 absolute inset-y-0 left-0 z-50 m-2" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4">
          <h1 className="text-xl font-semibold tracking-tight mb-1">Notes</h1>
          <p className="text-xs text-muted-foreground">Capture your thoughts elegantly</p>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar px-3">
          <div className="space-y-6">
            {/* All Notes Button */}
            <div 
              className={cn(
                "flex items-center py-2 px-3 rounded-lg text-sm cursor-pointer mb-2 animate-fade-in transition-all",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                selectedFolderId === null ? "neu-pressed font-medium" : "neu-button"
              )}
              onClick={handleAllNotesClick}
            >
              <span className="mr-2"><FileTextIcon size={16} /></span>
              <span>All Notes</span>
            </div>
            
            {/* Folders section */}
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Folders</h2>
                <button 
                  onClick={handleAddFolder}
                  className="h-6 w-6 p-0 rounded-full neu-button flex items-center justify-center"
                >
                  <Plus size={14} />
                  <span className="sr-only">Add Folder</span>
                </button>
              </div>

              <div className="space-y-2">
                {folders.map(folder => (
                  <div key={folder.id} className="animate-slide-in-left" style={{ animationDelay: `${folders.indexOf(folder) * 50}ms` }}>
                    <div
                      className={cn(
                        "flex items-center py-2 px-3 rounded-lg text-sm cursor-pointer transition-all",
                        selectedFolderId === folder.id ? "neu-pressed font-medium" : "neu-button"
                      )}
                      onClick={() => handleFolderClick(folder.id)}
                    >
                      {folder.children && folder.children.length > 0 ? (
                        <button 
                          className="mr-1 h-4 w-4 flex items-center justify-center rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder(folder.id);
                          }}
                        >
                          {expandedFolders[folder.id] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                      ) : (
                        <span className="w-4 mr-1" />
                      )}
                      <span className="mr-2">{renderFolderIcon(folder.name)}</span>
                      <span>{folder.name}</span>
                    </div>

                    {folder.children && expandedFolders[folder.id] && (
                      <div className="ml-6 pl-2 mt-1 space-y-1">
                        {folder.children.map(childFolder => (
                          <div
                            key={childFolder.id}
                            className={cn(
                              "flex items-center py-2 px-3 rounded-lg text-sm cursor-pointer transition-all",
                              selectedFolderId === childFolder.id ? "neu-pressed font-medium" : "neu-button"
                            )}
                            onClick={() => handleFolderClick(childFolder.id)}
                          >
                            <span className="mr-2"><FolderIcon size={14} /></span>
                            <span>{childFolder.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags section */}
            <div>
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">Tags</h2>
              <div className="flex flex-wrap gap-2 px-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    className="tag neu-button px-3 py-1"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                    onClick={() => handleTagClick(tag.id)}
                  >
                    <Tag size={10} className="mr-1" />
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote widget */}
            <div className="pb-4 px-2">
              <div className="neu-card">
                <QuoteWidget />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex items-center">
          <button 
            className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors flex items-center py-2 px-3 rounded-lg neu-button"
          >
            <Settings size={16} className="mr-2" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
