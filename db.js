import mongoose from "mongoose";

export async function connectDB() {
  const DB = process.env.DATABASE;

  try {
    await mongoose.connect(DB);
  } catch (err) {
    console.log("getting error", err);
    process.exit(1);
  }
}
