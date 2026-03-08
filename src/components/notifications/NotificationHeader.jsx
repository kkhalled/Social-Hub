import React from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

export default function NotificationHeader({ unreadCount, onMarkAllAsRead }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5 animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Stay updated on your activity</p>
        </div>
      </div>

      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition-all shadow-sm hover:shadow"
        >
          <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
          Mark all read
        </button>
      )}
    </div>
  );
}
