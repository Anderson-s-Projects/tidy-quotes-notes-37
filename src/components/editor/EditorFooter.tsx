
import React from "react";
import { Clock, Save, Trash2 } from "lucide-react";

interface EditorFooterProps {
  lastSaved: Date | null;
  isSaving: boolean;
  wordCount: number;
  isCodeMode: boolean;
  handleSave: () => void;
  handleDelete: () => void;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  lastSaved,
  isSaving,
  wordCount,
  isCodeMode,
  handleSave,
  handleDelete
}) => {
  return (
    <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
        </span>
        {isSaving && <span>Saving...</span>}
      </div>

      <div className="flex items-center gap-3">
        {!isCodeMode && <span>{wordCount} words</span>}
        
        <div className="flex items-center gap-1">
          <button onClick={handleSave} className="h-7 px-2 rounded-lg neu-button flex items-center text-xs">
            <Save size={14} className="mr-1" />
            Save
          </button>
          <button onClick={handleDelete} className="h-7 px-2 rounded-lg neu-button flex items-center text-xs text-destructive">
            <Trash2 size={14} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorFooter;
