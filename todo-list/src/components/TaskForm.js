import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const TaskForm = ({ addTask, darkMode }) => {
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState(""); // New State for Time
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure dueDate is not empty
    if (!dueDate) {
      alert("Please select a due date.");
      return;
    }

    addTask(newTask, category, dueDate, dueTime, priority);
    setNewTask("");
    setCategory("Personal");
    setDueDate("");
    setDueTime(""); // Reset time
    setPriority("Medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
    >
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
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={`p-3 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="Shopping">Shopping</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={`p-3 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={`p-3 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        required // Enforce date as required
      />
      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        className={`p-3 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      />
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
