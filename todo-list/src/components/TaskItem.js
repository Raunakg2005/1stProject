import React from "react";
import { FaTrash, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const TaskItem = ({ task, toggleComplete, deleteTask, darkMode }) => {
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
            <p
              className={`text-lg ${
                task.completed ? "line-through text-gray-500" : "font-medium"
              }`}
            >
              {task.text}
            </p>
            <p className="text-sm text-gray-500">
              {task.category} • Due: {task.dueDate || "No due date"}{" "}
              {task.dueTime && `at ${task.dueTime}`} • Priority: {task.priority}
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
