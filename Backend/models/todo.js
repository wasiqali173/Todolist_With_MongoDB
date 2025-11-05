import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Todo", todoSchema);
