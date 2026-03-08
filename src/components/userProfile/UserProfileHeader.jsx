import React from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";

export default function UserProfileHeader({
  userProfile,
  isOwnProfile,
  isFollowing,
  followLoading,
  onFollowToggle,
}) {
  const p = userProfile;
  const displayName = p.username || p.email?.split("@")[0];

  const coverStyle = p.cover
    ? { backgroundImage: `url(${p.cover})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {/* Cover Photo */}
      <div className="h-52 sm:h-60 relative" style={p.cover ? coverStyle : {}}>
        {!p.cover && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Profile Info Card */}
      <div className="bg-white px-6 sm:px-10 pb-6">
        {/* Avatar + Name + Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-12">
          {/* Avatar + Name */}
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <img
                src={p.photo || defaultAvatar}
                alt={p.name}
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{p.name}</h1>
              <p className="text-gray-500 text-sm">@{displayName}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwnProfile ? (
            <div className="flex items-center gap-2 sm:pb-1">
              <button
                onClick={onFollowToggle}
                disabled={followLoading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-sm ${
                  isFollowing
                    ? "bg-white text-gray-700 border border-gray-300 hover:border-red-300 hover:text-red-600"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                <FontAwesomeIcon
                  icon={isFollowing ? faUserMinus : faUserPlus}
                  className="text-xs"
                />
                {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ) : (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors sm:pb-1 shadow-sm"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
