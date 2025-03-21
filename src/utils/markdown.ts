
export const formatMarkdown = (content: string, type: string): string => {
  // Get the current selection from the textarea
  const textarea = document.activeElement as HTMLTextAreaElement;
  if (!textarea || textarea.tagName !== 'TEXTAREA') return content;
  
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const selectedText = content.substring(selectionStart, selectionEnd);
  
  let formattedText = "";
  let newContent = "";
  let cursorPosition = selectionEnd;

  // If there's no selection and we need to add wrapper syntax, insert a placeholder
  const hasSelection = selectedText.length > 0;
  const textToFormat = hasSelection ? selectedText : "text";

  switch (type) {
    case "bold":
      formattedText = `**${textToFormat}**`;
      if (!hasSelection) cursorPosition = selectionStart + 2;
      break;
    case "italic":
      formattedText = `*${textToFormat}*`;
      if (!hasSelection) cursorPosition = selectionStart + 1;
      break;
    case "heading1":
      formattedText = `# ${textToFormat}`;
      if (!hasSelection) cursorPosition = selectionStart + 2;
      break;
    case "heading2":
      formattedText = `## ${textToFormat}`;
      if (!hasSelection) cursorPosition = selectionStart + 3;
      break;
    case "heading3":
      formattedText = `### ${textToFormat}`;
      if (!hasSelection) cursorPosition = selectionStart + 4;
      break;
    case "link": {
      if (hasSelection) {
        formattedText = `[${textToFormat}](url)`;
        cursorPosition = selectionEnd + 3; // Position cursor at the start of "url"
      } else {
        formattedText = `[text](url)`;
        cursorPosition = selectionStart + 1; // Position cursor at the start of "text"
      }
      break;
    }
    case "code":
      formattedText = `\`${textToFormat}\``;
      if (!hasSelection) cursorPosition = selectionStart + 1;
      break;
    case "codeblock":
      formattedText = `\`\`\`\n${textToFormat}\n\`\`\``;
      if (!hasSelection) cursorPosition = selectionStart + 4;
      break;
    case "quote": {
      // Handle multiline quotes
      if (textToFormat.includes('\n')) {
        formattedText = textToFormat
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n');
      } else {
        formattedText = `> ${textToFormat}`;
      }
      if (!hasSelection) cursorPosition = selectionStart + 2;
      break;
    }
    case "unorderedList": {
      if (textToFormat.includes('\n')) {
        formattedText = textToFormat
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
      } else {
        formattedText = `- ${textToFormat}`;
      }
      if (!hasSelection) cursorPosition = selectionStart + 2;
      break;
    }
    case "orderedList": {
      if (textToFormat.includes('\n')) {
        formattedText = textToFormat
          .split('\n')
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
      } else {
        formattedText = `1. ${textToFormat}`;
      }
      if (!hasSelection) cursorPosition = selectionStart + 3;
      break;
    }
    default:
      formattedText = textToFormat;
  }

  newContent = content.substring(0, selectionStart) + formattedText + content.substring(selectionEnd);
  
  // Set cursor position for user convenience
  if (!hasSelection) {
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  }
  
  return newContent;
};

export const insertTab = (content: string, selectionStart: number, selectionEnd: number): string => {
  return content.substring(0, selectionStart) + "  " + content.substring(selectionEnd);
};

export const downloadNote = (title: string, content: string, format: "txt" | "md" | "html" = "txt") => {
  // Determine file extension and prepare content
  let fileExtension: string;
  let fileContent: string;
  
  switch (format) {
    case "md":
      fileExtension = "md";
      fileContent = content;
      break;
    case "html":
      fileExtension = "html";
      fileContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 4px; }
    blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 1rem; color: #666; }
  </style>
</head>
<body>
  ${renderMarkdownToHTML(content)}
</body>
</html>`;
      break;
    default: // txt
      fileExtension = "txt";
      fileContent = content;
  }
  
  // Create a blob and download link
  const blob = new Blob([fileContent], { type: `text/${fileExtension}` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.${fileExtension}`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Helper function to convert markdown to HTML for download
export const renderMarkdownToHTML = (text: string): string => {
  let html = text.replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

  // Convert unordered lists
  let isInUl = false;
  const ulLines = html.split('\n').map(line => {
    if (line.match(/^- (.*$)/)) {
      const listItem = line.replace(/^- (.*)$/, '<li>$1</li>');
      if (!isInUl) {
        isInUl = true;
        return '<ul>' + listItem;
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

  // Convert ordered lists
  let isInOl = false;
  const olLines = html.split('\n').map(line => {
    if (line.match(/^\d+\. (.*$)/)) {
      const listItem = line.replace(/^\d+\. (.*)$/, '<li>$1</li>');
      if (!isInOl) {
        isInOl = true;
        return '<ol>' + listItem;
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
