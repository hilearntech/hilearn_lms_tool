const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog nahi mila" });
    }

    res.status(200).json({ success: true, message: "Blog Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};