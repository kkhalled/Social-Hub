import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

/**
 * PostStats Component
 * Displays post statistics (likes, shares, comments count)
 */
export default function PostStats({
  likesCount,
  sharesCount,
  commentsCount,
  onLikesClick,
  onCommentsClick,
}) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 text-[13px] text-gray-500">
      <button
        onClick={onLikesClick}
        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors disabled:cursor-default group/likes"
        disabled={likesCount === 0}
      >
        <span className="bg-gradient-to-br from-blue-500 to-blue-600 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon={faThumbsUp} className="text-white text-[9px]" />
        </span>
        <span className="group-hover/likes:underline">{likesCount}</span>
      </button>
      
      <div className="flex items-center gap-4">
        <span>{sharesCount} shares</span>
        <button
          onClick={onCommentsClick}
          className="hover:text-blue-600 hover:underline transition-colors"
        >
          {commentsCount} comments
        </button>
      </div>
    </div>
  );
}
