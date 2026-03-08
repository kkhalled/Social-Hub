import React from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";

export default function UserFollowingList({ following, followingCount }) {
  if (!Array.isArray(following) || following.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faUserGroup} className="text-blue-500 text-sm" />
        Following
        <span className="ml-auto text-xs text-gray-400">{followingCount}</span>
      </h3>
      <div className="space-y-2.5">
        {following.slice(0, 5).map((f) => (
          <Link
            key={f._id}
            to={`/user/${f._id}`}
            className="flex items-center gap-2.5 group"
          >
            <img
              src={f.photo || defaultAvatar}
              alt={f.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors truncate">
              {f.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
