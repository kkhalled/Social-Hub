import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faBookmark,
  faHeart,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { abbreviate } from "../../utils/formatters";

/**
 * QuickStatsCards Component
 * Colorful stat cards showing posts, bookmarks, followers, following
 */
export default function QuickStatsCards({
  postsCount,
  savedCount,
  followersCount,
  followingCount,
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-sm">
        <FontAwesomeIcon icon={faImages} className="text-blue-200 text-lg mb-2" />
        <p className="text-2xl font-extrabold">{postsCount}</p>
        <p className="text-blue-200 text-xs font-medium">Total Posts</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-sm">
        <FontAwesomeIcon icon={faBookmark} className="text-purple-200 text-lg mb-2" />
        <p className="text-2xl font-extrabold">{savedCount}</p>
        <p className="text-purple-200 text-xs font-medium">Saved Posts</p>
      </div>
      <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-4 text-white shadow-sm">
        <FontAwesomeIcon icon={faHeart} className="text-rose-200 text-lg mb-2" />
        <p className="text-2xl font-extrabold">{abbreviate(followersCount)}</p>
        <p className="text-rose-200 text-xs font-medium">Followers</p>
      </div>
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-sm">
        <FontAwesomeIcon icon={faComment} className="text-emerald-200 text-lg mb-2" />
        <p className="text-2xl font-extrabold">{abbreviate(followingCount)}</p>
        <p className="text-emerald-200 text-xs font-medium">Following</p>
      </div>
    </div>
  );
}
