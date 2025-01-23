import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "./firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AuthPage from "./components/AuthPage"; 
import ProfilePage from "./components/ProfilePage"; 
import ArchivedTasks from "./components/ArchivedTasks"; 

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("dueDate");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [user, setUser] = useState(null); 

 
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadTasks(user.uid); 
        loadArchivedTasks(user.uid); 
      } else {
        setUser(null);
        setTasks([]); 
        setArchivedTasks([]); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  // Load tasks from Firestore
  const loadTasks = async (userId) => {
    try {
      const tasksRef = collection(db, "tasks");
      const q = query(tasksRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userTasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(userTasks);
    } catch (error) {
      toast.error("Failed to load tasks: " + error.message);
    }
  };

  // Load archived tasks from Firestore
  const loadArchivedTasks = async (userId) => {
    try {
      const archivedTasksRef = collection(db, "archivedTasks");
      const q = query(archivedTasksRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const userArchivedTasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArchivedTasks(userArchivedTasks);
    } catch (error) {
      toast.error("Failed to load archived tasks: " + error.message);
    }
  };

  // Add a new task to Firestore
  const addTask = async (newTask, category, dueDateTime, priority) => {
    if (newTask.trim() === "") return;
    try {
      const task = {
        text: newTask,
        category,
        dueDateTime,
        priority,
        completed: false,
        userId: user.uid, 
      };
      const docRef = await addDoc(collection(db, "tasks"), task);
      setTasks([...tasks, { id: docRef.id, ...task }]);
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Failed to add task: " + error.message);
      console.error("Error adding task:", error); 
    }
  };

  // Mark a task as completed
  const toggleComplete = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      const task = tasks.find((task) => task.id === id);
      await updateDoc(taskRef, { completed: !task.completed });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      toast.info("Task status updated!");
    } catch (error) {
      toast.error("Failed to update task: " + error.message);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
      toast.error("Task deleted!");
    } catch (error) {
      toast.error("Failed to delete task: " + error.message);
    }
  };

  // Delete an archived task
  const deleteArchivedTask = async (taskId) => {
    try {
      console.log("Deleting archived task with ID:", taskId); // Debugging
  
      // Query Firestore to find the document ID based on the task's id
      const archivedTasksRef = collection(db, "archivedTasks");
      const q = query(archivedTasksRef, where("id", "==", taskId)); // Assuming "id" is the field storing the task ID
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.error("No matching task found in Firestore");
        toast.error("Task not found in Firestore");
        return;
      }
  
      // Get the Firestore document ID
      const docId = querySnapshot.docs[0].id;
      console.log("Firestore document ID to delete:", docId); // Debugging
  
      // Delete the task from Firestore
      await deleteDoc(doc(db, "archivedTasks", docId));
      console.log("Archived task deleted from Firestore"); // Debugging
  
      // Update the local state to remove the deleted task
      setArchivedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      console.log("Archived task removed from local state"); // Debugging
  
      toast.success("Archived task deleted successfully!");
    } catch (error) {
      console.error("Error deleting archived task:", error); // Debugging
      toast.error("Failed to delete archived task: " + error.message);
    }
  };

  // Edit a task
  const editTask = async (id, newText) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { text: newText });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task: " + error.message);
    }
  };

  // Archive a task
  const archiveTask = async (id) => {
    try {
      const taskToArchive = tasks.find((task) => task.id === id);
      await addDoc(collection(db, "archivedTasks"), { ...taskToArchive, userId: user.uid });
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
      setArchivedTasks([...archivedTasks, taskToArchive]);
      toast.info("Task archived!");
    } catch (error) {
      toast.error("Failed to archive task: " + error.message);
    }
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(error.message);
    }
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
    <Router>
      <Routes>
        {/* Auth Page */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/" /> : <AuthPage />}
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/auth" />}
        />

        {/* Archive Page */}
        <Route
          path="/archive"
          element={
            user ? (
              <ArchivedTasks
                archivedTasks={archivedTasks}
                setArchivedTasks={setArchivedTasks}
                darkMode={darkMode}
                onDeleteTask={deleteArchivedTask} // Pass the new function
              />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {/* Main App */}
        <Route
          path="/"
          element={
            user ? (
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
                  handleSignOut={handleSignOut}
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
                      <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                      >
                        Sign Out
                      </button>
                      <Link
                        to="/profile"
                        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/archive"
                        className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600"
                      >
                        Archive
                      </Link>
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
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;