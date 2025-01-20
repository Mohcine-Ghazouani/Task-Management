import { Bell, CircleUser } from "lucide-react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import UserApi from "../services/Api/User/UserApi";
import { UseUserContext } from "../context/UserContext";
import { LOGIN_ROUTE } from "../router/index";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { logout } = UseUserContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    UserApi.getUserNotifications().then(({ data }) => {
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n) => !n.is_read).length);
    });
  }, [notifications]);

  const markNotificationAsRead = (id) => {
    UserApi.updateNotification(id);
  };

  const handleLogout = async () => {
    UserApi.logout().then(() => {
      logout();
      navigate(LOGIN_ROUTE);
    });
  };
  return (
    <>
      <nav className="fixed top-0 left-0 z-0 w-full bg-gray-100 shadow">
        <div className="flex items-center h-16 mx-auto max-w-7xl">
          <div className="flex justify-between w-full">
            <div className="flex items-start"></div>
            <div className="flex items-center">
              <Menu as="div" className="relative ">
                <div>
                  <MenuButton className="p-2 text-gray-600 transition duration-200 hover:text-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Bell className="rounded-full " />
                    {unreadCount > 0 && (
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
                        {unreadCount}
                      </span>
                    )}
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-64 max-h-72 overflow-y-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {notifications.length > 0 ? (
                    notifications
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((notification) => (
                        <MenuItem key={notification.id}>
                          <div
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            className={`cursor-pointer px-4 py-2 text-sm ${
                              notification.is_read
                                ? "text-gray-600"
                                : "text-gray-800 font-semibold"
                            } hover:bg-gray-100`}
                          >
                            {notification.message}
                          </div>
                        </MenuItem>
                      ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-600">
                      No notifications.
                    </p>
                  )}
                </MenuItems>
              </Menu>

              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="p-2 text-gray-600 transition duration-200 hover:text-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <CircleUser className="w-8 h-8 rounded-full" />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="/profile"
                      className="block px-4 py-2  text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      href="#"
                      className="block text-left px-4 py-2 w-full text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
