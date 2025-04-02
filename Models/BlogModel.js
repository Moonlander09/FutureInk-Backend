import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author:String,
  createdAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.model("Blog", BlogSchema);