import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("dueDate");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // For mobile filter modal

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add a new task
  const addTask = (newTask, category, dueDateTime, priority) => {
    if (newTask.trim() === "") return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      category,
      dueDateTime,
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

  // Edit a task
  const editTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
    toast.success("Task updated successfully!");
  };

  // Archive a task
  const archiveTask = (id) => {
    const taskToArchive = tasks.find((task) => task.id === id);
    setArchivedTasks([...archivedTasks, taskToArchive]);
    setTasks(tasks.filter((task) => task.id !== id));
    toast.info("Task archived!");
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

    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSubFilter && matchesSearch;
  });

  // Sort tasks
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDateTime) - new Date(b.dueDateTime);
    } else if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
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
          isSidebarOpen || window.innerWidth >= 768 ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-2xl md:hidden"
            >
              ☰
            </button>
            <h1 className="text-4xl font-extrabold tracking-wide">📝 To-Do List</h1>
          </div>

          {/* Mobile View: Filter Icon and Dark Mode Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`p-3 rounded-full shadow-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-200"
              } transition-colors`}
            >
              🔍
            </button>
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

          {/* Desktop View: Search, Sort, and Dark Mode Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className={`p-2 rounded-lg shadow-md ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`p-2 rounded-lg shadow-md ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="category">Sort by Category</option>
            </select>
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
        </div>

        {/* Mobile Filter Modal */}
        {isFilterModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <div
              className={`p-6 rounded-lg shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Sort By</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`p-2 rounded-lg shadow-md w-full mb-4 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="category">Category</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className={`p-2 rounded-lg shadow-md w-full ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                }`}
              />
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <TaskForm addTask={addTask} darkMode={darkMode} />

        {/* Task List */}
        <TaskList
          tasks={sortedTasks}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          editTask={editTask}
          archiveTask={archiveTask}
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