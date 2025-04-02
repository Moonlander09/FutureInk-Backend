import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { User } from "../Models/UserModel.js";
import { Blog } from "../Models/BlogModel.js";


dotenv.config({ path: "./.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_SECRET_KEY);
export async function generateBlog(req, res) {
  try {
    const { topic, length, tone } = req.body;

    if (!topic) {
      return res
        .status(400)
        .json({ success: false, message: "Topic is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Write a ${length} blog post on "${topic}" in a ${tone} tone.`;

    const result = await model.generateContent(prompt);
    const blog = result.response.text(); // Extract blog text

    res.status(201).json({ success: true, blog, title: topic });
  } catch (error) {
    
    res
      .status(500)
      .json({ success: false, message: "Blog generation failed." });
  }
}

export async function saveBlog(req, res) {
  try {
    const { title, content } = req.body;

    const isEffectivelyEmpty = !content || 
    content.replace(/<p>(\s|&nbsp;|<br\s*\/?>|\n)*<\/p>/g, '').trim() === '';

    if (!title || isEffectivelyEmpty) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }
    // Create a new blog
    const newBlog = new Blog({ title, content, author: req.user.name });
    await newBlog.save();

    // Find the user and push the blog reference
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { blogs: newBlog._id },
      },
      { new: true }
    );

    res
      .status(201)
      .json({ success: true, message: "Blog saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving blog" });
  }
}

export async function getBlogs(req, res) {
  try {
    const blogs = await Blog.find();

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting blogs" });
  }
}

export async function getUserBlogs(req, res) {
  try {
    const blogs = await User.findOne(req.user._id).populate("blogs");
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error getting User blogs" });
  }
}

export async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    await Blog.findOneAndDelete({ _id: id });

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { blogs: id }, // Removes blog ID from blogs array
      });
    
    res
      .status(200)
      .json({ success: true, message: "blog is successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating blog" });
  }
}

export async function getBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id });
    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting blog" });
  }
}

export async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;


    const isEffectivelyEmpty = !content || 
    content.replace(/<p>(\s|&nbsp;|<br\s*\/?>|\n)*<\/p>/g, '').trim() === '';


    if (isEffectivelyEmpty) {
      return res.status(400).json({ success: false, message: "Content cannot be empty" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { content},
      { new: true } // Returns the updated document
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating the blog blog" });
  }
}
