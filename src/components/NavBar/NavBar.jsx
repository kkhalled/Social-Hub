import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faHouse,
  faBell,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { getUnreadCount } from "../../api/notificationsApi";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

/**
 * NavBar Component
 * Main navigation bar with desktop and mobile views
 */
export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, setUser, setToken, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch unread notifications count
  useEffect(() => {
    if (!token) return;
    
    async function fetchUnread() {
      try {
        const res = await getUnreadCount();
        setUnreadCount(res.data?.unreadCount ?? 0);
      } catch (_) {
        /* ignore */
      }
    }
    fetchUnread();
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Navigation items configuration
  const navItems = [
    { icon: faHouse, label: "Feed", path: "/" },
    { icon: faUser, label: "Profile", path: "/profile" },
    {
      icon: faBell,
      label: "Notifications",
      path: "/notifications",
      badge: unreadCount,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faShareNodes}
                className="text-white text-sm"
              />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              Social Hub
            </span>
          </Link>

          {/* Center Nav - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center gap-3">
            {/* User dropdown - Desktop */}
            <div className="hidden md:block">
              <UserMenu user={user} onLogout={handleLogout} />
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
        <MobileMenu
          isOpen={isMenuOpen}
          user={user}
          navItems={navItems}
          onClose={() => setIsMenuOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </nav>
  );
}
