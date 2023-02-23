const { User, Post } = require("../models/post");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  return jwt.sign(payload, "secret", { expiresIn: 3600 });
};

// Middleware for authentication and authorization
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};
const newUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.status(200).json(posts);
};
const createNewPost = async (req, res) => {
  const { title, body, image, user } = req.body;
  try {
    // add doc to db
    const post = await Post.create({ title, body, image, user });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such post" });
  }
  const post = await Post.findOneAndDelete({ _id: id });
  if (!post) {
    return res.status(404).json({ error: "no such post" });
  }
  res.status(200).json(post);
};
// update a workout
const UpdatePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such post" });
  }
  const post = await Post.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!post) {
    return res.status(404).json({ error: "no such post" });
  }
  res.status(200).json(post);
};
module.exports = {
  newUser,
  login,
  getAllPosts,
  createNewPost,
  UpdatePost,
  deletePost,
  authMiddleware,
};
