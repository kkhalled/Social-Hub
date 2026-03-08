import React from "react";
import LikeButton from "./LikeButton";
import { timeAgo } from "../../utils/timeAgo";

/**
 * CommentActions Component
 * Displays action buttons for a comment (timestamp, like, reply, edit, delete)
 */
export default function CommentActions({
  date,
  postId,
  commentId,
  isLiked,
  likesCount,
  repliesCount,
  showReplies,
  loadingReplies,
  isOwner,
  onLoadReplies,
  onToggleReplyForm,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex items-center gap-3.5 text-[11px] px-1 mt-1.5">
      {/* Timestamp */}
      <span className="text-gray-500 font-medium">{timeAgo(date)}</span>

      {/* Like Button */}
      <LikeButton
        postId={postId}
        commentId={commentId}
        initialIsLiked={isLiked}
        initialLikesCount={likesCount}
      />

      {/* Reply Button */}
      {repliesCount > 0 ? (
        <button
          onClick={onLoadReplies}
          disabled={loadingReplies}
          className="text-gray-500 hover:text-blue-600 font-semibold transition-colors disabled:opacity-50"
        >
          {loadingReplies
            ? "Loading..."
            : showReplies
            ? `Hide replies (${repliesCount})`
            : `Reply (${repliesCount})`}
        </button>
      ) : (
        <button
          onClick={onToggleReplyForm}
          className="text-gray-500 hover:text-blue-600 font-semibold transition-colors"
        >
          Reply
        </button>
      )}

      {/* Owner Actions (Edit & Delete) */}
      {isOwner && (
        <>
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-600 font-semibold transition-colors opacity-0 group-hover/comment:opacity-100"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 font-semibold transition-colors opacity-0 group-hover/comment:opacity-100"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
