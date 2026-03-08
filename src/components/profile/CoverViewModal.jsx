import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCamera, faTrashCan } from "@fortawesome/free-solid-svg-icons";

/**
 * CoverViewModal Component
 * Full-screen view of cover photo with actions
 */
export default function CoverViewModal({
  show,
  cover,
  coverPreview,
  onClose,
  onChangeCover,
  onRemoveCover,
}) {
  if (!show || (!coverPreview && !cover)) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
      >
        <FontAwesomeIcon icon={faXmark} className="text-white text-xl" />
      </button>

      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={coverPreview || cover}
          alt="Cover preview"
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={onChangeCover}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
          >
            <FontAwesomeIcon icon={faCamera} className="text-xs" />
            Change Cover
          </button>
          <button
            onClick={onRemoveCover}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg"
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
