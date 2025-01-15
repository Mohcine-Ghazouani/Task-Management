
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  House,
  Users,
  AlignJustify,
} from "lucide-react";

import PropTypes from 'prop-types';

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
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <AlignJustify className="h-6 w-6" />
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
        <div className="flex items-center justify-between h-16 bg-gray-100 border-b border-gray-300 px-4">
          
        </div>
        <div className="p-3">
          <Link
            to="/AdminDashboard"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <House className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Dashboard</span>}
          </Link>
          <Link
            to="/Users"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <Users className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Users</span>}
          </Link>
          <Link
            to="/add-task"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <Plus className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Add Task</span>}
          </Link>
          
        </div>
      </div>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}




















