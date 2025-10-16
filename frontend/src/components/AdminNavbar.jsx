import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bell, UserIcon } from "lucide-react";
import UserApi from "../services/Api/User/UserApi";
import { UseUserContext } from "../context/UserContext";
import { LOGIN_ROUTE } from "../router/index";
import { useNavigate, Link } from "react-router-dom";

function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { logout } = UseUserContext();
  const navigate = useNavigate();
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );
  const pollRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function fetchNotifications() {
      try {
        const { data } = await UserApi.getNotifications(); // admin notifications
        if (!mounted) return;
        setNotifications(data.notifications || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchNotifications();
    pollRef.current = setInterval(() => {
      if (document.visibilityState === "visible") fetchNotifications();
    }, 60000);
    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const markNotificationAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await UserApi.updateNotification(id);
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (!ids.length) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await Promise.all(ids.map((id) => UserApi.updateNotification(id)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await UserApi.logout();
    } finally {
      logout();
      navigate(LOGIN_ROUTE);
    }
  };

  return (
    <nav
      className="fixed top-0 right-0 z-50 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm transition-[left] duration-300 ease-in-out"
      style={{ left: "var(--sbw, 0px)" }}
    >
      <div className="mx-auto px-4 pt-2 sm:px-4 lg:px-8 ">
        {/* Rounded container like your screenshot */}
        <div className="flex px-4 h-14 items-center justify-between rounded-2xl bg-white shadow-md ring-1 ring-black/5">
          {/* LEFT — Brand */}
          {isMobile && (
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <Link to="/admin-dashboard" className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 text-center">
                  Task Manager
                </span>
              </Link>
            </div>
          )}
          {!isMobile && (
            <Link to="/admin-dashboard" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100 text-gray-700">
                TM
              </div>
              <span className="sm:inline text-sm font-semibold text-gray-900">
                Task Manager
              </span>
            </Link>
          )}

          {/* RIGHT — Bell next to Profile */}
          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <Menu as="div" className="relative">
              <MenuButton className="relative rounded-full p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <span className="sr-only">Open notifications</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </MenuButton>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-[70] mt-2 w-72 max-h-80 overflow-y-auto origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="mb-1 flex items-center justify-between px-1">
                    <p className="text-xs font-medium text-gray-500">
                      Notifications
                    </p>
                    <button
                      onClick={markAllAsRead}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Mark all read
                    </button>
                  </div>
                  {loading ? (
                    <div className="px-3 py-6 text-center text-sm text-gray-500">
                      Loading…
                    </div>
                  ) : notifications.length ? (
                    notifications
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((n) => (
                        <MenuItem key={n.id}>
                          {({ active }) => (
                            <button
                              onClick={() => markNotificationAsRead(n.id)}
                              className={cx(
                                "w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm",
                                active ? "bg-gray-100" : "",
                                n.is_read
                                  ? "text-gray-600"
                                  : "font-semibold text-gray-800"
                              )}
                            >
                              <p className="line-clamp-2">{n.message}</p>
                              <p className="mt-0.5 text-[11px] text-gray-500">
                                {new Date(n.created_at).toLocaleString()}
                              </p>
                            </button>
                          )}
                        </MenuItem>
                      ))
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  )}
                </MenuItems>
              </Transition>
            </Menu>

            {/* Profile */}
            <Menu as="div" className="relative">
              <MenuButton className="relative rounded-full p-1 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <span className="sr-only">Open user menu</span>
                <UserIcon className="h-7 w-7" />
                {/* green online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
              </MenuButton>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-[70] mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/admin-profile"
                        className={cx(
                          "block rounded-md px-3 py-2 text-sm text-gray-700",
                          active ? "bg-gray-100" : ""
                        )}
                      >
                        Profile
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={cx(
                          "block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700",
                          active ? "bg-gray-100" : ""
                        )}
                      >
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
