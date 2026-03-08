import React from "react";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * NavItem Component
 * Individual navigation link with icon and optional badge
 */
export default function NavItem({ icon, label, path, badge = 0, onClick }) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`
      }
    >
      <div className="relative">
        <FontAwesomeIcon icon={icon} />
        {badge > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      <span>{label}</span>
    </NavLink>
  );
}
