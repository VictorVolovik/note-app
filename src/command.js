import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  findNotes,
  getAllNotes,
  newNote,
  removeAllNotes,
  removeNote,
} from "./notes.js";
import { start } from "./server.js";

const listNotes = (notes) => {
  notes.forEach(({ id, content, tags }, index) => {
    if (index > 0) {
      console.log("\n");
    }
    console.log("id: ", id);
    console.log("tags: ", tags);
    console.log("content: ", content);
  });
};

yargs(hideBin(process.argv))
  .scriptName('note')
  .command(
    "new <note>",
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tags = argv.tags?.split(",").map((tag) => tag.trim()) ?? [];
      const note = argv.note.trim();
      const createdNote = await newNote(note, tags);
      console.log("New note created:");
      listNotes([createdNote]);
    },
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })
  .command(
    "all",
    "get all notes",
    () => { },
    async () => {
      const notes = await getAllNotes();
      if (notes.length) {
        listNotes(notes);
      } else {
        console.log("No notes yet");
      }
    },
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const matches = await findNotes(argv.filter);
      if(matches.length) {
        listNotes(matches);
      } else {
        console.log("No notes found")
      }
    },
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      const deletedNote = await removeNote(argv.id);
      if (deletedNote) {
        console.log("Note deleted:");
        listNotes([deletedNote]);
      } else {
        console.log("Note not found");
      }
    },
  )
  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 3000,
        type: "number",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port);
    },
  )
  .command(
    "clean",
    "remove all notes",
    () => { },
    async () => {
      removeAllNotes();
      console.log('All notes removed')
    },
  )
  .demandCommand(1)
  .parse();
