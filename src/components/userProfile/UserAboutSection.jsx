import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEnvelope,
  faVenusMars,
  faCakeCandles,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

function AboutRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={icon} className="text-blue-500 text-xs" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function formatDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UserAboutSection({ userProfile }) {
  const p = userProfile;
  const genderDisplay = p.gender
    ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1)
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-sm" />
        About
      </h3>
      <div className="space-y-4">
        <AboutRow icon={faEnvelope} label="Email" value={p.email} />
        <AboutRow icon={faVenusMars} label="Gender" value={genderDisplay} />
        <AboutRow icon={faCakeCandles} label="Birthday" value={formatDate(p.dateOfBirth)} />
        <AboutRow icon={faCalendarDays} label="Joined" value={formatDate(p.createdAt)} />
      </div>
    </div>
  );
}
