import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Todo from "./models/todo.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (using env vars)
const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vdb0i4w.mongodb.net/${process.env.DB_NAME}?appName=Cluster0`;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🚀 Todo Backend running successfully!");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    console.log("✅ New Todo Added:", newTodo);
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Error adding todo", error });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
});

app.delete("/todos", async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.json({ message: "All todos deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all todos", error });
  }
});

// ✅ Export for Vercel (⚠️ no app.listen)
export default app;
