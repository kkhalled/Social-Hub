import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBookmark,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";

/**
 * UserMenu Component
 * Dropdown menu for user profile and logout
 */
export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <img
          src={user?.photo || defaultAvatar}
          alt={user?.name}
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {user?.name}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="text-gray-400 text-xs"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4" />
            My Profile
          </Link>
          <Link
            to="/bookmarks"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FontAwesomeIcon icon={faBookmark} className="text-gray-400 w-4" />
            Saved Posts
          </Link>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
