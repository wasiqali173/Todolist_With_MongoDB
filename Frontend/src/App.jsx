import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [input, setInputValue] = useState("");
  const [userTodo, setUserTodo] = useState([]);

 
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setUserTodo(data))
      .catch((err) => toast.error("Error fetching todos" ,err));
  }, []);


  async function addTodo() {
    if (input.trim() === "") {
      toast.warn("Please enter a todo!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const newTodo = await res.json();
      setUserTodo((prev) => [...prev, newTodo]);
      setInputValue("");
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error("Error adding todo!",error);
    }
  }

  
  async function edit(id) {
    const newText = prompt("Edit your todo:");
    if (!newText || newText.trim() === "") return;

    try {
      const res = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      const updatedTodo = await res.json();

      setUserTodo((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );

      toast.info("Todo updated!");
    } catch (error) {
      toast.error("Error updating todo!", error);
    }
  }


  async function remove(id) {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" });
      setUserTodo((prev) => prev.filter((todo) => todo._id !== id));
      toast.error("Todo deleted!");
    } catch (error) {
      toast.error("Error deleting todo!", error);
    }
  }


async function removeAll() {
  if (window.confirm("Are you sure you want to delete all todos?")) {
    try {
      const res = await fetch("http://localhost:5000/todos", {
        method: "DELETE",
      });

      if (res.ok) {
        setUserTodo([]);
        toast.error("All todos deleted!");
      } else {
        toast.error("Failed to delete todos!");
      }
    } catch (error) {
      toast.error("Error deleting all todos!",error);
    }
  } else {
    toast.info("Delete cancelled");
  }
}

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

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </>
  );
}

export default App;
