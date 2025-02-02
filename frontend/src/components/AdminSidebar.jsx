import { useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCog, ClipboardList, House, AlignJustify } from "lucide-react";

import PropTypes from "prop-types";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const isMobile = window.innerWidth < 768;
  AdminSidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed z-50 p-2 transition-colors bg-gray-100 rounded top-4 left-4 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <AlignJustify className="w-6 h-6" />
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-40 transition-all duration-300 ease-in-out ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0 w-60"
              : "-translate-x-full"
            : sidebarOpen
            ? "w-48"
            : "w-16"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-100 border-b border-gray-300"></div>
        <div className="p-3">
          <Link
            to="/AdminDashboard"
            className="flex items-center p-2 mb-2 text-gray-600 transition duration-200 rounded hover:bg-gray-600 hover:text-white"
          >
            <House className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4">Dashboard</span>}
          </Link>
          {/* <Link
            to="/add-task"
            className="flex items-center p-2 mb-2 text-gray-600 transition duration-200 rounded hover:bg-gray-600 hover:text-white"
          >
            <Plus className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4">Add Task</span>}
          </Link> */}
          <Link
            to="/teams"
            className="flex items-center p-2 mb-2 text-gray-600 transition duration-200 rounded hover:bg-gray-600 hover:text-white"
          >
            <UserCog className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4">Teams</span>}
          </Link>
          {/* <Link
            to="/add-team"
            className="flex items-center p-2 mb-2 text-gray-600 transition duration-200 rounded hover:bg-gray-600 hover:text-white"
          >
            <Plus className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4">Add Team</span>}
          </Link> */}

          <Link
            to="/Tasks"
            className="flex items-center p-2 mb-2 text-gray-600 transition duration-200 rounded hover:bg-gray-600 hover:text-white"
          >
            <ClipboardList className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4">Tasks</span>}
          </Link>

          {/* <Link
            to="/add-task"
            className="flex items-center p-2 mb-2 text-gray-600 transition duration-200 rounded hover:bg-gray-600 hover:text-white"
          >
            <UserPlus className="w-6 h-6" />
            {sidebarOpen && <span className="ml-4">Add User</span>}
          </Link> */}
        </div>
      </div>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity duration-300 ease-in-out bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
