import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  House,
  ListChecks,
  Users,
  LogOut,
} from "lucide-react";
import PropTypes from "prop-types";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { LOGIN_ROUTE } from "../router";

export default function MemberSidebar({ sidebarOpen, setSidebarOpen }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("memberSidebar:expanded");
    return saved ? JSON.parse(saved) : true; // default expanded on desktop
  });
  const firstRender = useRef(true);

  const navigate = useNavigate();
  const { logout } = UseUserContext();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false); // desktop = non-overlay (collapsed or expanded)
  }, [isMobile, setSidebarOpen]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("memberSidebar:expanded", JSON.stringify(expanded));
  }, [expanded]);

  // Expose width for main layout push
  const currentWidth = isMobile ? 0 : expanded ? 256 /* w-64 */ : 64 /* w-16 */;
  useEffect(() => {
    document.documentElement.style.setProperty("--sbw", `${currentWidth}px`);
    return () => document.documentElement.style.setProperty("--sbw", "0px");
  }, [currentWidth]);

  const items = useMemo(
    () => [
      { to: "/dashboard", label: "Dashboard", icon: House },
      { to: "/tasks", label: "Tasks", icon: ListChecks },
      { to: "/team", label: "Team", icon: Users },
    ],
    []
  );

  const shellBase =
    "fixed left-0 z-40 top-0 md:top-16 h-full md:h-[calc(100vh-4rem)] border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out";
  const desktopWidth = expanded ? "w-64" : "w-16";
  const mobileTranslate = sidebarOpen ? "translate-x-0" : "-translate-x-full";

  const handleLogout = async () => {
    try {
      await UserApi.logout();
    } finally {
      logout();
      navigate(LOGIN_ROUTE);
    }
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 rounded-md bg-gray-100 p-2 text-gray-700 shadow-sm transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:hidden"
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
      >
        <AlignJustify className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <nav
        role="navigation"
        aria-label="Member navigation"
        className={`${shellBase} ${isMobile ? `w-64 ${mobileTranslate}` : desktopWidth}`}
      >
        {/* Full height column to pin logout at bottom */}
        <div className="flex h-full flex-col">
          {/* Brand + expand/collapse */}
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-3 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                MB
              </div>
              {((!isMobile && expanded) || isMobile) && (
                <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Member
                </span>
              )}
            </div>
            {!isMobile && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="rounded-md p-1 text-gray-500  transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            )}
          </div>

          {/* Scrollable links area */}
          <ul className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`
                  }
                  title={!isMobile && !expanded ? label : undefined}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {((!isMobile && expanded) || isMobile) && <span className="truncate">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout pinned bottom (non-scrolling) */}
          <div className="border-t border-gray-100 bg-white p-2 dark:border-gray-800 dark:bg-gray-900 shrink-0">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              title={!isMobile && !expanded ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5" />
              {((!isMobile && expanded) || isMobile) && <span>Logout</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}

MemberSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
