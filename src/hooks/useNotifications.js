import { useState, useEffect } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "../api/notificationsApi";
import { toast } from "react-toastify";

/**
 * Custom hook to manage notifications data and actions
 */
export default function useNotifications() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications(pageNum = 1, append = false) {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const response = await getNotifications(pageNum, 20);
      if (response.success === true || response.message === "success") {
        const items = response.data?.notifications || response.notifications || [];
        const meta = response.meta?.pagination || response.data?.paginationInfo || {};
        setAll((prev) => (append ? [...prev, ...items] : items));
        setHasMore((meta.currentPage ?? pageNum) < (meta.numberOfPages ?? 1));
        setPage(pageNum);
      }
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      await markAsRead(id);
      setAll((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {
      /* silent */
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead();
      setAll((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  }

  function loadMore() {
    fetchNotifications(page + 1, true);
  }

  const unreadCount = all.filter((n) => !n.isRead).length;

  return {
    notifications: all,
    loading,
    loadingMore,
    hasMore,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    loadMore,
  };
}
