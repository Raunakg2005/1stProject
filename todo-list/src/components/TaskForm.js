import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const TaskForm = ({ addTask, darkMode }) => {
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(null); // Date only
  const [dueTime, setDueTime] = useState("12:00"); // Time only
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate task name
    if (!newTask.trim()) {
      setError("Task name is required!");
      toast.error("Task name is required!");
      return;
    }

    // Validate category
    if (!category) {
      setError("Category is required!");
      toast.error("Category is required!");
      return;
    }

    // Validate priority
    if (!priority) {
      setError("Priority is required!");
      toast.error("Priority is required!");
      return;
    }

    // Validate due date
    if (!dueDate) {
      setError("Due date is required!");
      toast.error("Due date is required!");
      return;
    }

    // Validate due time
    if (!dueTime) {
      setError("Due time is required!");
      toast.error("Due time is required!");
      return;
    }

    // Clear error if validation passes
    setError("");

    // Format the date as YYYY-MM-DD
    const formattedDate = dueDate.toISOString().split("T")[0];

    // Combine date and time into a single string
    const dueDateTime = `${formattedDate}T${dueTime}:00`; // Add seconds for ISO format

    // Add the task
    addTask(newTask, category, dueDateTime, priority);

    // Reset form fields
    setNewTask("");
    setCategory("");
    setDueDate(null);
    setDueTime("12:00");
    setPriority("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Task Input */}
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="What's next?"
        className={`p-3 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } focus:ring-2 focus:ring-blue-400`}
        required
      />

      {/* Category Dropdown */}
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full p-3 rounded-lg shadow-md appearance-none ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } focus:ring-2 focus:ring-blue-400`}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Professional">Professional</option>
          <option value="Work">Work</option>
          <option value="Shopping">Shopping</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Priority Dropdown */}
      <div className="relative">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={`w-full p-3 rounded-lg shadow-md appearance-none ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } focus:ring-2 focus:ring-blue-400`}
          required
        >
          <option value="" disabled>
            Select Priority
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Due Date Input */}
      <div className={`p-3 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <input
          type="date"
          value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setDueDate(new Date(e.target.value))}
          className={`w-full bg-transparent focus:outline-none ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
          required
        />
      </div>

      {/* Due Time Input */}
      <div className={`p-3 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className={`w-full bg-transparent focus:outline-none ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="col-span-full text-red-500 text-sm">{error}</p>
      )}

      {/* Add Task Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="col-span-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg shadow-md hover:from-purple-600 hover:to-blue-500 flex items-center justify-center"
      >
        <FaPlus className="mr-2" /> Add Task
      </motion.button>
    </form>
  );
};

export default TaskForm;