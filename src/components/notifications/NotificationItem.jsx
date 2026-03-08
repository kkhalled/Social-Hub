import React from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { getNotificationConfig, timeAgo } from "../../utils/notificationHelpers";
import defaultAvatar from "../../assets/user.png";

export default function NotificationItem({ notification, onMarkAsRead }) {
  const navigate = useNavigate();
  const n = notification;
  const cfg = getNotificationConfig(n.type);
  const actor = n.actor || n.sender;
  const entity = n.entity;
  const isPostEntity = n.entityType === "post" || entity?.body !== undefined;

  function handleClick() {
    if (!n.isRead) onMarkAsRead(n._id);
    if (n.entityType === "post") {
      navigate(`/post/${n.entityId}`);
    } else if (n.entityType === "user") {
      navigate(`/user/${n.entityId}`);
    } else if (actor?._id) {
      navigate(`/user/${actor._id}`);
    }
  }

  function handleMarkReadClick(e) {
    e.stopPropagation();
    onMarkAsRead(n._id);
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-all group ${
          n.isRead ? "hover:bg-gray-50" : "bg-blue-50/40 hover:bg-blue-50/70"
        }`}
      >
        {/* Avatar + Badge */}
        <div className="relative shrink-0 mt-0.5">
          <img
            src={actor?.photo || defaultAvatar}
            alt={actor?.name}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white ${cfg.bg}`}
          >
            <FontAwesomeIcon icon={cfg.icon} className={`text-[10px] ${cfg.text}`} />
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 leading-snug">
            <Link
              to={`/user/${actor?._id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {actor?.name || "Someone"}
            </Link>{" "}
            <span className="text-gray-500">{cfg.label}</span>
          </p>

          {isPostEntity && entity?.body && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
              &ldquo;{entity.body}&rdquo;
            </p>
          )}

          {(n.type === "comment_post" || n.type === "comment") &&
            entity?.topComment?.content && (
              <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100 truncate max-w-xs">
                <FontAwesomeIcon icon={faComment} className="text-[9px] text-gray-400 mr-1" />
                {entity.topComment.content}
              </p>
            )}

          <p
            className={`text-[11px] mt-1.5 font-semibold ${
              n.isRead ? "text-gray-300" : "text-blue-500"
            }`}
          >
            {timeAgo(n.createdAt)}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {isPostEntity && entity?.image && (
            <img
              src={entity.image}
              alt="post"
              className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
            />
          )}
          {!n.isRead && (
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-blue-100" />
          )}
          {!n.isRead && (
            <button
              onClick={handleMarkReadClick}
              className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              Mark read
            </button>
          )}
        </div>
      </button>
    </li>
  );
}
