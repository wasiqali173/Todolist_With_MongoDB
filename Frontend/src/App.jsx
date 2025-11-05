import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Dynamically pick backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [input, setInputValue] = useState("");
  const [userTodo, setUserTodo] = useState([]);

  // === FETCH TODOS ===
  useEffect(() => {
    fetch(`${BASE_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setUserTodo(data))
      .catch(() => toast.error("⚠️ Error fetching todos"));
  }, []);

  // === ADD TODO ===
  async function addTodo() {
    if (input.trim() === "") {
      toast.warn("✏️ Please enter a todo!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const newTodo = await res.json();
      setUserTodo((prev) => [...prev, newTodo]);
      setInputValue("");
      toast.success("✅ Todo added successfully!");
    } catch {
      toast.error("❌ Error adding todo!");
    }
  }

  // === EDIT TODO ===
  async function edit(id) {
    const newText = prompt("Edit your todo:");
    if (!newText || newText.trim() === "") return;

    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      const updatedTodo = await res.json();
      setUserTodo((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      toast.info("📝 Todo updated!");
    } catch {
      toast.error("❌ Error updating todo!");
    }
  }

  // === DELETE SINGLE TODO ===
  async function remove(id) {
    try {
      await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
      setUserTodo((prev) => prev.filter((todo) => todo._id !== id));
      toast.error("🗑️ Todo deleted!");
    } catch {
      toast.error("❌ Error deleting todo!");
    }
  }

  // === DELETE ALL TODOS ===
  async function removeAll() {
    if (window.confirm("Are you sure you want to delete all todos?")) {
      try {
        const res = await fetch(`${BASE_URL}/todos`, { method: "DELETE" });
        if (res.ok) {
          setUserTodo([]);
          toast.error("🗑️ All todos deleted!");
        } else {
          toast.error("❌ Failed to delete all todos!");
        }
      } catch {
        toast.error("⚠️ Error deleting all todos!");
      }
    } else {
      toast.info("🚫 Delete cancelled");
    }
  }

  // === UI ===
  return (
    <>
      <div className="container">
        <div className="main">
          <h1 className="heading">Todo List</h1>

          <input
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            value={input}
            placeholder="Enter your todo"
          />
          <button onClick={addTodo}>Add Todo</button>
          <button onClick={removeAll}>Delete All</button>
        </div>

        <div>
          <ul className="list">
            {userTodo.map((value) => (
              <li key={value._id}>
                <span>{value.text}</span>
                <div className="btns">
                  <button
                    className="editButton"
                    onClick={() => edit(value._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="deleteButton"
                    onClick={() => remove(value._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </>
  );
}

export default App;
