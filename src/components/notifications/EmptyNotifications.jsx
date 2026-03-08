import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faInbox } from "@fortawesome/free-solid-svg-icons";

export default function EmptyNotifications({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-5">
        <FontAwesomeIcon
          icon={filter === "unread" ? faCheckDouble : faInbox}
          className="text-3xl text-blue-400"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1.5">
        {filter === "unread" ? "You're all caught up!" : "No notifications yet"}
      </h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        {filter === "unread"
          ? "You've read all your notifications. Check back later."
          : "When someone likes, comments or follows you, it'll show up here."}
      </p>
    </div>
  );
}
