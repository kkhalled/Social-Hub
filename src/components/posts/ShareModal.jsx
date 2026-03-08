import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";
import defaultAvatar from "../../assets/user.png";

/**
 * ShareModal Component
 * Displays modal for sharing a post with optional message
 */
export default function ShareModal({
  isOpen,
  shareMessage,
  shareLoading,
  postData,
  onMessageChange,
  onSubmit,
  onClose,
}) {
  if (!isOpen) return null;

  const { name, username, photo, body, image, displayName } = postData;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faShareFromSquare}
                className="text-white text-sm"
              />
            </span>
            <h3 className="text-base font-bold text-white">Share post</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Message Input */}
        <div className="px-6 pt-4 pb-2">
          <textarea
            value={shareMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Say something about this..."
            rows={3}
            className="w-full resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Post Preview */}
        <div className="mx-6 my-3 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <div className="px-4 py-3 flex items-center gap-2.5 bg-white">
            <img
              src={photo || defaultAvatar}
              alt={name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">{name}</p>
              <p className="text-xs text-gray-400">@{displayName}</p>
            </div>
          </div>
          {body && (
            <p className="px-4 py-2.5 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100">
              {body}
            </p>
          )}
          {image && (
            <img src={image} alt="Post" className="w-full max-h-48 object-cover" />
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={shareLoading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all disabled:opacity-60"
          >
            {shareLoading ? "Sharing..." : "Share now"}
          </button>
        </div>
      </div>
    </div>
  );
}
