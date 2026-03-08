import React from "react";

function StatBox({ label, value }) {
  return (
    <div className="text-center px-5 py-3">
      <p className="text-xl font-bold text-gray-900">{value ?? 0}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
    </div>
  );
}

export default function UserStatsBar({ postsCount, followersCount, followingCount }) {
  return (
    <div className="mt-5 flex items-center divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
      <StatBox label="Posts" value={postsCount} />
      <StatBox label="Followers" value={followersCount} />
      <StatBox label="Following" value={followingCount} />
    </div>
  );
}
