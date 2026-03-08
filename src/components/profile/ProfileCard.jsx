import React from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTrashCan,
  faXmark,
  faEnvelope,
  faCalendarDays,
  faLocationDot,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";
import { abbreviate } from "../../utils/formatters";

/**
 * ProfileCard Component
 * Main profile information card with avatar and stats
 */
export default function ProfileCard({
  profile,
  imagePreview,
  fileInputRef,
  onPhotoChange,
  showPhotoMenu,
  setShowPhotoMenu,
  onRemovePhoto,
  joined,
  postsCount,
  followersCount,
  followingCount,
  onChangePassword,
}) {
  const p = profile;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="relative -mt-20 sm:-mt-24">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start">
            {/* Avatar */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
            <div className="relative shrink-0 -mt-20 sm:-mt-24">
              <div
                className="p-1 bg-white rounded-full shadow-lg cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={imagePreview || p.photo || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover"
                />
              </div>
              <div className="absolute inset-1 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
              </div>
              {/* Online dot */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full" />

              {/* Delete button */}
              {(imagePreview || p.photo) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPhotoMenu(!showPhotoMenu);
                  }}
                  className="absolute top-0 right-0 w-8 h-8 bg-white hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg transition-all border-2 border-white"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="text-red-500 text-xs" />
                </button>
              )}

              {/* Photo delete menu */}
              {showPhotoMenu && (
                <div className="absolute top-10 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30 min-w-[160px]">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-600 font-semibold">Remove photo?</p>
                  </div>
                  <button
                    onClick={onRemovePhoto}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                    Remove
                  </button>
                  <button
                    onClick={() => setShowPhotoMenu(false)}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition border-t border-gray-100"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {p.name}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                @{p.username || p.email?.split("@")[0]}
              </p>

              {/* Bio */}
              {p.bio && (
                <p className="text-gray-600 text-sm mt-2 max-w-md leading-relaxed">
                  {p.bio}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5 mt-3">
                {p.email && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                    {p.email}
                  </span>
                )}
                {joined && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                    Joined {joined}
                  </span>
                )}
                {p.location && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                    {p.location}
                  </span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                <div className="text-center">
                  <p className="text-xl font-extrabold text-gray-900">{abbreviate(postsCount)}</p>
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Posts</p>
                </div>
                <div className="w-px h-9 bg-gray-200" />
                <div className="text-center">
                  <p className="text-xl font-extrabold text-gray-900">{abbreviate(followersCount)}</p>
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Followers</p>
                </div>
                <div className="w-px h-9 bg-gray-200" />
                <div className="text-center">
                  <p className="text-xl font-extrabold text-gray-900">{abbreviate(followingCount)}</p>
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Following</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={onChangePassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <FontAwesomeIcon icon={faKey} className="text-xs" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
