import { Outlet } from "react-router-dom";

import { useState } from "react";

export default function Layout() {
  const [sidebarOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  return (
    <>
      <main
        className={`main flex-grow transition-all duration-300 ease-in-out 
        ${sidebarOpen && !isMobile ? "mx-52" : ""}
        ${!sidebarOpen && !isMobile ? "mx-20" : ""}
        ${isMobile ? "mx-4" : ""}`}
      >
        <Outlet />
      </main>
    </>
  );
}
