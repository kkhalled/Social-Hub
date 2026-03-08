import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import NotificationHeader from "../../components/notifications/NotificationHeader";
import NotificationTabs from "../../components/notifications/NotificationTabs";
import NotificationItem from "../../components/notifications/NotificationItem";
import NotificationSkeleton from "../../components/notifications/NotificationSkeleton";
import EmptyNotifications from "../../components/notifications/EmptyNotifications";
import useNotifications from "../../hooks/useNotifications";

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    loading,
    loadingMore,
    hasMore,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    loadMore,
  } = useNotifications();

  const displayed = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <NotificationHeader unreadCount={unreadCount} onMarkAllAsRead={handleMarkAllAsRead} />

        {/* Filter Tabs */}
        <NotificationTabs
          filter={filter}
          setFilter={setFilter}
          allCount={notifications.length}
          unreadCount={unreadCount}
        />

        {/* Notification List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <EmptyNotifications filter={filter} />
          ) : (
            <ul className="divide-y divide-gray-100">
              {displayed.map((n) => (
                <NotificationItem key={n._id} notification={n} onMarkAsRead={handleMarkAsRead} />
              ))}
            </ul>
          )}

          {/* Load More */}
          {hasMore && !loading && (
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Load more notifications"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
