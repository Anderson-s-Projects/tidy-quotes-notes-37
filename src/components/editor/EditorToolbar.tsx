
import React from "react";
import { 
  Bold, Italic, Heading1, Heading2, Heading3, Link, List, 
  ListOrdered, Code, Quote, Eye, Maximize, Minimize, Globe, 
  AlignLeft, AlignCenter, AlignRight, ChevronDown
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  const formatButtons = [
    { icon: <Bold size={15} />, action: "bold", title: "Bold" },
    { icon: <Italic size={15} />, action: "italic", title: "Italic" },
    { icon: <Heading1 size={15} />, action: "heading1", title: "Heading 1" },
    { icon: <Heading2 size={15} />, action: "heading2", title: "Heading 2" },
    { icon: <Heading3 size={15} />, action: "heading3", title: "Heading 3" },
    { icon: <Link size={15} />, action: "link", title: "Link" },
    { icon: <List size={15} />, action: "unorderedList", title: "Bullet List" },
    { icon: <ListOrdered size={15} />, action: "orderedList", title: "Numbered List" },
    { icon: <Code size={15} />, action: "code", title: "Code" },
    { icon: <Quote size={15} />, action: "quote", title: "Quote" },
  ];
  
  // Desktop UI
  const desktopUI = (
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
            {formatButtons.map((btn) => (
              <button 
                key={btn.action}
                onClick={() => handleFormat(btn.action)} 
                className="toolbar-button neu-button" 
                title={btn.title}
              >
                {btn.icon}
              </button>
            ))}
            <button onClick={() => setIsCodeMode(true)} className="px-2 py-1 text-xs rounded-lg neu-button">
              Code Mode
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
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
  
  // Mobile UI with more compact layout and dropdowns
  const mobileUI = (
    <div className="flex-1 flex items-center justify-between p-1">
      <div className="mobile-toolbar-group">
        {isCodeMode ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  {codeLanguage.toUpperCase()} <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setCodeLanguage("html")}>HTML</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCodeLanguage("css")}>CSS</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCodeLanguage("javascript")}>JavaScript</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={() => setIsCodeMode(false)} className="h-7 px-2 text-xs rounded-lg neu-button">
              Text
            </button>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2">
                  Format <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {formatButtons.map((btn) => (
                  <DropdownMenuItem key={btn.action} onClick={() => handleFormat(btn.action)}>
                    <span className="mr-2">{btn.icon}</span> {btn.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={() => setIsCodeMode(true)} className="h-7 px-2 text-xs rounded-lg neu-button">
              Code
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
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

  return (
    <>
      {/* Show appropriate UI based on screen size */}
      <div className="hidden md:block">{desktopUI}</div>
      <div className="md:hidden">{mobileUI}</div>
    </>
  );
};

export default EditorToolbar;
