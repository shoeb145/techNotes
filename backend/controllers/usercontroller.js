const Note = require("../models/Note");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const AsyncHandler = require("express-async-handler");

// desc show all users
// route get /users
// access private

const getAllUsers = AsyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "no user found" });
  }
  res.json(users);
});

// desc create new users
// route post / users
// access private

const createUsers = AsyncHandler(async (req, res) => {
  const { password, username, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "all fields are required" });
  }
  //check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "username already exist" });
  }

  // hash pasword
  const hashPwd = await bcrypt.hash(password, 10); // salt rounds
  const userObject = { username, password: hashPwd, roles };
  const user = await User.create(userObject);
  if (user) {
    res.status(200).json({ message: `new user ${username} created` });
  } else {
    res.status(400).json({ message: "invalid user" });
  }
});

// desc Update users
// route patch / users
// access private

const updateUsers = AsyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    !typeof active == "boolean"
  ) {
    res.status("400").json({ message: "All field are required" });
  }
  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json("user not found");
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(400).json({ messege: "Duplicate username" });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    const hashPwd = bcrypt.hash(password, 10); //10 salt round
  }
  const updateUsers = await user.save();
  res.json({ message: `updated ${username} updated` });
});

// desc delete users
// route delete / users
// access private

const deleteUsers = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "user Id required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note?.length) {
    return res.status(400).json({ message: "user has assigned notes" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json("user not found");
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with id ${result.id} is deleted`;
  res.json({ message: reply });
});

module.exports = {
  getAllUsers,
  createUsers,
  updateUsers,
  deleteUsers,
};
