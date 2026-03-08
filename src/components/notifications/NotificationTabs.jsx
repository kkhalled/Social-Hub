import React from "react";

export default function NotificationTabs({ filter, setFilter, allCount, unreadCount }) {
  const TABS = [
    { key: "all", label: "All", count: allCount },
    { key: "unread", label: "Unread", count: unreadCount },
  ];

  return (
    <div className="flex gap-1 mb-5 bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            filter === tab.key
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          {tab.label}
          <span
            className={`ml-1.5 text-xs ${
              filter === tab.key ? "text-blue-200" : "text-gray-300"
            }`}
          >
            ({tab.count})
          </span>
        </button>
      ))}
    </div>
  );
}
