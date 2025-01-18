import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, toggleComplete, deleteTask, darkMode }) => {
  return (
    <div>
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            darkMode={darkMode}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
