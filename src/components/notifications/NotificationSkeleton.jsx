import React from "react";

export default function NotificationSkeleton() {
  return (
    <div className="animate-pulse flex items-start gap-4 px-5 py-4">
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-200" />
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-10 shrink-0 mt-1.5" />
    </div>
  );
}
