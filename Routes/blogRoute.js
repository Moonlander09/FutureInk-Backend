import express from "express";
import {
  deleteBlog,
  generateBlog,
  getBlog,
  getBlogs,
  getUserBlogs,
  saveBlog,
  updateBlog,
} from "../Controllers/blogController.js";
import { authenticateUser } from "../Controllers/authController.js";

const router = express.Router();

router.route("/generate").post(authenticateUser, generateBlog);
router.route("/save").post(authenticateUser, saveBlog);
router.route("/getblogs").get(authenticateUser, getUserBlogs);
router.route("/get").get(getBlogs);
router.route("/:id").delete(authenticateUser, deleteBlog);
router.route("/:id").get(getBlog);
router.route('/:id').patch(authenticateUser,updateBlog)

export default router;
