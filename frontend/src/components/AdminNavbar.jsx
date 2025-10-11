import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Bell, CircleUser } from "lucide-react";
import UserApi from "../services/Api/User/UserApi";
import { UseUserContext } from "../context/UserContext";
import { LOGIN_ROUTE } from "../router/index";
import { useNavigate, Link } from "react-router-dom";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { logout } = UseUserContext();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  const pollRef = useRef(null);

  // Initial fetch + light polling (every 60s). Avoid infinite loop.
  useEffect(() => {
    let mounted = true;
    async function fetchNotifications() {
      try {
        const { data } = await UserApi.getNotifications();
        if (!mounted) return;
        setNotifications(data.notifications || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchNotifications();

    // Optional: background poll while page is visible
    pollRef.current = setInterval(() => {
      if (document.visibilityState === "visible") fetchNotifications();
    }, 60000);

    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const markNotificationAsRead = async (id) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await UserApi.updateNotification(id);
    } catch (e) {
      console.error(e);
      // Rollback if failed
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)));
    }
  };

  const markAllAsRead = async () => {
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (ids.length === 0) return;
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
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Task Manager</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <MenuButton className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <span className="sr-only">Open notifications</span>
              <Bell className="h-5 w-5" />
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
              <MenuItems className="absolute right-0 z-50 mt-2 w-80 max-h-80 overflow-y-auto origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="mb-1 flex items-center justify-between px-1">
                  <p className="text-xs font-medium text-gray-500">Notifications</p>
                  <button
                    onClick={markAllAsRead}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Mark all read
                  </button>
                </div>

                {loading ? (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">Loading…</div>
                ) : notifications.length > 0 ? (
                  notifications
                    .slice()
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((n) => (
                      <MenuItem key={n.id}>
                        {({ active }) => (
                          <button
                            onClick={() => markNotificationAsRead(n.id)}
                            className={classNames(
                              "w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm",
                              active ? "bg-gray-100" : "",
                              n.is_read ? "text-gray-600" : "font-semibold text-gray-800"
                            )}
                          >
                            <p className="line-clamp-2">{n.message}</p>
                            <p className="mt-0.5 text-[11px] text-gray-500">{new Date(n.created_at).toLocaleString()}</p>
                          </button>
                        )}
                      </MenuItem>
                    ))
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">No notifications</div>
                )}
              </MenuItems>
            </Transition>
          </Menu>

          {/* User menu */}
          <Menu as="div" className="relative">
            <MenuButton className="rounded-full p-1 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <span className="sr-only">Open user menu</span>
              <CircleUser className="h-8 w-8" />
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/admin-profile"
                      className={classNames(
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
                      onClick={async () => {
                        try {
                          await UserApi.logout();
                        } finally {
                          logout();
                          navigate(LOGIN_ROUTE);
                        }
                      }}
                      className={classNames(
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
    </nav>
  );
}
