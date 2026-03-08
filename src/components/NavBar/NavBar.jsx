import {
  faShareNodes,
  faHouse,
  faBell,
  faUser,
  faBars,
  faXmark,
  faSignOutAlt,
  faBookmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { AuthContext } from "../../context/AuthContext";
import { getUnreadCount } from "../../api/notificationsApi";
import defaultAvatar from "../../assets/user.png";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, setUser, setToken, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    async function fetchUnread() {
      try {
        const res = await getUnreadCount();
        setUnreadCount(res.data?.unreadCount ?? 0);
      } catch (_) { /* ignore */ }
    }
    fetchUnread();
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { icon: faHouse, label: "Feed", path: "/" },
    { icon: faUser, label: "Profile", path: "/profile" },
    { icon: faBell, label: "Notifications", path: "/notifications", badge: unreadCount },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faShareNodes} className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">Social Hub</span>
          </Link>

          {/* Center Nav - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                <div className="relative">
                  <FontAwesomeIcon icon={item.icon} />
                  {item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center gap-3">
            {/* User dropdown - Desktop */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={user?.photo || defaultAvatar}
                  alt={user?.name}
                  onError={(e) => { e.target.src = defaultAvatar; }}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user?.name}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/bookmarks"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faBookmark} className="text-gray-400 w-4" />
                    Saved Posts
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faXmark : faBars}
                className="text-gray-600 text-lg"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-1">
            <div className="flex items-center gap-3 px-2 py-3 mb-2">
              <img
                src={user?.photo || defaultAvatar}
                alt={user?.name}
                onError={(e) => { e.target.src = defaultAvatar; }}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={item.icon} className="w-4" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
              <NavLink
                to="/bookmarks"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <FontAwesomeIcon icon={faBookmark} className="w-4" />
                <span>Saved Posts</span>
              </NavLink>
            </nav>

            <div className="border-t border-gray-100 mt-3 pt-3 px-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
