import React from "react";
import defaultAvatar from "../../assets/user.png";
import { timeAgo } from "../../utils/timeAgo";

/**
 * RepliesList Component
 * Displays a list of replies for a comment
 */
export default function RepliesList({ replies, onAddReply }) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2.5">
      <div className="pl-3 border-l-2 border-blue-100 space-y-2.5">
        {replies.map((reply) => {
          const replyAvatar =
            reply.commentCreator?.photo &&
            !reply.commentCreator.photo.includes("undefined")
              ? reply.commentCreator.photo
              : defaultAvatar;

          return (
            <div key={reply._id} className="flex gap-2">
              <img
                src={replyAvatar}
                alt={reply.commentCreator?.name || "User"}
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 border border-gray-100">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 text-[11px]">
                      {reply.commentCreator?.name || "User"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[12px] leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add reply button when viewing replies */}
      {onAddReply && (
        <button
          onClick={onAddReply}
          className="text-gray-500 hover:text-blue-600 font-semibold text-[11px] pl-3 transition-colors"
        >
          Add a reply...
        </button>
      )}
    </div>
  );
}
