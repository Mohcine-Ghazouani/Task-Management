import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import AdminFooter from "../../components/AdminFooter";
import { LOGIN_ROUTE } from "../../router/index";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";

/**
 * AdminDashboardLayout (Improved)
 * - Desktop layout now respects the sidebar width via CSS var `--sbw` set by AdminSidebar
 * - No overlay on desktop; content is pushed using inline style marginLeft: var(--sbw)
 * - Mobile still uses overlay (sbw becomes 0 when closed / 256 when open)
 * - Safer effects, loading state, and team name merge fix
 */
export default function AdminDashbordLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setUser, authenticated, setAuthenticated, logout } = UseUserContext();
  const [isLoading, setIsLoading] = useState(true);

  // Auth gate + current user fetch
  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        if (!authenticated) {
          navigate(LOGIN_ROUTE);
          return;
        }
        const { data } = await UserApi.getUser();
        if (!mounted) return;
        setUser(data);
        setAuthenticated(true);
      } catch (err) {
        console.error(err);
        if (mounted) logout();
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, [authenticated, navigate, setAuthenticated, setUser, logout]);

  // Enrich with team name when available
  useEffect(() => {
    let mounted = true;
    const teamId = user?.team_id;
    if (!teamId) return;

    axiosClient
      .get(`/teams/${teamId}`)
      .then(({ data }) => {
        if (!mounted) return;
        setUser((prev) => ({ ...prev, team: data.team.name }));
      })
      .catch((err) => console.error(err));

    return () => {
      mounted = false;
    };
  }, [user?.team_id, setUser]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-30">
        <AdminNavbar />
      </header>
      <div className="fixed top-16 left-0 z-40 h-[calc(100%-4rem)] border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out">
       {/* Sidebar sets --sbw. Desktop content is pushed by this margin. */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> 
      </div>
      

      <main
        style={{ marginLeft: "var(--sbw, 0px)" }}
        className="mt-20 flex-1 px-4 transition-[margin] duration-300 ease-in-out md:px-10 lg:px-20"
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
