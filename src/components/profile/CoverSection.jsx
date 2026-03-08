import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faEllipsisVertical,
  faExpand,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

/**
 * CoverSection Component
 * Profile cover photo with upload/delete functionality
 */
export default function CoverSection({
  cover,
  coverPreview,
  coverInputRef,
  onCoverChange,
  onViewCover,
  showCoverMenu,
  setShowCoverMenu,
  onRemoveCover,
}) {
  return (
    <div className="h-56 sm:h-72 lg:h-80 relative group overflow-hidden">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onCoverChange}
      />

      {coverPreview || cover ? (
        <img
          src={coverPreview || cover}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          onClick={onViewCover}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
      )}

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      {/* Cover menu button */}
      {(coverPreview || cover) && (
        <button
          onClick={() => setShowCoverMenu(!showCoverMenu)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-20"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-700" />
        </button>
      )}

      {/* Cover dropdown menu */}
      {showCoverMenu && (
        <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-30 min-w-[180px]">
          <button
            onClick={() => {
              onViewCover();
              setShowCoverMenu(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
          >
            <FontAwesomeIcon icon={faExpand} className="text-gray-400 text-xs" />
            View cover
          </button>
          <button
            onClick={() => {
              coverInputRef.current?.click();
              setShowCoverMenu(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
          >
            <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-xs" />
            Change cover
          </button>
          <button
            onClick={onRemoveCover}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition border-t border-gray-100"
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-red-500 text-xs" />
            Remove
          </button>
        </div>
      )}

      {/* Fallback hover overlay when no cover */}
      {!coverPreview && !cover && (
        <div
          onClick={() => coverInputRef.current?.click()}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
          <span className="text-white text-sm font-semibold">Add Cover Photo</span>
        </div>
      )}
    </div>
  );
}
