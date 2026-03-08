import React from "react";
import { Link } from "react-router";
import defaultAvatar from "../../assets/user.png";

/**
 * FollowersPreview Component
 * Shows preview of users who follow the profile owner
 */
export default function FollowersPreview({ followers }) {
  if (!followers || followers.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm">Followers</h3>
        <span className="text-xs text-gray-400">{followers.length}</span>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {followers.slice(0, 8).map((userId) => (
            <Link
              key={userId}
              to={`/user/${userId}`}
              className="group relative"
              title="View profile"
            >
              <img
                src={defaultAvatar}
                alt="User"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white group-hover:ring-rose-300 transition-all"
              />
            </Link>
          ))}
          {followers.length > 8 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500">
                +{followers.length - 8}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
