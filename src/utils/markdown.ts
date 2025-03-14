
export const formatMarkdown = (content: string, type: string): string => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return content;

  const range = selection.getRangeAt(0);
  const startIndex = range.startOffset;
  const endIndex = range.endOffset;
  const selectedText = content.substring(startIndex, endIndex);

  if (selectedText.length === 0) return content;

  let formattedText = "";
  let newContent = "";

  switch (type) {
    case "bold":
      formattedText = `**${selectedText}**`;
      break;
    case "italic":
      formattedText = `*${selectedText}*`;
      break;
    case "heading1":
      formattedText = `# ${selectedText}`;
      break;
    case "heading2":
      formattedText = `## ${selectedText}`;
      break;
    case "heading3":
      formattedText = `### ${selectedText}`;
      break;
    case "link":
      formattedText = `[${selectedText}](url)`;
      break;
    case "code":
      formattedText = `\`${selectedText}\``;
      break;
    case "codeblock":
      formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
      break;
    case "quote":
      formattedText = `> ${selectedText}`;
      break;
    case "unorderedList":
      formattedText = selectedText
        .split("\n")
        .map(line => `- ${line}`)
        .join("\n");
      break;
    case "orderedList":
      formattedText = selectedText
        .split("\n")
        .map((line, index) => `${index + 1}. ${line}`)
        .join("\n");
      break;
    default:
      formattedText = selectedText;
  }

  newContent = content.substring(0, startIndex) + formattedText + content.substring(endIndex);
  return newContent;
};

export const insertTab = (content: string, selectionStart: number, selectionEnd: number): string => {
  return content.substring(0, selectionStart) + "  " + content.substring(selectionEnd);
};
