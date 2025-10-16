import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import AdminFooter from "../../components/AdminFooter";
import { LOGIN_ROUTE } from "../../router/index";
import { UseUserContext } from "../../context/UserContext";

/**
 * AdminLayout (Improved)
 * - Desktop layout now respects the sidebar width via CSS var `--sbw` set by AdminSidebar
 * - No overlay on desktop; content is pushed using inline style marginLeft: var(--sbw)
 * - Mobile still uses overlay (sbw becomes 0 when closed / 256 when open)
 * - Safer effects, loading state, and team name merge fix
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { authenticated, authLoading } = UseUserContext();

  useEffect(() => {
    if (authLoading) return; // wait for context bootstrap
    if (!authenticated) {
      navigate(LOGIN_ROUTE, { replace: true });
    }
  }, [authLoading, authenticated, navigate]);

  if (authLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-gray-600">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed">
        <AdminNavbar />
      </header>
      <div>
        {/* Sidebar sets --sbw. Desktop content is pushed by this margin. */}
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <main
        style={{ marginLeft: "var(--sbw, 0px)" }}
        className="mt-20 flex-1 px-3 transition-[margin] duration-300 ease-in-out md:px-10 lg:px-10"
      >
        <Outlet />
      </main>

      <footer
        style={{ marginLeft: "var(--sbw, 0px)" }}
        className="bg-gray-600 px-4 py-4 text-white transition-[margin] duration-300 ease-in-out md:px-10 lg:px-20"
      >
        <AdminFooter />
      </footer>
    </div>
  );
}
