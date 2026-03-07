import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCompass,
  faUsers,
  faBookmark,
  faCalendarDays,
  faNewspaper,
  faGear,
  faCircleQuestion,
  faFire,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/user.png";

export default function LeftSidebar() {

  const {user} = useContext(AuthContext)

  const menuItems = [
    { icon: faHouse, label: "Home", path: "/" },
    { icon: faCompass, label: "Explore", path: "/explore" },
    { icon: faUsers, label: "Communities", path: "/communities" },
    { icon: faBookmark, label: "Saved Posts", path: "/bookmarks" },
    { icon: faCalendarDays, label: "Events", path: "/events" },
    { icon: faNewspaper, label: "News Feed", path: "/news" },
  ];

  const trendingTopics = [
    { tag: "ReactJS", posts: "12.5K" },
    { tag: "TailwindCSS", posts: "8.2K" },
    { tag: "JavaScript", posts: "15.3K" },
    { tag: "WebDev", posts: "9.1K" },
  ];

  return (
    <aside className="w-60 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto scrollbar-hide">
      <div className="space-y-4 pr-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Cover Image */}
          <div className="h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative">
            <div className="absolute inset-0 opacity-30">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), 
                                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%)`,
                }}
              ></div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-4 pb-5 -mt-8">
            <div className="relative inline-block">
              <Link to={"/profile"}>
                <img
                  src={user?.photo || defaultAvatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg cursor-pointer"
                />
              </Link>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <h3 className="font-bold text-gray-900 mt-3 text-lg">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>

            {/* Stats */}
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="font-bold text-gray-900">1.2K</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">856</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">142</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Menu
          </h4>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-base group-hover:scale-110 transition-transform duration-300"
                />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faFire} className="text-orange-500" />
              Trending
            </h4>
            <Link
              to="/trending"
              className="text-xs text-blue-500 hover:text-blue-600 font-semibold"
            >
              See all
            </Link>
          </div>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <Link
                key={index}
                to={`/topic/${topic.tag}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faHashtag}
                    className="text-blue-500 text-sm group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                    {topic.tag}
                  </span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300">
                  {topic.posts}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings & Help */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
          <nav className="space-y-1">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 group"
            >
              <FontAwesomeIcon
                icon={faGear}
                className="text-base group-hover:rotate-90 transition-transform duration-500"
              />
              <span>Settings</span>
            </Link>
            <Link
              to="/help"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 group"
            >
              <FontAwesomeIcon
                icon={faCircleQuestion}
                className="text-base group-hover:scale-110 transition-transform duration-300"
              />
              <span>Help & Support</span>
            </Link>
          </nav>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-gray-400">
            © 2024 SocialHub. All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );
}
