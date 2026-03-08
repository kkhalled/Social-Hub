import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckDouble,
  faHeart,
  faComment,
  faUserPlus,
  faRetweet,
  faReply,
  faInbox,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getNotifications, markAsRead, markAllAsRead } from "../../api/notificationsApi";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import defaultAvatar from "../../assets/user.png";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const TYPE_CONFIG = {
  like_post:     { icon: faHeart,    bg: "bg-red-100",    text: "text-red-500",    label: "liked your post" },
  comment_post:  { icon: faComment,  bg: "bg-green-100",  text: "text-green-500",  label: "commented on your post" },
  reply_comment: { icon: faReply,    bg: "bg-amber-100",  text: "text-amber-500",  label: "replied to your comment" },
  follow_user:   { icon: faUserPlus, bg: "bg-blue-100",   text: "text-blue-500",   label: "started following you" },
  share_post:    { icon: faRetweet,  bg: "bg-purple-100", text: "text-purple-500", label: "shared your post" },
  like:    { icon: faHeart,    bg: "bg-red-100",    text: "text-red-500",    label: "liked your post" },
  comment: { icon: faComment,  bg: "bg-green-100",  text: "text-green-500",  label: "commented on your post" },
  follow:  { icon: faUserPlus, bg: "bg-blue-100",   text: "text-blue-500",   label: "started following you" },
  share:   { icon: faRetweet,  bg: "bg-purple-100", text: "text-purple-500", label: "shared your post" },
};

function getConfig(type) {
  return TYPE_CONFIG[type] || { icon: faBell, bg: "bg-gray-100", text: "text-gray-500", label: "interacted with your content" };
}

function NotificationSkeleton() {
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

export default function Notifications() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  async function fetchNotifications(pageNum = 1, append = false) {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const response = await getNotifications(pageNum, 20);
      if (response.success === true || response.message === "success") {
        const items = response.data?.notifications || response.notifications || [];
        const meta  = response.meta?.pagination || response.data?.paginationInfo || {};
        setAll(prev => append ? [...prev, ...items] : items);
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

  async function handleMarkAsRead(id, e) {
    e?.stopPropagation();
    try {
      await markAsRead(id);
      setAll(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch { /* silent */ }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead();
      setAll(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  }

  function handleClick(n) {
    if (!n.isRead) handleMarkAsRead(n._id);
    if (n.entityType === "post") {
      navigate(`/post/${n.entityId}`);
    } else if (n.entityType === "user") {
      navigate(`/user/${n.entityId}`);
    } else if (n.actor?._id) {
      navigate(`/user/${n.actor._id}`);
    }
  }

  const displayed = filter === "unread" ? all.filter(n => !n.isRead) : all;
  const unreadCount = all.filter(n => !n.isRead).length;

  const FILTER_TABS = [
    { key: "all", label: "All", count: all.length },
    { key: "unread", label: "Unread", count: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">Stay updated on your activity</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition-all shadow-sm hover:shadow"
            >
              <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm">
          {FILTER_TABS.map(tab => (
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
              <span className={`ml-1.5 text-xs ${filter === tab.key ? "text-blue-200" : "text-gray-300"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[1,2,3,4,5].map(i => <NotificationSkeleton key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-5">
                <FontAwesomeIcon icon={filter === "unread" ? faCheckDouble : faInbox} className="text-3xl text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1.5">
                {filter === "unread" ? "You're all caught up!" : "No notifications yet"}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                {filter === "unread"
                  ? "You've read all your notifications. Check back later."
                  : "When someone likes, comments or follows you, it'll show up here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {displayed.map((n) => {
                const cfg = getConfig(n.type);
                const actor = n.actor || n.sender;
                const entity = n.entity;
                const isPostEntity = n.entityType === "post" || entity?.body !== undefined;

                return (
                  <li key={n._id}>
                    <button
                      onClick={() => handleClick(n)}
                      className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-all group ${
                        n.isRead
                          ? "hover:bg-gray-50"
                          : "bg-blue-50/40 hover:bg-blue-50/70"
                      }`}
                    >
                      {/* Avatar + badge */}
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={actor?.photo || defaultAvatar}
                          alt={actor?.name}
                          onError={(e) => { e.target.src = defaultAvatar; }}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white ${cfg.bg}`}>
                          <FontAwesomeIcon icon={cfg.icon} className={`text-[10px] ${cfg.text}`} />
                        </span>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">
                          <Link
                            to={`/user/${actor?._id}`}
                            onClick={e => e.stopPropagation()}
                            className="font-bold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {actor?.name || "Someone"}
                          </Link>
                          {" "}
                          <span className="text-gray-500">{cfg.label}</span>
                        </p>

                        {isPostEntity && entity?.body && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                            &ldquo;{entity.body}&rdquo;
                          </p>
                        )}

                        {(n.type === "comment_post" || n.type === "comment") && entity?.topComment?.content && (
                          <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100 truncate max-w-xs">
                            <FontAwesomeIcon icon={faComment} className="text-[9px] text-gray-400 mr-1" />
                            {entity.topComment.content}
                          </p>
                        )}

                        <p className={`text-[11px] mt-1.5 font-semibold ${n.isRead ? "text-gray-300" : "text-blue-500"}`}>
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {isPostEntity && entity?.image && (
                          <img
                            src={entity.image}
                            alt="post"
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                          />
                        )}
                        {!n.isRead && (
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-blue-100" />
                        )}
                        {!n.isRead && (
                          <button
                            onClick={e => handleMarkAsRead(n._id, e)}
                            className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Load more */}
          {hasMore && !loading && (
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={() => fetchNotifications(page + 1, true)}
                disabled={loadingMore}
                className="w-full py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : "Load more notifications"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
