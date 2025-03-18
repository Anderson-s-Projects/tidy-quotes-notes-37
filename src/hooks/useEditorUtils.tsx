
import { useRef } from "react";

export const useEditorUtils = () => {
  const previewRef = useRef<HTMLIFrameElement | null>(null);

  const renderMarkdown = (text: string) => {
    let html = text.replace(/^# (.*$)/gm, '<h1>$1</h1>').replace(/^## (.*$)/gm, '<h2>$1</h2>').replace(/^### (.*$)/gm, '<h3>$1</h3>').replace(/^#### (.*$)/gm, '<h4>$1</h4>').replace(/^##### (.*$)/gm, '<h5>$1</h5>').replace(/^###### (.*$)/gm, '<h6>$1</h6>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');

    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');

    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 rounded">$1</code>');

    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>');

    let isInUl = false;
    const ulLines = html.split('\n').map(line => {
      if (line.match(/^- (.*$)/)) {
        const listItem = line.replace(/^- (.*)$/, '<li>$1</li>');
        if (!isInUl) {
          isInUl = true;
          return '<ul class="list-disc pl-5 my-2">' + listItem;
        }
        return listItem;
      } else if (isInUl) {
        isInUl = false;
        return '</ul>' + line;
      }
      return line;
    });
    if (isInUl) {
      ulLines.push('</ul>');
    }
    html = ulLines.join('\n');

    let isInOl = false;
    const olLines = html.split('\n').map(line => {
      if (line.match(/^\d+\. (.*$)/)) {
        const listItem = line.replace(/^\d+\. (.*)$/, '<li>$1</li>');
        if (!isInOl) {
          isInOl = true;
          return '<ol class="list-decimal pl-5 my-2">' + listItem;
        }
        return listItem;
      } else if (isInOl) {
        isInOl = false;
        return '</ol>' + line;
      }
      return line;
    });
    if (isInOl) {
      olLines.push('</ol>');
    }
    html = olLines.join('\n');

    html = html.replace(/\n/g, '<br />');
    return html;
  };

  const updateCodePreview = (content: string, codeLanguage: "html" | "css" | "javascript") => {
    if (!previewRef.current) return;

    const iframe = previewRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) return;
    
    let htmlContent = "";
    
    if (codeLanguage === "html") {
      htmlContent = content;
    } else if (codeLanguage === "css") {
      htmlContent = `
        <html>
          <head>
            <style>${content}</style>
          </head>
          <body>
            <div class="demo-element">CSS Preview</div>
            <div class="demo-paragraph">This is a paragraph to demonstrate your CSS.</div>
            <button class="demo-button">Button Element</button>
            <a href="#" class="demo-link">Link Element</a>
          </body>
        </html>
      `;
    } else if (codeLanguage === "javascript") {
      htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; }
              #output { border: 1px solid #ddd; padding: 15px; margin-top: 20px; min-height: 100px; }
            </style>
          </head>
          <body>
            <h4>JavaScript Preview</h4>
            <div>Open the console (F12) to see output</div>
            <div id="output">Output will appear here</div>
            <script>
              // Redirect console.log to the output div
              const originalLog = console.log;
              console.log = function(...args) {
                originalLog.apply(console, args);
                const output = document.getElementById('output');
                if (output) {
                  const text = args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  ).join(' ');
                  output.innerHTML += '<div>' + text + '</div>';
                }
              };
              
              // Run the user code
              try {
                ${content}
              } catch (error) {
                console.log('Error: ' + error.message);
              }
            </script>
          </body>
        </html>
      `;
    }
    
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
  };

  const setPreviewRef = (ref: HTMLIFrameElement | null) => {
    previewRef.current = ref;
  };

  return {
    renderMarkdown,
    updateCodePreview,
    previewRef,
    setPreviewRef
  };
};
