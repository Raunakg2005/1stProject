import React from "react";
import { AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, toggleComplete, deleteTask, editTask, archiveTask, darkMode }) => {
  return (
    <div>
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            editTask={editTask}
            archiveTask={archiveTask}
            darkMode={darkMode}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;