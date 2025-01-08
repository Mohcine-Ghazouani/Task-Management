import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "./Layout.css";
export default function Layout() {
    return (
        <>
            <header>
                <Navbar />
                <Sidebar />
            </header>
            <main className="main">
                <Outlet />
            </main>
            {/* <footer>footer</footer> */}
        </>
    );
}
