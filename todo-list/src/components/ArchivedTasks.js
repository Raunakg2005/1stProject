import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMoon, FiSun, FiFolder, FiAlertCircle, FiCalendar, FiTrash } from "react-icons/fi";

const ArchivedTasks = ({ archivedTasks, setArchivedTasks, darkMode, onDeleteTask }) => {
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);
  const [isLoading, setIsLoading] = useState(true);
  

  // Dynamic Lighting Effect
  useEffect(() => {
    const cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
      });
    });

    // Cleanup event listeners
    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", () => {});
      });
    };
  }, []);

  const toggleDarkMode = () => {
    setLocalDarkMode((prevMode) => !prevMode);
  };

  // Update isLoading state when archivedTasks is loaded
  useEffect(() => {
    // Set isLoading to false once archivedTasks is initialized
    setIsLoading(false);
  }, [archivedTasks]);

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await onDeleteTask(taskId);
        setArchivedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        localDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/"
          className={`flex items-center text-sm font-medium ${
            localDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
          } transition-colors duration-200`}
        >
          <FiArrowLeft className="mr-2" /> Back to Main Page
        </Link>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            localDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors duration-200`}
        >
          {localDarkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8 text-center">Archived Tasks</h1>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-500">Loading archived tasks...</p>
        </div>
      ) : archivedTasks.length === 0 ? (
        // Empty Archive Message
        <div className="flex flex-col items-center justify-center space-y-4">
          <FiFolder className="text-6xl text-gray-400" />
          <p className="text-xl text-gray-500">No archived tasks found.</p>
        </div>
      ) : (
        // Task List
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {archivedTasks.map((task) => (
            <div
              key={task.id}
              className={`card-container p-0 rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                localDarkMode
                  ? "bg-gray-800/70 backdrop-blur-md border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/30"
                  : "bg-white/70 backdrop-blur-md border border-gray-200 hover:border-blue-500 hover:shadow-blue-500/30"
              } relative overflow-hidden animate-float`}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Gradient Border */}
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-r ${
                  localDarkMode
                    ? "from-blue-500/10 to-purple-500/10"
                    : "from-blue-200/10 to-purple-200/10"
                } opacity-0 hover:opacity-100 transition-opacity duration-300`}
              ></div>

              {/* Dynamic Lighting Effect */}
              <div
                className="light-effect absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `radial-gradient(circle at var(--x) var(--y), ${
                    localDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                  }, transparent 50%)`,
                }}
              ></div>

              {/* Card Header */}
              <div
                className={`p-4 ${
                  localDarkMode ? "bg-gray-700/50" : "bg-blue-50"
                }`}
              >
                <h2 className="text-lg font-semibold truncate">{task.text}</h2>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Category with Icon */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiFolder className="mr-2" />
                  <span className="font-medium">Category:</span> {task.category}
                </div>

                {/* Priority Badge */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiAlertCircle className="mr-2" />
                  <span className="font-medium">Priority:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                      task.priority
                    )} text-white`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Due Date with Icon */}
                <div className="flex items-center text-sm text-gray-500">
                  <FiCalendar className="mr-2" />
                  <span className="font-medium">Due:</span> {new Date(task.dueDateTime).toLocaleString()}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(task.id)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  localDarkMode
                    ? "text-red-400 hover:bg-red-400/10"
                    : "text-red-500 hover:bg-red-500/10"
                } transition-colors duration-200`}
              >
                <FiTrash className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedTasks;