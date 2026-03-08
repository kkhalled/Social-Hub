import React from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";

/**
 * LikesModal Component
 * Displays modal with list of users who liked the post
 */
export default function LikesModal({
  isOpen,
  likersList,
  likersHasMore,
  likersLoading,
  onClose,
  onLoadMore,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faThumbsUp} className="text-white text-sm" />
            </span>
            <h3 className="text-base font-bold text-white">
              People who reacted
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-96">
          {likersLoading && likersList.length === 0 ? (
            <div className="space-y-1 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center gap-3 px-2 py-2.5"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-28" />
                    <div className="h-2.5 bg-gray-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="py-1">
              {likersList.map((person) => (
                <li key={person._id}>
                  <Link
                    to={`/user/${person._id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={person.photo || defaultAvatar}
                      alt={person.name}
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {person.name}
                      </p>
                      {person.username && (
                        <p className="text-xs text-gray-400">
                          @{person.username}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Load More */}
        {likersHasMore && (
          <div className="border-t border-gray-100 p-4">
            <button
              onClick={onLoadMore}
              disabled={likersLoading}
              className="w-full py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
            >
              {likersLoading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
