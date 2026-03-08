import React, { useContext, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faThumbsUp,
  faGlobe,
  faBookmark as faBookmarkSolid,
  faPen,
  faTrash,
  faRetweet,
  faChevronDown,
  faLock,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faShareFromSquare,
  faThumbsUp as faThumbsUpOutline,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import CommentCard from "../CommentCard/CommentCard";
import CreateComment from "../comments/CreateComment";
import { AuthContext } from "./../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { PostsContext } from "../../context/PostProvider";
import { toggleLikePost, toggleBookmarkPost, sharePost, getPostLikes } from "../../api/postsApi";
import { getPostComments } from "../../api/commentsApi";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/user.png";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

const PRIVACY_ICONS = { public: faGlobe, followers: faUserGroup, only_me: faLock };
const PRIVACY_LABELS = { public: "Public", followers: "Followers", only_me: "Only me" };

export default function PostDetails({
  body,
  image,
  name,
  username,
  photo,
  date,
  id,
  userId,
  onCommentCreated,
  likes = [],
  likesCount: initialLikesCount = 0,
  commentsCount: initialCommentsCount = 0,
  sharesCount = 0,
  topComment = null,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  isShare = false,
  sharedPost = null,
  privacy = "public",
  comments,
  commentsLimit = 1,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const postsContext = useContext(PostsContext);
  const deletePost = postsContext?.deletePost;
  const { user } = useContext(AuthContext);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount || likes?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [topCommentState, setTopCommentState] = useState(topComment);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [fullComments, setFullComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likersList, setLikersList] = useState([]);
  const [likersPage, setLikersPage] = useState(1);
  const [likersHasMore, setLikersHasMore] = useState(false);
  const [likersLoading, setLikersLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount || likes?.length || 0);
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsLiked, initialLikesCount, likes, initialIsBookmarked]);

  useEffect(() => {
    if (Array.isArray(comments) && comments.length > 0) {
      const first = comments[0];
      if (typeof first === "object" && first?.commentCreator) {
        setFullComments(comments);
        setCommentsCount(comments.length);
        setCommentsExpanded(true);
      }
    }
  }, [comments]);

  async function expandComments() {
    if (commentsExpanded) { setCommentsExpanded(false); return; }
    if (fullComments.length > 0) { setCommentsExpanded(true); return; }
    try {
      setLoadingComments(true);
      setCommentsExpanded(true);
      const response = await getPostComments(id);
      if (response.success === true || response.message === "success") {
        const fetched = response.data?.comments || response.comments || [];
        setFullComments(fetched);
        setCommentsCount(fetched.length);
      }
    } catch (err) {
      toast.error("Could not load comments");
    } finally {
      setLoadingComments(false);
    }
  }

  const handleLike = async () => {
    try {
      const response = await toggleLikePost(id);
      if (response.success === true || response.message === "success") {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await toggleBookmarkPost(id);
      if (response.success === true || response.message === "success") {
        setIsBookmarked(!isBookmarked);
        toast.success(isBookmarked ? "Bookmark removed" : "Post saved");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark post");
    }
  };

  const handleShare = () => { setShareMessage(""); setShowShareModal(true); };

  const openLikesModal = async () => {
    if (likesCount === 0) return;
    setShowLikesModal(true);
    if (likersList.length > 0) return;
    try {
      setLikersLoading(true);
      const response = await getPostLikes(id, 1, 20);
      if (response.success || response.message === "success") {
        const items = response.data?.likes || [];
        setLikersList(items);
        const { total } = response.meta?.pagination || {};
        setLikersPage(1);
        setLikersHasMore(items.length < (total || 0));
      }
    } catch (err) {
      toast.error("Could not load likes");
    } finally {
      setLikersLoading(false);
    }
  };

  const loadMoreLikers = async () => {
    try {
      setLikersLoading(true);
      const nextPage = likersPage + 1;
      const response = await getPostLikes(id, nextPage, 20);
      if (response.success || response.message === "success") {
        const items = response.data?.likes || [];
        setLikersList((prev) => [...prev, ...items]);
        setLikersPage(nextPage);
        const { total } = response.meta?.pagination || {};
        setLikersHasMore(likersList.length + items.length < (total || 0));
      }
    } catch (err) {
      toast.error("Could not load more");
    } finally {
      setLikersLoading(false);
    }
  };

  const handleShareSubmit = async () => {
    try {
      setShareLoading(true);
      const response = await sharePost(id, shareMessage);
      if (response.success === true || response.message === "success") {
        toast.success("Post shared!");
        setShowShareModal(false);
        setShareMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to share post");
    } finally {
      setShareLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOwner = userId && user && (userId === user._id || userId === user.id);
  const privacyIcon = PRIVACY_ICONS[privacy] || faGlobe;
  const privacyLabel = PRIVACY_LABELS[privacy] || "Public";
  const displayName = username || name?.toLowerCase().replace(/\s+/g, "");

  return (
    <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 min-h-[72px]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link to={userId ? `/user/${userId}` : "#"} className="relative group/avatar shrink-0">
            <img
              src={photo || defaultAvatar}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 group-hover/avatar:ring-blue-200 transition-all"
              alt={name}
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
          </Link>
          <div>
            <Link
              to={userId ? `/user/${userId}` : "#"}
              className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
              <span className="font-medium text-gray-500">@{displayName}</span>
              <span>&middot;</span>
              <Link to={`/post/${id}`} className="hover:text-blue-500 transition-colors">{timeAgo(date)}</Link>
              <span>&middot;</span>
              <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-gray-500">
                <FontAwesomeIcon icon={privacyIcon} className="text-[9px]" />
                {privacyLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 3-dot Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50">
              <button
                onClick={() => { handleBookmark(); setIsMenuOpen(false); }}
                className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBookmarked ? "bg-yellow-100" : "bg-gray-100"}`}>
                  <FontAwesomeIcon icon={isBookmarked ? faBookmarkSolid : faBookmark} className={`text-xs ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`} />
                </span>
                {isBookmarked ? "Unsave post" : "Save post"}
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() => { navigate(`/post/${id}?edit=true`); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FontAwesomeIcon icon={faPen} className="text-xs text-blue-500" />
                    </span>
                    Edit post
                  </button>
                  <div className="my-1 mx-3 border-t border-gray-100" />
                  <button
                    onClick={() => { if (deletePost) deletePost(id); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <FontAwesomeIcon icon={faTrash} className="text-xs text-red-500" />
                    </span>
                    Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {body && (
        <div className="px-5 pb-3">
          <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-line">{body}</p>
        </div>
      )}

      {/* Shared post preview */}
      {isShare && sharedPost && (
        <div className="mx-5 mb-3 border border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="px-4 pt-3 pb-2 flex items-center gap-2.5">
            <img
              src={sharedPost.user?.photo || defaultAvatar}
              alt={sharedPost.user?.name}
              onError={(e) => { e.target.src = defaultAvatar; }}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <Link
                to={`/user/${sharedPost.user?._id}`}
                className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {sharedPost.user?.name}
              </Link>
              <div className="text-xs text-gray-400">
                @{sharedPost.user?.username || sharedPost.user?.name?.toLowerCase().replace(/\s+/g, "")}
                {" \u00B7 "}{timeAgo(sharedPost.createdAt)}
              </div>
            </div>
          </div>
          {sharedPost.body && (
            <p className="px-4 pb-2 text-sm text-gray-600 leading-relaxed">{sharedPost.body}</p>
          )}
          {sharedPost.image && (
            <Link to={`/post/${sharedPost._id}`}>
              <img src={sharedPost.image} alt="Shared post" className="w-full max-h-64 object-cover" />
            </Link>
          )}
        </div>
      )}

      {/* Own image */}
      {image && !isShare && (
        <div className="w-full">
          <img src={image} className="w-full max-h-[500px] object-cover" alt="Post content" />
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center justify-between px-5 py-2.5 text-[13px] text-gray-500">
        <button
          onClick={openLikesModal}
          className="flex items-center gap-1.5 hover:text-blue-600 transition-colors disabled:cursor-default group/likes"
          disabled={likesCount === 0}
        >
          <span className="bg-gradient-to-br from-blue-500 to-blue-600 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faThumbsUp} className="text-white text-[9px]" />
          </span>
          <span className="group-hover/likes:underline">{likesCount}</span>
        </button>
        <div className="flex items-center gap-4">
          <span>{sharesCount} shares</span>
          <button
            onClick={expandComments}
            className="hover:text-blue-600 hover:underline transition-colors"
          >
            {commentsCount} comments
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 grid grid-cols-3 text-[13px] font-semibold">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-3 transition-all ${
            isLiked
              ? "text-blue-600 bg-blue-50/50"
              : "text-gray-500 hover:bg-blue-50/50 hover:text-blue-600"
          }`}
        >
          <FontAwesomeIcon icon={isLiked ? faThumbsUp : faThumbsUpOutline} className="text-base" />
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={expandComments}
          className={`flex items-center justify-center gap-2 py-3 border-x border-gray-100 transition-all ${
            commentsExpanded
              ? "text-green-600 bg-green-50/50"
              : "text-gray-500 hover:bg-green-50/50 hover:text-green-600"
          }`}
        >
          <FontAwesomeIcon icon={faComment} className="text-base" />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 text-gray-500 hover:bg-orange-50/50 hover:text-orange-500 transition-all"
        >
          <FontAwesomeIcon icon={faShareFromSquare} className="text-base" />
          <span>Share</span>
        </button>
      </div>

      {/* Top Comment (collapsed) */}
      {!commentsExpanded && topCommentState && commentsCount > 0 && (
        <div className="border-t border-gray-100 px-5 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Top Comment</span>
              <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {commentsCount}
              </span>
            </div>
            <button
              onClick={expandComments}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              View all
            </button>
          </div>
          <div className="flex gap-2.5 items-start">
            <img
              src={topCommentState.commentCreator?.photo || defaultAvatar}
              alt={topCommentState.commentCreator?.name}
              onError={(e) => { e.target.src = defaultAvatar; }}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-gray-100"
            />
            <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] border border-gray-100">
              <span className="text-xs font-bold text-gray-900 mr-1.5">
                {topCommentState.commentCreator?.name}
              </span>
              <span className="text-[13px] text-gray-600 leading-relaxed">{topCommentState.content}</span>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Comments */}
      {commentsExpanded && (
        <div className="border-t border-gray-100">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">Comments</span>
              <span className="bg-blue-600 text-white text-[11px] font-bold rounded-full min-w-[22px] h-[22px] px-1.5 flex items-center justify-center">
                {commentsCount}
              </span>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
              Most relevant
              <FontAwesomeIcon icon={faChevronDown} className="text-[9px]" />
            </button>
          </div>

          <div className="px-5 space-y-3 pb-3">
            {loadingComments ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse flex gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                      <div className="h-3 bg-gray-100 rounded w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : fullComments.length > 0 ? (
              <>
                {fullComments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    commentCreatorName={comment.commentCreator?.name || "User"}
                    commentCreatorImg={comment.commentCreator?.photo || ""}
                    commentCreatorId={comment.commentCreator?._id || comment.commentCreator?.id || ""}
                    content={comment.content}
                    commentId={comment._id}
                    postId={id}
                    date={comment.createdAt}
                    setCommentsUpdated={(updater) => {
                      setFullComments((prev) => {
                        const next = typeof updater === "function" ? updater(prev) : updater;
                        setCommentsCount(next.length);
                        return next;
                      });
                    }}
                    likes={comment.likes || []}
                    replies={comment.replies || []}
                    repliesCount={comment.repliesCount ?? comment.replies?.length ?? 0}
                    isLiked={
                      comment.likes?.some((like) =>
                        (typeof like === "string" ? like : like._id) === (user?._id || user?.id)
                      ) || false
                    }
                  />
                ))}
                {commentsCount > fullComments.length && (
                  <Link to={`/post/${id}`} className="block text-sm font-semibold text-blue-600 hover:underline pt-1">
                    View all {commentsCount} comments
                  </Link>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
              </div>
            )}
          </div>

          <CreateComment
            postId={id}
            onCommentCreated={onCommentCreated}
            setCommentsUpdated={(updater) => {
              setFullComments((prev) => {
                const next = typeof updater === "function" ? updater(prev) : updater;
                setCommentsCount(Array.isArray(next) ? next.length : commentsCount + 1);
                if (Array.isArray(next) && next.length > 0) setTopCommentState(next[next.length - 1]);
                return Array.isArray(next) ? next : prev;
              });
            }}
          />
        </div>
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowLikesModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faThumbsUp} className="text-white text-sm" />
                </span>
                <h3 className="text-base font-bold text-white">People who reacted</h3>
              </div>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              {likersLoading && likersList.length === 0 ? (
                <div className="space-y-1 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 px-2 py-2.5">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-28" />
                        <div className="h-2.5 bg-gray-100 rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="py-1">
                  {likersList.map((person) => (
                    <li key={person._id}>
                      <Link
                        to={`/user/${person._id}`}
                        onClick={() => setShowLikesModal(false)}
                        className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={person.photo || defaultAvatar}
                          alt={person.name}
                          onError={(e) => { e.target.src = defaultAvatar; }}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{person.name}</p>
                          {person.username && (
                            <p className="text-xs text-gray-400">@{person.username}</p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {likersHasMore && (
              <div className="border-t border-gray-100 p-4">
                <button
                  onClick={loadMoreLikers}
                  disabled={likersLoading}
                  className="w-full py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  {likersLoading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faShareFromSquare} className="text-white text-sm" />
                </span>
                <h3 className="text-base font-bold text-white">Share post</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="px-6 pt-4 pb-2">
              <textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Say something about this..."
                rows={3}
                className="w-full resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="mx-6 my-3 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <div className="px-4 py-3 flex items-center gap-2.5 bg-white">
                <img src={photo || defaultAvatar} alt={name} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">@{displayName}</p>
                </div>
              </div>
              {body && <p className="px-4 py-2.5 text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100">{body}</p>}
              {image && <img src={image} alt="Post" className="w-full max-h-48 object-cover" />}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                disabled={shareLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow transition-all disabled:opacity-60"
              >
                {shareLoading ? "Sharing..." : "Share now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
