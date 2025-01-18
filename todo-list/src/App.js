import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (newTask, category, dueDate, dueTime, priority) => {
    if (newTask.trim() === "") return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      category,
      dueDate,
      dueTime, // Include time
      priority,
    };
    setTasks([...tasks, task]);
    toast.success("Task added successfully!");
  };

  // Mark a task as completed
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.info("Task status updated!");
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.error("Task deleted!");
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Pending"
        ? !task.completed
        : task.completed;

    const matchesSubFilter =
      subFilter === "All"
        ? true
        : task.priority === subFilter || task.category === subFilter;

    return matchesFilter && matchesSubFilter;
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-900"
      } transition-colors duration-300 font-sans flex`}
    >
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        filter={filter}
        setFilter={setFilter}
        subFilter={subFilter}
        setSubFilter={setSubFilter}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          window.innerWidth >= 768 ? "ml-64" : isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-2xl md:hidden"
            >
              ☰
            </button>
            <h1 className="text-4xl font-extrabold tracking-wide">
              📝 To-Do List
            </h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full shadow-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-200"
            } transition-colors`}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Add Task Form */}
        <TaskForm addTask={addTask} darkMode={darkMode} />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          darkMode={darkMode}
        />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default App;
