const express = require("express");
const router = express.Router();
const { createBlog, getAllBlogs, deleteBlog } = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllBlogs); 
router.post("/", protect, createBlog); 
router.delete("/:id", protect, deleteBlog);

module.exports = router;