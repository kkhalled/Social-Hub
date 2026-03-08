import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faLock,
  faUserGroup,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: faGlobe },
  { value: "followers", label: "Followers", icon: faUserGroup },
  { value: "only_me", label: "Only me", icon: faLock },
];

/**
 * VisibilitySelector Component
 * Dropdown for selecting post visibility (public, followers, only me)
 */
export default function VisibilitySelector({ value = "public", onChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const currentOption = VISIBILITY_OPTIONS.find((opt) => opt.value === value) || VISIBILITY_OPTIONS[0];

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (onChange) onChange(optionValue);
    setShowMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 px-2 py-0.5 rounded-full"
      >
        <FontAwesomeIcon icon={currentOption.icon} className="text-[10px]" />
        <span>{currentOption.label}</span>
        <FontAwesomeIcon icon={faChevronDown} className="text-[8px]" />
      </button>

      {showMenu && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
          {VISIBILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-3 py-2 flex items-center gap-2.5 text-sm transition-colors ${
                value === option.value
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FontAwesomeIcon icon={option.icon} className="text-xs w-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
