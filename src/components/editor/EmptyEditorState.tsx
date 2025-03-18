
import React from "react";
import { FileText, FileIcon, Menu } from "lucide-react";

interface EmptyEditorStateProps {
  onMobileNotesListToggle: () => void;
  onMobileSidebarToggle: () => void;
}

const EmptyEditorState: React.FC<EmptyEditorStateProps> = ({
  onMobileNotesListToggle,
  onMobileSidebarToggle
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 p-6 neu-card max-w-md">
        <FileText size={48} className="mx-auto text-muted-foreground opacity-50" />
        <h2 className="text-xl font-medium">No Note Selected</h2>
        <p className="text-muted-foreground">
          Select a note from the list or create a new one to start editing.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={onMobileNotesListToggle} className="md:hidden py-2 px-3 rounded-lg neu-button flex items-center gap-2">
            <FileIcon size={16} />
            View Notes
          </button>
          <button onClick={onMobileSidebarToggle} className="md:hidden py-2 px-3 rounded-lg neu-button flex items-center gap-2">
            <Menu size={16} />
            View Folders
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyEditorState;
