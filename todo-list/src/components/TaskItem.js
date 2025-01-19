import React, { useState } from "react";
import { FaTrash, FaCheck, FaEdit, FaArchive } from "react-icons/fa";
import { motion } from "framer-motion";

const TaskItem = ({ task, toggleComplete, deleteTask, editTask, archiveTask, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (editedText.trim() === "") return;
    editTask(task.id, editedText);
    setIsEditing(false);
  };

  // Format the due date and time
  const formatDateTime = (dueDateTime) => {
    if (!dueDateTime) return "No due date";
    const date = new Date(dueDateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 mb-4 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      } transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleComplete(task.id)}
            className={`p-3 rounded-full shadow ${
              task.completed ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <FaCheck
              className={`text-xl ${
                task.completed ? "text-white" : "text-gray-500"
              }`}
            />
          </motion.button>
          <div className="ml-4">
            {isEditing ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className={`text-lg ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                }`}
              />
            ) : (
              <p
                className={`text-lg ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "font-medium"
                }`}
              >
                {task.text}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {task.category} • Due: {formatDateTime(task.dueDateTime)} • Priority:{" "}
              {task.priority}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => archiveTask(task.id)}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <FaArchive />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </motion.button>
        </div>
      </div>
      {isEditing && (
        <div className="mt-4">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskItem;