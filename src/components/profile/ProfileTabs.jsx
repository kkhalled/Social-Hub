import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * ProfileTabs Component
 * Tab navigation for Posts and Saved
 */
export default function ProfileTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all border-b-2 ${
              activeTab === tab.key
                ? "text-blue-600 border-blue-600 bg-blue-50/50"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-xs" />
            {tab.label}
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
