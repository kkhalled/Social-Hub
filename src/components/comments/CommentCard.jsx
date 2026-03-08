import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/user.png";
import { AuthContext } from "../../context/AuthContext";
import { updateComment, deleteComment } from "../../api/commentsApi";
import { useCommentReplies } from "../../hooks/useCommentReplies";
import CommentActions from "./CommentActions";
import ReplyForm from "./ReplyForm";
import RepliesList from "./RepliesList";

/**
 * CommentCard Component
 * Main component for displaying and managing a single comment
 * 
 * Responsibilities:
 * - Display comment content and metadata
 * - Handle edit/delete operations
 * - Orchestrate child components (actions, replies, forms)
 */
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
  const [updatedContent, setUpdatedContent] = useState(content);
  const { user } = useContext(AuthContext);

  // Use custom hook for reply management
  const {
    repliesState,
    showReplies,
    repliesCount,
    loadingReplies,
    showReplyForm,
    replyContent,
    loadReplies,
    handleReplySubmit,
    setShowReplyForm,
    setReplyContent,
    cancelReply,
  } = useCommentReplies(postId, commentId, replies, initialRepliesCount);

  // Form validation schema
  const validationSchema = Yup.object({
    content: Yup.string()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment is too long")
      .required("Comment cannot be empty"),
  });

  // Handle comment update
  const handleSubmit = async (values) => {
    try {
      const data = await updateComment(postId, commentId, values.content);
      
      if (data.success === true || data.message === "success") {
        setUpdatedContent(values.content);
        setIsEditMode(false);
        toast.success(data.message || "Comment updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment");
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    formik.resetForm();
    setIsEditMode(false);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: { content: updatedContent },
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  // Handle comment deletion
  const handleDelete = async () => {
    try {
      const data = await deleteComment(postId, commentId);
      
      if (data.success === true || data.message === "success") {
        toast.success(data.message || "Comment deleted");
        setCommentsUpdated((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  // Toggle reply form
  const handleToggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  // Determine ownership and avatar
  const isOwner =
    commentCreatorId &&
    user &&
    (commentCreatorId === user._id || commentCreatorId === user.id);
  const avatarSrc =
    commentCreatorImg && !commentCreatorImg.includes("undefined")
      ? commentCreatorImg
      : defaultAvatar;

  return (
    <div className="flex gap-2.5 group/comment">
      {/* Avatar */}
      <img
        src={avatarSrc}
        alt={commentCreatorName}
        onError={(e) => {
          e.target.src = defaultAvatar;
        }}
        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 shrink-0 mt-0.5"
      />

      {/* Comment content */}
      <div className="flex-1 min-w-0">
        {/* Edit Mode */}
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
                <span className="text-[10px] text-gray-400">
                  Press Esc to cancel
                </span>
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
              <p className="text-xs text-red-500 px-1">
                {formik.errors.content}
              </p>
            )}
          </form>
        ) : (
          <>
            {/* Comment Bubble */}
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

            {/* Actions */}
            <CommentActions
              date={date}
              postId={postId}
              commentId={commentId}
              isLiked={initialIsLiked}
              likesCount={likes?.length || 0}
              repliesCount={repliesCount}
              showReplies={showReplies}
              loadingReplies={loadingReplies}
              isOwner={isOwner}
              onLoadReplies={loadReplies}
              onToggleReplyForm={handleToggleReplyForm}
              onEdit={() => setIsEditMode(true)}
              onDelete={handleDelete}
            />
          </>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <ReplyForm
            userPhoto={user?.photo}
            replyContent={replyContent}
            onReplyChange={setReplyContent}
            onSubmit={handleReplySubmit}
            onCancel={cancelReply}
          />
        )}

        {/* Replies List */}
        {showReplies && (
          <RepliesList
            replies={repliesState}
            onAddReply={!showReplyForm ? () => setShowReplyForm(true) : null}
          />
        )}
      </div>
    </div>
  );
}
