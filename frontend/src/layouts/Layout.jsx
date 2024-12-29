import { Outlet } from "react-router-dom";
import Navbar from "../assets/Navbar";
import "./Layout.css";
export default function Layout() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className="main">
                <Outlet />
            </main>
            <footer>footer</footer>
        </>
    );
}
