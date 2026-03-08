import React, { useState, useContext, useEffect } from "react";
import defaultAvatar from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faHeart as faHeartSolid, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { toggleLikeComment, createReply, getCommentReplies } from "../../api/commentsApi";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CommentCard({
  commentCreatorName,
  commentCreatorImg,
  commentCreatorId,
  content,
  date,
  commentId,
  postId,
  onUpdate,
  setCommentsUpdated,
  comments,
  likes = [],
  replies = [],
  repliesCount: initialRepliesCount,
  isLiked: initialIsLiked = false,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { token, user } = useContext(AuthContext);
  const [updatedContent, setUpdatedContent] = useState(content);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(likes?.length || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [repliesState, setRepliesState] = useState(replies || []);
  const [showReplies, setShowReplies] = useState(replies && replies.length > 0);
  const [repliesCount, setRepliesCount] = useState(initialRepliesCount ?? replies?.length ?? 0);
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(likes?.length || 0);
    setRepliesState(replies || []);
    const count = initialRepliesCount ?? replies?.length ?? 0;
    setRepliesCount(count);
    // Show replies if they exist in the data
    if (replies && replies.length > 0) {
      setShowReplies(true);
    }
  }, [initialIsLiked, likes, replies, initialRepliesCount]);

  const validationSchema = Yup.object({
    content: Yup.string()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment is too long")
      .required("Comment cannot be empty"),
  });

  async function handleSubmit(values) {
    try {
      const { data } = await axiosInstance.put(
        `/posts/${postId}/comments/${commentId}`,
        { content: values.content }
      );
      if (data.success === true || data.message === "success") {
        setUpdatedContent(values.content);
        setIsEditMode(false);
        toast.success(data.message || "Comment updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment");
    }
  }

  function handleCancel() {
    formik.resetForm();
    setIsEditMode(false);
  }

  const formik = useFormik({
    initialValues: { content: updatedContent },
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  async function deleteComment() {
    try {
      const { data } = await axiosInstance.delete(
        `/posts/${postId}/comments/${commentId}`
      );
      if (data.success === true || data.message === "success") {
        toast.success(data.message || "Comment deleted");
        setCommentsUpdated(prev =>
          prev.filter(comment => comment._id !== commentId)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  }

  const handleLike = async () => {
    try {
      const response = await toggleLikeComment(postId, commentId);
      if (response.success === true || response.message === "success") {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like comment");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      const response = await createReply(postId, commentId, replyContent);
      if (response.success === true || response.message === "success") {
        toast.success(response.message || "Reply added");
        setReplyContent("");
        setShowReplyForm(false);
        loadReplies();
        setRepliesCount(prev => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply");
    }
  };

  const loadReplies = async () => {
    // If already showing, hide
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    
    // If we already have replies in state, just show them
    if (repliesState.length > 0) {
      setShowReplies(true);
      return;
    }
    
    // Fetch from API
    if (loadingReplies) return;
    try {
      setLoadingReplies(true);
      const response = await getCommentReplies(postId, commentId);
      if (response.success === true || response.message === "success") {
        const repliesData = response.data?.replies || response.replies || [];
        setRepliesState(repliesData);
        setRepliesCount(repliesData.length);
        setShowReplies(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  const isOwner = commentCreatorId && user && (commentCreatorId === user._id || commentCreatorId === user.id);
  const avatarSrc = commentCreatorImg && !commentCreatorImg.includes("undefined") ? commentCreatorImg : defaultAvatar;

  return (
    <>
      <div className="flex gap-2.5 group/comment">
        {/* Avatar */}
        <img
          src={avatarSrc}
          alt={commentCreatorName}
          onError={(e) => { e.target.src = defaultAvatar; }}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 shrink-0 mt-0.5"
        />

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          {/* Edit mode */}
          {isEditMode ? (
            <form onSubmit={formik.handleSubmit} className="space-y-2">
              <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
                <textarea
                  name="content"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-800 resize-none outline-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <span className="text-[10px] text-gray-400">Press Esc to cancel</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              {formik.errors.content && formik.touched.content && (
                <p className="text-xs text-red-500 px-1">{formik.errors.content}</p>
              )}
            </form>
          ) : (
            <>
              {/* Bubble */}
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-2.5 border border-gray-100 inline-block max-w-full">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-bold text-gray-900 text-[13px]">
                    {commentCreatorName}
                  </span>
                </div>
                <p className="text-gray-700 text-[13px] leading-relaxed">
                  {updatedContent}
                </p>
              </div>

              {/* Meta actions */}
              <div className="flex items-center gap-3.5 text-[11px] px-1 mt-1.5">
                <span className="text-gray-500 font-medium">
                  {timeAgo(date)}
                </span>

                <button
                  onClick={handleLike}
                  className={`font-semibold transition-all ${
                    isLiked
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  Like ({likesCount})
                </button>

                {repliesCount > 0 ? (
                  <button
                    onClick={loadReplies}
                    disabled={loadingReplies}
                    className="text-gray-500 hover:text-blue-600 font-semibold transition-colors disabled:opacity-50"
                  >
                    {loadingReplies ? "Loading..." : showReplies ? `Hide replies (${repliesCount})` : `Reply (${repliesCount})`}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-gray-500 hover:text-blue-600 font-semibold transition-colors"
                  >
                    Reply
                  </button>
                )}

                {isOwner && (
                  <>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="text-gray-400 hover:text-blue-600 font-semibold transition-colors opacity-0 group-hover/comment:opacity-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={deleteComment}
                      className="text-gray-400 hover:text-red-500 font-semibold transition-colors opacity-0 group-hover/comment:opacity-100"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-2.5 pl-1">
              <div className="flex items-center gap-2">
                <img
                  src={user?.photo || defaultAvatar}
                  alt="You"
                  onError={(e) => { e.target.src = defaultAvatar; }}
                  className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                />
                <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full overflow-hidden focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3.5 py-2 text-xs outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowReplyForm(false);
                        setReplyContent("");
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!replyContent.trim()}
                    className="px-3 py-2 text-blue-600 hover:text-blue-700 disabled:text-gray-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowReplyForm(false); setReplyContent(""); }}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                </button>
              </div>
            </form>
          )}

          {/* Replies List */}
          {showReplies && repliesState.length > 0 && (
            <div className="mt-3 space-y-2.5">
              <div className="pl-3 border-l-2 border-blue-100 space-y-2.5">
                {repliesState.map((reply) => {
                  const replyAvatar = reply.commentCreator?.photo && !reply.commentCreator.photo.includes("undefined")
                    ? reply.commentCreator.photo
                    : defaultAvatar;
                  return (
                    <div key={reply._id} className="flex gap-2">
                      <img
                        src={replyAvatar}
                        alt={reply.commentCreator?.name || "User"}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 border border-gray-100">
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-bold text-gray-900 text-[11px]">
                              {reply.commentCreator?.name || "User"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {timeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-[12px] leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Add reply button when viewing replies */}
              {!showReplyForm && (
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="text-gray-500 hover:text-blue-600 font-semibold text-[11px] pl-3 transition-colors"
                >
                  Add a reply...
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
