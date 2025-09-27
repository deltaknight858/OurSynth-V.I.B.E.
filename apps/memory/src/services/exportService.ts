import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Note, Attachment } from "./noteService"; // Correctly import Attachment
import { marked } from "marked";
import TurndownService from "turndown";

export interface ExportOptions {
  format: "pdf" | "html" | "markdown";
  includeAttachments?: boolean;
  includeMetadata?: boolean;
}

export const exportService = {
  async exportToPDF(note: Note, element: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(element);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    return new Blob([pdf.output("blob")], { type: "application/pdf" });
  },

  exportToHTML(note: Note): string {
    const noteTags = note.tags || [];
    const noteAttachments = note.attachments || [];
    const lastModifiedDate = note.lastModified ? new Date(note.lastModified).toLocaleString() : "N/A";

    const metadata = `
      <div class="note-metadata">
        <h1>${note.title}</h1>
        ${noteTags.length > 0 ? `<div class="tags">${noteTags.join(", ")}</div>` : ""}
        <div class="date">Last modified: ${lastModifiedDate}</div>
      </div>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${note.title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
            .note-metadata { margin-bottom: 2rem; }
            .tags { color: #666; margin: 0.5rem 0; }
            .date { color: #888; font-size: 0.9rem; }
            .attachments { margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem; }
          </style>
        </head>
        <body>
          ${metadata}
          <div class="note-content">
            ${note.content}
          </div>
          ${noteAttachments.length > 0 ? `
            <div class="attachments">
              <h2>Attachments</h2>
              <ul>
                ${noteAttachments.map((att: Attachment) => `<li><a href="${att.fileName}">${att.fileName}</a></li>`).join("")}
              </ul>
            </div>
          ` : ""}
        </body>
      </html>
    `;

    return content;
  },

  exportToMarkdown(note: Note): string {
    const noteTags = note.tags || [];
    const noteAttachments = note.attachments || [];
    const lastModifiedDate = note.lastModified ? new Date(note.lastModified).toLocaleString() : "N/A";
    
    let markdown = `# ${note.title}

`;
    
    if (noteTags.length > 0) {
      markdown += `Tags: ${noteTags.join(", ")}

`;
    }
    
    markdown += `Last modified: ${lastModifiedDate}

`;
    markdown += `${marked.parse(note.content)}

`;

    if (noteAttachments.length > 0) {
      markdown += `## Attachments

`;
      noteAttachments.forEach((att: Attachment) => {
        markdown += `- [${att.fileName}](${att.fileName})
`;
      });
    }

    return markdown;
  },

  downloadFile(content: string | Blob, filename: string) {
    const url = content instanceof Blob 
      ? URL.createObjectURL(content)
      : `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
      
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (content instanceof Blob) {
      URL.revokeObjectURL(url);
    }
  }
};
