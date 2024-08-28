import type { Note } from "types/models";
import open from "open";

const interpolate = (html: string, data: { [key: string]: string }) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, placeholder) => {
    return data[placeholder] || "";
  });
};

const formatNotes = (notes: Note[]) => {
  return notes
    .map((note) => {
      return `
      <div class="note">
        <p>${note.content}</p>
        <div class="tags">
          ${note.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    `;
    })
    .join("\n");
};

const createServer = (notes: Note[], port: string) => {
  return Bun.serve({
    port,
    async fetch() {
      const HTML_PATH = new URL("./template.html", import.meta.url).pathname;
      const templateBlob = Bun.file(HTML_PATH);
      const template = await templateBlob.text();
      const html = interpolate(template, { notes: formatNotes(notes) });

      return new Response(html, {
        status: 200,
        headers: {
          "Content-type": "text/html",
        },
      });
    },
  });
};

export const start = (notes: Note[], port: string) => {
  createServer(notes, port);
  open(`http://localhost:${port}`);
};
