import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {DASHBOARD_ROUTE} from "../router/index";
import { useEffect , useState } from "react";
import { UseUserContext } from "../context/UserContext";

export default function GuestLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();
  const context = UseUserContext();

  useEffect(() => {
    if (context.authenticated) {
      navigate(DASHBOARD_ROUTE);
    }
  }, []);
  return (
    <>
      {/* <header className="h-16">
              <Navbar />
            </header> */}
            {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
            <main
              className={`main flex-grow transition-all duration-300 ease-in-out 
              ${sidebarOpen && !isMobile ? "mx-52" : ""}
              ${!sidebarOpen && !isMobile ? "mx-20" : ""}
              ${isMobile ? "mx-4" : ""}`} 
            >
        <Outlet />
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
