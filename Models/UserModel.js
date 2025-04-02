import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], 
});

export const User = mongoose.model("User", UserSchema);