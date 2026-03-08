import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";

/**
 * ReplyForm Component
 * Form for creating a reply to a comment
 */
export default function ReplyForm({ 
  userPhoto, 
  replyContent, 
  onReplyChange, 
  onSubmit, 
  onCancel 
}) {
  return (
    <form onSubmit={onSubmit} className="mt-2.5 pl-1">
      <div className="flex items-center gap-2">
        <img
          src={userPhoto || defaultAvatar}
          alt="You"
          onError={(e) => { e.target.src = defaultAvatar; }}
          className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
        />
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full overflow-hidden focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => onReplyChange(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-3.5 py-2 text-xs outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onCancel();
              }
            }}
          />
          <button
            type="submit"
            disabled={!replyContent.trim()}
            className="px-3 py-2 text-blue-600 hover:text-blue-700 disabled:text-gray-300 transition-colors"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
          </button>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
        >
          <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
        </button>
      </div>
    </form>
  );
}
