import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import router from './Routes/blogRoute.js'
dotenv.config({path:'./.env'}); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;
connectDB();

// Middleware
// Enable CORS with credentials support
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    credentials: true,
}));
  
  
app.use(express.json()); // Allow JSON data in requests


app.use('/api/blog',router)
// Start the server
app.listen(PORT)


