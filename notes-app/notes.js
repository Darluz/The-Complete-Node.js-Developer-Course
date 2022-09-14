const fs = require("fs");
const chalk = require("chalk");

const getNotes = () => "Your notes...";

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNotes = notes.filter((note) => note.title === title);
  const duplicateNote = notes.find((note) => note.title === title) // replace duplicateNotes

  debugger

  if (!duplicateNote) {
    notes.push({
      title,
      body,
    });
    saveNotes(notes);
    console.log(chalk.green.inverse("New note added!"));
  } else {
    console.log(chalk.orange.inverse("Note title taken!"));
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const removeNote = (title) => {
  const notes = loadNotes();

  if (notes.find((note) => note.title === title)) {
    console.log(`The note with the title: ${title}, is going to be removed`);
    saveNotes(notes.filter((note) => note.title !== title));
    console.log(chalk.green.inverse("Note removed!"));
  } else {
    console.log(chalk.red.inverse("No note found!"));
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.red.underline("Your notes: "));
  notes.forEach((note) => {
    console.log(
      chalk.yellow(`Title: ${note.title},`), chalk.green(` body: ${note.body}`)
    );
  });
};

const readNote = (title) => {
  const notes = loadNotes();
  note = notes.find(note => note.title === title)
  if(note){
    console.log(
      chalk.yellow(`Title: ${note.title} `), ` body: ${note.body}`
    );
  }
  else{
    console.log(chalk.red.inverse('Note not found!'));
  }
}

module.exports = { getNotes, addNote, removeNote, listNotes, readNote };
