import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  House,
  UserCog,
  ClipboardList,
  Users,
} from "lucide-react";
import PropTypes from "prop-types";

/**
 * AdminSidebar (Enhanced + Non-overlay desktop)
 * - Mobile: overlay drawer
 * - Desktop: DOES NOT cover content; we expose current width via CSS var --sbw
 *   so your main content can add margin-left accordingly.
 * - Active route highlighting via NavLink
 */
export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem("adminSidebar:expanded");
    return saved ? JSON.parse(saved) : true; // default expanded on desktop
  });
  const firstRender = useRef(true);

  // Update mobile flag on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure overlay is closed when switching to desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile, setSidebarOpen]);

  // Persist expanded state
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("adminSidebar:expanded", JSON.stringify(expanded));
  }, [expanded]);

  // --- Broadcast current sidebar width via CSS var --sbw (so main can offset) ---
  const currentWidth = isMobile ? 0 : expanded ? 256 /* w-64 */ : 64 /* w-16 */;

  useEffect(() => {
    document.documentElement.style.setProperty("--sbw", `${currentWidth}px`);
    return () => {
      document.documentElement.style.setProperty("--sbw", "0px");
    };
  }, [currentWidth]);

  const items = useMemo(
    () => [
      { to: "/AdminDashboard", label: "Dashboard", icon: House },
      { to: "/teams", label: "Teams", icon: UserCog },
      { to: "/Tasks", label: "Tasks", icon: ClipboardList },
      { to: "/Users", label: "Users", icon: Users },
    ],
    []
  );

  const shellBase =
    "fixed left-0 z-40 h-full md:h-[calc(100vh-4rem)] top-0 md:top-16 border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out";
  const desktopWidth = expanded ? "w-64" : "w-16";
  const mobileTranslate = sidebarOpen ? "translate-x-0" : "-translate-x-full";

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
        aria-label="Admin navigation"
        className={`${shellBase} ${
          isMobile ? `w-64 ${mobileTranslate}` : desktopWidth
        }`}
      >
        {/* Brand + expand/collapse */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-3 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              AD
            </div>
            {((!isMobile && expanded) || isMobile) && (
              <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                Admin
              </span>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Links */}
        <ul className="mt-2 space-y-1 px-2">
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
                {((!isMobile && expanded) || isMobile) && (
                  <span className="truncate">{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile overlay only */}
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

AdminSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
