import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <>
      <header className="h-16">
        <Navbar />

        <Sidebar />
      </header>
      <main className="main mx-16">
        <Outlet />
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
