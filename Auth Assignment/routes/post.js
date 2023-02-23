const router = require("express").Router();
const {
  authMiddleware,
  newUser,
  login,
  getAllPosts,
  createNewPost,
  UpdatePost,
  deletePost,
} = require("../controllers/post");
router.post("/register", newUser);
router.post("/login", login);
router.get("/posts", authMiddleware, getAllPosts);
router.post("/posts", authMiddleware, createNewPost);
router.put("/posts/:postId", authMiddleware, UpdatePost);
router.delete("/posts/:postId", authMiddleware, deletePost);

module.exports = router;
