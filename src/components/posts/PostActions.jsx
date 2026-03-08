import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faShareFromSquare,
  faThumbsUp as faThumbsUpOutline,
} from "@fortawesome/free-regular-svg-icons";

/**
 * PostActions Component
 * Displays action buttons (Like, Comment, Share)
 */
export default function PostActions({
  isLiked,
  commentsExpanded,
  onLike,
  onComment,
  onShare,
}) {
  return (
    <div className="border-t border-gray-100 grid grid-cols-3 text-[13px] font-semibold">
      <button
        onClick={onLike}
        className={`flex items-center justify-center gap-2 py-3 transition-all ${
          isLiked
            ? "text-blue-600 bg-blue-50/50"
            : "text-gray-500 hover:bg-blue-50/50 hover:text-blue-600"
        }`}
      >
        <FontAwesomeIcon
          icon={isLiked ? faThumbsUp : faThumbsUpOutline}
          className="text-base"
        />
        <span>{isLiked ? "Liked" : "Like"}</span>
      </button>

      <button
        onClick={onComment}
        className={`flex items-center justify-center gap-2 py-3 border-x border-gray-100 transition-all ${
          commentsExpanded
            ? "text-green-600 bg-green-50/50"
            : "text-gray-500 hover:bg-green-50/50 hover:text-green-600"
        }`}
      >
        <FontAwesomeIcon icon={faComment} className="text-base" />
        <span>Comment</span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center justify-center gap-2 py-3 text-gray-500 hover:bg-orange-50/50 hover:text-orange-500 transition-all"
      >
        <FontAwesomeIcon icon={faShareFromSquare} className="text-base" />
        <span>Share</span>
      </button>
    </div>
  );
}
