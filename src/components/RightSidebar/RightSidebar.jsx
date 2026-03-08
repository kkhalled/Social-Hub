import React, { useContext } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faHashtag } from "@fortawesome/free-solid-svg-icons";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";

const TRENDING = [
  { tag: "ReactJS", posts: "12.4K" },
  { tag: "TailwindCSS", posts: "8.2K" },
  { tag: "JavaScript", posts: "24.1K" },
  { tag: "WebDev", posts: "15.7K" },
];

export default function RightSidebar() {
  return (
    <aside className="w-72 sticky top-[72px] h-[calc(100vh-72px)] pt-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide pb-6">
      {/* Trending */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowTrendUp} className="text-blue-600 text-sm" />
          <h3 className="font-bold text-gray-900 text-sm">Trending Topics</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {TRENDING.map((t) => (
            <div
              key={t.tag}
              className="px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHashtag} className="text-blue-400 text-xs" />
                <span className="text-sm font-semibold text-gray-900">{t.tag}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 ml-5">{t.posts} posts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Follow Suggestions */}
      <FollowSuggestions />

      {/* Footer */}
      <div className="px-2">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          About &middot; Help &middot; Privacy &middot; Terms
        </p>
      </div>
    </aside>
  );
}
