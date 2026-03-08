import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUserGroup,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

/**
 * AboutSection Component
 * Displays user's basic information
 */
export default function AboutSection({ profile, joined }) {
  const p = profile;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm">About</h3>
      </div>
      <div className="p-5 space-y-3.5">
        {p.email && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 font-medium">Email</p>
              <p className="text-sm text-gray-700 truncate">{p.email}</p>
            </div>
          </div>
        )}
        {p.gender && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faUserGroup} className="text-pink-500 text-xs" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Gender</p>
              <p className="text-sm text-gray-700 capitalize">{p.gender}</p>
            </div>
          </div>
        )}
        {p.dateOfBirth && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faCalendarDays} className="text-amber-500 text-xs" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Birthday</p>
              <p className="text-sm text-gray-700">
                {new Date(p.dateOfBirth).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
        {joined && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faCalendarDays} className="text-green-500 text-xs" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Joined</p>
              <p className="text-sm text-gray-700">{joined}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
