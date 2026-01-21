import {
  faShareNodes,
  faUsers,
  faHouse,
  faSearch,
  faBell,
  faMessage,
  faCompass,
  faPlus,
  faBars,
  faXmark,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Home from "../../pages/Home/Home";
import {} from "@fortawesome/free-regular-svg-icons";
import { AuthContext } from "../../context/AuthContext";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {setUser , setToken} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
  setUser(null);          // 🔥 أهم سطر
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
};


  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <Link rel="stylesheet" to={"/"}>
                  <FontAwesomeIcon
                    className="text-blue-600"
                    icon={faShareNodes}
                  />{" "}
                  <span className="text-gray-900 ml-2">SocialHub</span>
                </Link>
              </h1>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex gap-8 items-center">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 ${
                      isActive ? "text-blue-600 font-semibold" : ""
                    }`
                  }
                  to={"/"}
                >
                  <FontAwesomeIcon icon={faHouse} />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 ${
                      isActive ? "text-blue-600 font-semibold" : ""
                    }`
                  }
                  to={"/explore"}
                >
                  <FontAwesomeIcon icon={faCompass} />
                  <span>Explore</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 ${
                      isActive ? "text-blue-600 font-semibold" : ""
                    }`
                  }
                  to={"/communites"}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  <span>Communities</span>
                </NavLink>
              </li>
            </ul>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex flex-1 mx-8 max-w-sm">
              <div className="relative w-full">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full border border-gray-300 bg-gray-50 p-2.5 pl-11 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  type="search"
                  placeholder="Search posts, people, topics..."
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Notification and Message Icons - Desktop */}
              <div className="hidden sm:flex gap-4 text-gray-600">
                <button className="relative hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                  <FontAwesomeIcon icon={faBell} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="relative hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                  <FontAwesomeIcon icon={faMessage} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* log out Button - Desktop */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 transition-colors font-semibold whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FontAwesomeIcon
                  icon={isMenuOpen ? faXmark : faBars}
                  className="text-gray-600 text-xl"
                />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              {/* Mobile Search */}
              <div className="py-3 px-2">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    className="w-full border border-gray-300 bg-gray-50 p-2 pl-9 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    type="search"
                    placeholder="Search..."
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <ul className="flex flex-col gap-2 py-3">
                <li>
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    to={"/"}
                  >
                    <FontAwesomeIcon icon={faHouse} />
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    to={"/explore"}
                  >
                    <FontAwesomeIcon icon={faCompass} />
                    <span>Explore</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    to={"/communites"}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Communities</span>
                  </NavLink>
                </li>
              </ul>

              {/* Mobile Quick Actions */}
              <div className="flex gap-2 px-2 py-3 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faBell} />
                  <span className="text-sm">Notifications</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faMessage} />
                  <span className="text-sm">Messages</span>
                </button>
              </div>

              {/* Mobile Create Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
