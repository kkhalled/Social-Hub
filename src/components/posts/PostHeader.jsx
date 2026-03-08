import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faBookmark as faBookmarkSolid,
  faPen,
  faTrash,
  faGlobe,
  faLock,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import defaultAvatar from "../../assets/user.png";
import { timeAgo } from "../../utils/timeAgo";

const PRIVACY_ICONS = {
  public: faGlobe,
  followers: faUserGroup,
  only_me: faLock,
};

const PRIVACY_LABELS = {
  public: "Public",
  followers: "Followers",
  only_me: "Only me",
};

/**
 * PostHeader Component
 * Displays user info, timestamp, privacy, and actions menu
 */
export default function PostHeader({
  name,
  username,
  photo,
  date,
  postId,
  userId,
  privacy = "public",
  isOwner,
  isBookmarked,
  onBookmark,
  onDelete,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const privacyIcon = PRIVACY_ICONS[privacy] || faGlobe;
  const privacyLabel = PRIVACY_LABELS[privacy] || "Public";
  const displayName = username || name?.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="flex items-center justify-between px-5 py-4 min-h-[72px]">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link
          to={userId ? `/user/${userId}` : "#"}
          className="relative group/avatar shrink-0"
        >
          <img
            src={photo || defaultAvatar}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 group-hover/avatar:ring-blue-200 transition-all"
            alt={name}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
        </Link>
        
        <div>
          <Link
            to={userId ? `/user/${userId}` : "#"}
            className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <span className="font-medium text-gray-500">@{displayName}</span>
            <span>&middot;</span>
            <Link
              to={`/post/${postId}`}
              className="hover:text-blue-500 transition-colors"
            >
              {timeAgo(date)}
            </Link>
            <span>&middot;</span>
            <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-gray-500">
              <FontAwesomeIcon icon={privacyIcon} className="text-[9px]" />
              {privacyLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 3-dot Menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-400 hover:text-gray-600 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
        
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50">
            <button
              onClick={() => {
                onBookmark();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isBookmarked ? "bg-yellow-100" : "bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={isBookmarked ? faBookmarkSolid : faBookmark}
                  className={`text-xs ${
                    isBookmarked ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
              </span>
              {isBookmarked ? "Unsave post" : "Save post"}
            </button>
            
            {isOwner && (
              <>
                <button
                  onClick={() => {
                    navigate(`/post/${postId}?edit=true`);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faPen} className="text-xs text-blue-500" />
                  </span>
                  Edit post
                </button>
                <div className="my-1 mx-3 border-t border-gray-100" />
                <button
                  onClick={() => {
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTrash} className="text-xs text-red-500" />
                  </span>
                  Delete post
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
