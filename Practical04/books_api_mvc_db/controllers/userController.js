const User = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const user = await User.createUser(req.body);
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ message: "Error creating user" }); }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Error retrieving users" }); }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(parseInt(req.params.id));
    user ? res.json(user) : res.status(404).send("User not found");
  } catch (err) { res.status(500).json({ message: "Error retrieving user" }); }
};

const updateUser = async (req, res) => {
  try {
    await User.updateUser(parseInt(req.params.id), req.body);
    res.send("User updated");
  } catch (err) { res.status(500).json({ message: "Error updating user" }); }
};

const deleteUser = async (req, res) => {
  try {
    await User.deleteUser(parseInt(req.params.id));
    res.send("User deleted");
  } catch (err) { res.status(500).json({ message: "Error deleting user" }); }
};

const searchUsers = async (req, res) => {
  try {
    const users = await User.searchUsers(req.query.searchTerm);
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Error searching users" }); }
};

const getUsersWithBooks = async (req, res) => {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Error fetching users with books" }); }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, searchUsers, getUsersWithBooks };
