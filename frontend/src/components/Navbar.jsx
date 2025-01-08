import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  House,
  LogIn,
  UserRoundPlus,
  Users,
  Bell,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

import "./Navbar.css";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function Navbar() {
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
      <nav className="bg-white shadow fixed w-full z-0 top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
          <div className="flex justify-between w-full">
            <div className="flex items-start">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 transition duration-200"
                //className="p-2 border border-gray-400 rounded-md bg-transparent text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
                onClick={toggleSidebar}
              >
                <PanelLeftOpen />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 transition duration-200"
                //className="p-2 border border-gray-400 rounded-md bg-transparent text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200 relative"
              >
                <Bell />
              </button>
              {/* <button className="p-2">
                <img
                  src="pic.jpg"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button> */}

              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="pic.jpg"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Profile
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
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
            <PanelLeftClose />
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
