
import React from "react";
import { Tag, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import TagManager from "../TagManager";
import { Note } from "@/types";

interface NoteHeaderProps {
  title: string;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedNoteId: string | null;
  getNote: (id: string) => Note | undefined;
  downloadFormat: "txt" | "md" | "html";
  setDownloadFormat: (format: "txt" | "md" | "html") => void;
  handleDownloadNote: (format: "txt" | "md" | "html") => void;
  isCodeMode: boolean;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({
  title,
  handleTitleChange,
  selectedNoteId,
  getNote,
  downloadFormat,
  setDownloadFormat,
  handleDownloadNote,
  isCodeMode
}) => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <input 
          type="text" 
          value={title} 
          onChange={handleTitleChange} 
          placeholder={isCodeMode ? "Filename (e.g. index.html, styles.css, script.js)" : "Note title..."} 
          className="w-full text-xl font-medium bg-transparent border-none outline-none focus:ring-0 px-2 py-1 rounded-lg" 
        />

        <div className="flex items-center space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="toolbar-button neu-button" 
                title="Manage tags"
              >
                <Tag size={15} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              {selectedNoteId && getNote(selectedNoteId) && (
                <TagManager 
                  noteId={selectedNoteId} 
                  tags={getNote(selectedNoteId)?.tags || []} 
                />
              )}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="toolbar-button neu-button" title="Download note">
                <Download size={15} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Download As</h3>
                <ToggleGroup type="single" value={downloadFormat} onValueChange={(value) => value && setDownloadFormat(value as "txt" | "md" | "html")}>
                  <ToggleGroupItem value="txt" size="sm">TXT</ToggleGroupItem>
                  <ToggleGroupItem value="md" size="sm">MD</ToggleGroupItem>
                  <ToggleGroupItem value="html" size="sm">HTML</ToggleGroupItem>
                </ToggleGroup>
                <button 
                  className="w-full py-1.5 px-3 rounded-lg neu-button flex items-center justify-center gap-1 text-xs"
                  onClick={() => handleDownloadNote(downloadFormat)}
                >
                  <Download size={12} />
                  Download {downloadFormat.toUpperCase()}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {selectedNoteId && getNote(selectedNoteId) && (
        <div className="mt-1 flex flex-wrap gap-1">
          {getNote(selectedNoteId)?.tags.map(tag => (
            <span 
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${tag.color}20`, 
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteHeader;
