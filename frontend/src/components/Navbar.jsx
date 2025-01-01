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
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-content">
                        <div className="navbar-start">
                            <button
                                className="menu-button"
                                onClick={toggleSidebar}
                            >
                                <FaBars />
                            </button>
                        </div>
                        <div className="navbar-end">
                            <div className="relative notifications-container">
                                <button className="notification-button">
                                    <FaBell />
                                </button>
                            </div>
                            <div className="relative profile-container">
                                <button className="profile-button">
                                    <img
                                        src="pic.jpg"
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div
                className={`sidebar ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="sidebar-header">
                    <h2>Menu</h2>
                    <button className="close-btn" onClick={toggleSidebar}>
                        <FaTimes />
                    </button>
                </div>
                <div className="sidebar-content">
                    <Link to="/" className="link-icon">
                        <FaHome />
                        <span className="link-text">Home</span>
                        {/* <SideBarIcon icon={<FaHome />} text="Home" /> */}
                    </Link>
                    <Link to="/Users" className="link-icon">
                        <FaUser />
                        <span className="link-text">Users</span>
                        {/* <SideBarIcon icon={<FaUser />} text="Users" /> */}
                    </Link>
                    <Link to="/Login" className="link-icon">
                        <FaSignInAlt />
                        <span className="link-text">Login</span>
                        {/* <SideBarIcon icon={<FaSignInAlt />} text="Login" /> */}
                    </Link>
                    <Link to="/Register" className="link-icon">
                        <FaUserPlus />
                        <span className="link-text">Register</span>
                        {/* <SideBarIcon icon={<FaUserPlus />} text="Register" /> */}
                    </Link>
                    <Link to="/dashboard" className="link-icon">
                        <FaUserPlus />
                        <span className="link-text">Dashboard</span>
                        
                    </Link>
                </div>
            </div>
            {isMobile && sidebarOpen && (
                <div
                    className="overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
