import React from "react";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";

/**
 * MobileMenu Component
 * Mobile navigation menu with user info and nav items
 */
export default function MobileMenu({ isOpen, user, navItems, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden pb-4 border-t border-gray-100 mt-1">
      {/* User Info */}
      <div className="flex items-center gap-3 px-2 py-3 mb-2">
        <img
          src={user?.photo || defaultAvatar}
          alt={user?.name}
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
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
          onClick={onClose}
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

      {/* Logout Button */}
      <div className="border-t border-gray-100 mt-3 pt-3 px-2">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
