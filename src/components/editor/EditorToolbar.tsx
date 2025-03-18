
import React from "react";
import { 
  Bold, Italic, Heading1, Heading2, Heading3, Link, List, 
  ListOrdered, Code, Quote, Eye, Maximize, Minimize, Globe
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface EditorToolbarProps {
  isCodeMode: boolean;
  codeLanguage: "html" | "css" | "javascript";
  setCodeLanguage: (language: "html" | "css" | "javascript") => void;
  setIsCodeMode: (isCodeMode: boolean) => void;
  handleFormat: (type: string) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreviewMode: boolean) => void;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isCodeMode,
  codeLanguage,
  setCodeLanguage,
  setIsCodeMode,
  handleFormat,
  isPreviewMode,
  setIsPreviewMode,
  isFullScreen,
  toggleFullScreen
}) => {
  return (
    <div className="flex-1 flex items-center justify-between ml-2 md:ml-0">
      <div className="flex items-center flex-wrap gap-1">
        {isCodeMode ? (
          <>
            <button 
              onClick={() => setCodeLanguage("html")} 
              className={`px-2 py-1 text-xs rounded-lg ${codeLanguage === "html" ? 'neu-pressed' : 'neu-button'}`}
            >
              HTML
            </button>
            <button 
              onClick={() => setCodeLanguage("css")} 
              className={`px-2 py-1 text-xs rounded-lg ${codeLanguage === "css" ? 'neu-pressed' : 'neu-button'}`}
            >
              CSS
            </button>
            <button 
              onClick={() => setCodeLanguage("javascript")} 
              className={`px-2 py-1 text-xs rounded-lg ${codeLanguage === "javascript" ? 'neu-pressed' : 'neu-button'}`}
            >
              JS
            </button>
            <button onClick={() => setIsCodeMode(false)} className="px-2 py-1 text-xs rounded-lg neu-button">
              Text Mode
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleFormat("bold")} className="toolbar-button neu-button" title="Bold">
              <Bold size={15} />
            </button>
            <button onClick={() => handleFormat("italic")} className="toolbar-button neu-button" title="Italic">
              <Italic size={15} />
            </button>
            <button onClick={() => handleFormat("heading1")} className="toolbar-button neu-button" title="Heading 1">
              <Heading1 size={15} />
            </button>
            <button onClick={() => handleFormat("heading2")} className="toolbar-button neu-button" title="Heading 2">
              <Heading2 size={15} />
            </button>
            <button onClick={() => handleFormat("heading3")} className="toolbar-button neu-button" title="Heading 3">
              <Heading3 size={15} />
            </button>
            <button onClick={() => handleFormat("link")} className="toolbar-button neu-button" title="Link">
              <Link size={15} />
            </button>
            <button onClick={() => handleFormat("unorderedList")} className="toolbar-button neu-button" title="Bullet List">
              <List size={15} />
            </button>
            <button onClick={() => handleFormat("orderedList")} className="toolbar-button neu-button" title="Numbered List">
              <ListOrdered size={15} />
            </button>
            <button onClick={() => handleFormat("code")} className="toolbar-button neu-button" title="Code">
              <Code size={15} />
            </button>
            <button onClick={() => handleFormat("quote")} className="toolbar-button neu-button" title="Quote">
              <Quote size={15} />
            </button>
            <button onClick={() => setIsCodeMode(true)} className="px-2 py-1 text-xs rounded-lg neu-button">
              Code Mode
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsPreviewMode(!isPreviewMode)} 
          className={`toolbar-button ${isPreviewMode ? 'neu-pressed' : 'neu-button'}`} 
          title={isCodeMode ? "Toggle Live Preview" : "Toggle Preview Mode"}
        >
          {isCodeMode ? <Globe size={15} /> : <Eye size={15} />}
        </button>
        {toggleFullScreen && (
          <button onClick={toggleFullScreen} className="toolbar-button neu-button" title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Mode'}>
            {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;
