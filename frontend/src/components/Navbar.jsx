import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    FaBars,
    FaBell,
    FaHome,
    FaUser,
    FaSignInAlt,
    FaUserPlus,
    FaTimes,
} from "react-icons/fa";

import "./Navbar.css";

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
        // <>
        //     <nav className="navbar">
        //         <div className="navbar-container">
        //             <div className="navbar-content">
        //                 <div className="navbar-start">
        //                     <button
        //                         className="menu-button"
        //                         onClick={toggleSidebar}
        //                     >
        //                         <FaBars />
        //                     </button>
        //                 </div>
        //                 <div className="navbar-end">
        //                     <div className="relative notifications-container">
        //                         <button className="notification-button">
        //                             <FaBell />
        //                         </button>
        //                     </div>
        //                     <div className="relative profile-container">
        //                         <button className="profile-button">
        //                             <img
        //                                 src="pic.jpg"
        //                                 alt="Profile"
        //                                 className="profile-image"
        //                             />
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </nav>
        //     <div
        //         className={`sidebar ${
        //             sidebarOpen ? "translate-x-0" : "-translate-x-full"
        //         }`}
        //     >
        //         <div className="sidebar-header">
        //             <h2>Menu</h2>
        //             <button className="close-btn" onClick={toggleSidebar}>
        //                 <FaTimes />
        //             </button>
        //         </div>
        //         <div className="sidebar-content">
        //             <Link to="/" className="link-icon">
        //                 <FaHome />
        //                 <span className="link-text">Home</span>
        //                 {/* <SideBarIcon icon={<FaHome />} text="Home" /> */}
        //             </Link>
        //             <Link to="/Users" className="link-icon">
        //                 <FaUser />
        //                 <span className="link-text">Users</span>
        //                 {/* <SideBarIcon icon={<FaUser />} text="Users" /> */}
        //             </Link>
        //             <Link to="/Login" className="link-icon">
        //                 <FaSignInAlt />
        //                 <span className="link-text">Login</span>
        //                 {/* <SideBarIcon icon={<FaSignInAlt />} text="Login" /> */}
        //             </Link>
        //             <Link to="/Register" className="link-icon">
        //                 <FaUserPlus />
        //                 <span className="link-text">Register</span>
        //                 {/* <SideBarIcon icon={<FaUserPlus />} text="Register" /> */}
        //             </Link>
        //             <Link to="/dashboard" className="link-icon">
        //                 <FaUserPlus />
        //                 <span className="link-text">Dashboard</span>
                        
        //             </Link>
        //         </div>
        //     </div>
        //     {isMobile && sidebarOpen && (
        //         <div
        //             className="overlay"
        //             onClick={() => setSidebarOpen(false)}
        //         />
        //     )}
        // </>
        <>
            <nav className="bg-white shadow fixed w-full z-0 top-0 left-0">
                <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
                    <div className="flex justify-between w-full">
                        <div className="flex items-start">
                            <button
                                className="p-2 border border-gray-400 rounded-md bg-transparent text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200"
                                onClick={toggleSidebar}
                            >
                                <FaBars />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 border border-gray-400 rounded-md bg-transparent text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200 relative">
                                <FaBell />
                            </button>
                            <button className="p-2">
                                <img
                                    src="pic.jpg"
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full"
                                />
                            </button>
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
                        <FaTimes />
                    </button>
                </div>
                <div className="p-4">
                    <Link to="/" className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200">
                        <FaHome className="mr-2" />
                        <span>Home</span>
                    </Link>
                    <Link to="/Users" className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200">
                        <FaUser className="mr-2" />
                        <span>Users</span>
                    </Link>
                    <Link to="/Login" className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200">
                        <FaSignInAlt className="mr-2" />
                        <span>Login</span>
                    </Link>
                    <Link to="/Register" className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200">
                        <FaUserPlus className="mr-2" />
                        <span>Register</span>
                    </Link>
                    <Link to="/dashboard" className="flex items-center p-2 mb-2 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white transition duration-200">
                        <FaUserPlus className="mr-2" />
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
