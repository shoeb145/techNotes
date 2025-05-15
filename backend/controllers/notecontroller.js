const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
  const note = await Note.find().lean();
  if (!note.length) {
    return res.status(400).json({ message: "notes not found" });
  }
  noteWithUser = await Promise.all(
    note.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );
  res.json(note);
});

const createNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  if (!user || !title || !text) {
    res.status(400).json({ message: "all fields are required" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(400).json({ message: "note allready exist" });
  }

  const note = await Note.create({ user, title, text });

  if (note) {
    res.status(200).json({ message: "new note created" });
  } else {
    res.status(400).json({ message: "invalid note data received" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if ((!id, !user, !title, !text, typeof completed !== "boolean")) {
    res.status(400).json({ message: "all fields are required" });
  }
  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({ message: "note not found" });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate && duplicate?._id !== id) {
    res.status(400).json("duplicate title");
  }

  (note.user = user)((note.title = title))((note.text = text))(
    (note.completed = completed)
  );
  const updateUser = await user.save();
  res.json({ message: `${updateUser.title} updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "id is required" });
  }

  const note = Note.findById(id).exec();
  if (note) {
    res.status(400).json({ message: "note doesnt exist" });
  }
  const result = note.deleteOne();
  const reply = `note ${result.title} with id ${result.id} is deleted `;
  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
