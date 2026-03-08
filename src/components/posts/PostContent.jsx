import React from "react";
import { Link } from "react-router";
import defaultAvatar from "../../assets/user.png";
import { timeAgo } from "../../utils/timeAgo";

/**
 * PostContent Component
 * Displays post body, image, and shared post preview
 */
export default function PostContent({ body, image, isShare, sharedPost }) {
  return (
    <>
      {/* Body Text */}
      {body && (
        <div className="px-5 pb-3">
          <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </div>
      )}

      {/* Shared Post Preview */}
      {isShare && sharedPost && (
        <div className="mx-5 mb-3 border border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="px-4 pt-3 pb-2 flex items-center gap-2.5">
            <img
              src={sharedPost.user?.photo || defaultAvatar}
              alt={sharedPost.user?.name}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <Link
                to={`/user/${sharedPost.user?._id}`}
                className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {sharedPost.user?.name}
              </Link>
              <div className="text-xs text-gray-400">
                @
                {sharedPost.user?.username ||
                  sharedPost.user?.name?.toLowerCase().replace(/\s+/g, "")}
                {" \u00B7 "}
                {timeAgo(sharedPost.createdAt)}
              </div>
            </div>
          </div>
          
          {sharedPost.body && (
            <p className="px-4 pb-2 text-sm text-gray-600 leading-relaxed">
              {sharedPost.body}
            </p>
          )}
          
          {sharedPost.image && (
            <Link to={`/post/${sharedPost._id}`}>
              <img
                src={sharedPost.image}
                alt="Shared post"
                className="w-full max-h-64 object-cover"
              />
            </Link>
          )}
        </div>
      )}

      {/* Own Image */}
      {image && !isShare && (
        <div className="w-full">
          <img
            src={image}
            className="w-full max-h-[500px] object-cover"
            alt="Post content"
          />
        </div>
      )}
    </>
  );
}
