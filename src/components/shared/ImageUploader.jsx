import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * ImageUploader Component
 * Reusable image upload with preview and remove functionality
 */
export default function ImageUploader({
  imagePreview,
  onImageChange,
  onRemoveImage,
  error,
  buttonText = "Photo",
  buttonClassName = "",
  showButton = true,
}) {
  return (
    <>
      {/* Upload Button */}
      {showButton && (
        <label className={`cursor-pointer ${buttonClassName}`}>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && onImageChange) {
                onImageChange(file);
              }
            }}
          />
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600">
            <FontAwesomeIcon icon={faImage} className="text-green-500" />
            <span className="hidden sm:inline font-medium">{buttonText}</span>
          </div>
        </label>
      )}

      {/* Image Preview */}
      {imagePreview && !error && (
        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 relative group">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-72 object-cover"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </>
  );
}
