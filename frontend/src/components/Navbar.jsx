import { Bell, CircleUser } from "lucide-react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import UserApi from "../services/Api/User/UserApi";
import { UseUserContext } from "../context/UserContext";
import { LOGIN_ROUTE } from "../router/index";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = UseUserContext();
  const navigate = useNavigate();
  const handleLogout = async () => {
    UserApi.logout().then(() => {
      logout();
      navigate(LOGIN_ROUTE);
    });
  };
  return (
    <>
      <nav className="bg-gray-100 shadow fixed w-full z-0 top-0 left-0">
        <div className="max-w-7xl mx-auto  flex items-center h-16">
          <div className="flex justify-between w-full">
            <div className="flex items-start">
       
            </div>
            <div className="flex items-center">
              <Menu as="div" className="relative ">
                <div>
                  <MenuButton className="p-2 text-gray-600 hover:text-gray-800 transition duration-200">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Bell className=" rounded-full" />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <ul>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        notification
                      </a>
                    </ul>
                  </MenuItem>
                </MenuItems>
              </Menu>

              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="p-2 text-gray-600 hover:text-gray-800 transition duration-200">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <CircleUser className="h-8 w-8 rounded-full" />
                    
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
