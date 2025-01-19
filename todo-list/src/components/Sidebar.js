import React from "react";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  filter,
  setFilter,
  subFilter,
  setSubFilter,
  darkMode,
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 shadow-lg z-50 transform transition-transform duration-300 ${
        isSidebarOpen || window.innerWidth >= 768 ? "translate-x-0" : "-translate-x-full"
      } ${darkMode ? "bg-gray-900" : "bg-blue-500"}`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Filters</h2>
        {window.innerWidth < 768 && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            ✖
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="h-[calc(100%-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-700 hover:scrollbar-thumb-blue-500">
        {/* Main Filters */}
        <ul className="space-y-4">
          {["All", "Pending", "Completed"].map((type) => (
            <li
              key={type}
              onClick={() => {
                setFilter(type);
                setIsSidebarOpen(false);
              }}
              className={`cursor-pointer p-2 rounded-lg text-lg ${
                filter === type
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
            >
              {type}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <hr className="my-4 border-gray-400" />

        {/* Sub-Filters */}
        <h3 className="text-xl font-semibold mb-2">Sub-Filters</h3>
        <ul className="space-y-4">
          {["All", "High", "Medium", "Low", "Work", "Personal", "Shopping"].map(
            (type) => (
              <li
                key={type}
                onClick={() => setSubFilter(type)}
                className={`cursor-pointer p-2 rounded-lg text-lg ${
                  subFilter === type
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-600 hover:text-white"
                }`}
              >
                {type}
              </li>
            )
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;