import {
  faBell,
  faHeart,
  faComment,
  faUserPlus,
  faRetweet,
  faReply,
} from "@fortawesome/free-solid-svg-icons";

export const TYPE_CONFIG = {
  like_post: { icon: faHeart, bg: "bg-red-100", text: "text-red-500", label: "liked your post" },
  comment_post: { icon: faComment, bg: "bg-green-100", text: "text-green-500", label: "commented on your post" },
  reply_comment: { icon: faReply, bg: "bg-amber-100", text: "text-amber-500", label: "replied to your comment" },
  follow_user: { icon: faUserPlus, bg: "bg-blue-100", text: "text-blue-500", label: "started following you" },
  share_post: { icon: faRetweet, bg: "bg-purple-100", text: "text-purple-500", label: "shared your post" },
  like: { icon: faHeart, bg: "bg-red-100", text: "text-red-500", label: "liked your post" },
  comment: { icon: faComment, bg: "bg-green-100", text: "text-green-500", label: "commented on your post" },
  follow: { icon: faUserPlus, bg: "bg-blue-100", text: "text-blue-500", label: "started following you" },
  share: { icon: faRetweet, bg: "bg-purple-100", text: "text-purple-500", label: "shared your post" },
};

export function getNotificationConfig(type) {
  return TYPE_CONFIG[type] || {
    icon: faBell,
    bg: "bg-gray-100",
    text: "text-gray-500",
    label: "interacted with your content",
  };
}

export function timeAgo(dateStr) {
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
