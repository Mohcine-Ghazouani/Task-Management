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
    
    UserApi.getNotifications().then(({ data }) => {
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n) => !n.is_read).length);
    });
  
  }, [notifications]);

  const handleLogout = async () => {
    UserApi.logout().then(() => {
      logout();
      navigate(LOGIN_ROUTE);
    });
  };

  const markNotificationAsRead = (id) => {
    UserApi.updateNotification(id);
  };

  return (
    <>
      <nav className="bg-gray-100 shadow fixed w-full z-0 top-0 left-0">
        <div className="max-w-7xl mx-auto flex items-center h-16">
          <div className="flex justify-between w-full">
            <div className="flex items-start">
              
            </div>
            <div className="flex items-center">
             
              <Menu as="div" className="relative">
                <MenuButton className="relative p-2 text-gray-600 hover:text-gray-800 transition duration-200">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open notifications</span>
                  <Bell className="rounded-full" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-64 max-h-72 overflow-y-auto origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 transition focus:outline-none">
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
                <MenuButton className="p-2 text-gray-600 hover:text-gray-800 transition duration-200">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <CircleUser className="h-8 w-8 rounded-full" />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none">
                  <MenuItem>
                    <a
                      href="/adminprofile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block text-left px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100"
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
