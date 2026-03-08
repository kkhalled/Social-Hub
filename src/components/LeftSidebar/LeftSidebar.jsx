import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faBookmark,
  faClipboardList,
  faUsers,
  faBell,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/user.png";

export default function LeftSidebar() {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { icon: faNewspaper, label: "Feed", path: "/", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: faClipboardList, label: "My Posts", path: "/profile", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: faUsers, label: "Community", path: "/community", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: faBell, label: "Notifications", path: "/notifications", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: faBookmark, label: "Saved", path: "/bookmarks", color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <aside className="w-60 sticky top-[72px] h-[calc(100vh-72px)] pt-0 flex flex-col gap-4">
      {/* Profile Card */}
      <Link
        to="/profile"
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
      >
        <img
          src={user?.photo || defaultAvatar}
          alt={user?.name}
          onError={(e) => { e.target.src = defaultAvatar; }}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {user?.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            @{user?.username || user?.email?.split("@")[0]}
          </p>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 text-xs" />
      </Link>

      {/* Navigation */}
      <nav className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-l-[3px] border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? "bg-blue-100" : item.bg
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-sm ${isActive ? "text-blue-600" : item.color}`}
                  />
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 mt-auto pb-4">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          &copy; 2026 Social Hub &middot; Privacy &middot; Terms
        </p>
      </div>
    </aside>
  );
}
