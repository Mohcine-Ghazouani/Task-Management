import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  House,
  LogIn,
  UserRoundPlus,
  Users,
 
  AlignJustify,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest(".sidebar")) {
        setSidebarOpen(true);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  return (
    <>
      { !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <AlignJustify className="h-6 w-6" />
        </button>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            className="text-gray-600 hover:text-gray-800 transition duration-200"
            onClick={toggleSidebar}
          >
            <X />
          </button>
        </div>
        <div className="p-4">
          <Link
            to="/"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <House className="mr-2" />
            <span>Home</span>
          </Link>
          <Link
            to="/Users"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <Users className="mr-2" />
            <span>Users</span>
          </Link>
          <Link
            to="/Login"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <LogIn className="mr-2" />
            <span>Login</span>
          </Link>
          <Link
            to="/Register"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <UserRoundPlus className="mr-2" />
            <span>Register</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
          >
            <LayoutDashboard className="mr-2" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
