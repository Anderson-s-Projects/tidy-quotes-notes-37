
import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import { Tag, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag as TagType } from "@/types";

interface TagManagerProps {
  noteId: string;
  tags: TagType[];
}

const TagManager: React.FC<TagManagerProps> = ({ noteId, tags }) => {
  const { tags: allTags, updateNote, addTag, removeTag } = useNotes();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#8B5CF6");
  
  const handleAddTag = () => {
    if (newTagName.trim()) {
      // Check if tag already exists
      const existingTag = allTags.find(
        tag => tag.name.toLowerCase() === newTagName.toLowerCase()
      );
      
      if (existingTag) {
        // Add existing tag to note
        const updatedTags = [...tags, existingTag];
        updateNote(noteId, { tags: updatedTags });
      } else {
        // Create new tag and add to note
        const newTag = addTag({ name: newTagName, color: newTagColor });
        const updatedTags = [...tags, newTag];
        updateNote(noteId, { tags: updatedTags });
      }
      
      // Reset form
      setNewTagName("");
      setIsAddingTag(false);
    }
  };
  
  const handleRemoveTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    updateNote(noteId, { tags: updatedTags });
  };
  
  const handleTagClick = (tagId: string) => {
    // This could be expanded to filter notes by tag
    console.log(`Filter by tag: ${tagId}`);
  };
  
  const predefinedColors = [
    "#8B5CF6", // Purple
    "#D946EF", // Pink
    "#F97316", // Orange
    "#10B981", // Green
    "#0EA5E9", // Blue
    "#EC4899", // Hot pink
    "#6366F1", // Indigo
    "#F59E0B"  // Amber
  ];
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div 
            key={tag.id}
            className="flex items-center px-2 py-1 text-xs rounded-full"
            style={{ 
              backgroundColor: `${tag.color}20`, 
              color: tag.color 
            }}
          >
            <span 
              className="cursor-pointer" 
              onClick={() => handleTagClick(tag.id)}
            >
              {tag.name}
            </span>
            <button
              className="ml-1 hover:bg-opacity-20 hover:bg-gray-500 rounded-full p-0.5"
              onClick={() => handleRemoveTag(tag.id)}
              aria-label={`Remove ${tag.name} tag`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        {!isAddingTag ? (
          <button
            onClick={() => setIsAddingTag(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <Plus size={12} />
            Add Tag
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <div className="relative">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
                className="w-24 py-1 px-2 text-xs rounded-lg bg-background neu-input"
                autoFocus
              />
              <div className="absolute -bottom-1 -right-1">
                <div className="relative">
                  <div 
                    className="w-4 h-4 rounded-full cursor-pointer border border-border"
                    style={{ backgroundColor: newTagColor }}
                    onClick={() => document.getElementById('colorPicker')?.click()}
                  />
                  <input
                    id="colorPicker"
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex">
              <button
                onClick={handleAddTag}
                className="p-1 rounded-full bg-background hover:bg-secondary"
                aria-label="Add tag"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsAddingTag(false)}
                className="p-1 rounded-full bg-background hover:bg-secondary"
                aria-label="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isAddingTag && (
        <div className="flex flex-wrap gap-1 mt-1">
          {predefinedColors.map(color => (
            <button
              key={color}
              className={cn(
                "w-4 h-4 rounded-full",
                newTagColor === color && "ring-2 ring-offset-1 ring-gray-400"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setNewTagColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagManager;
