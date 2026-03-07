import React, { useState, useContext } from "react";
import user from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { toggleLikeComment, createReply, getCommentReplies } from "../../api/commentsApi";

export default function CommentCard({
  commentCreatorName,
  commentCreatorImg,
  content,
  date,
  commentId,
  postId,
  onUpdate,
  setCommentsUpdated,
  comments,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { token } = useContext(AuthContext);
  const [updatedContent, setUpdatedContent] = useState(content);
  
  // Like and reply state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesCount, setRepliesCount] = useState(0);

  const validationSchema = Yup.object({
    content: Yup.string()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment is too long")
      .required("Comment cannot be empty"),
  });

  async function handleSubmit(values) {
    try {
      const options = {
        url: `/posts/${postId}/comments/${commentId}`,
        method: "PUT",
        data: {
          content: values.content,
        },
      };
      const { data } = await axiosInstance(options);
      console.log("Comment updated successfully:", data);
      if (data.message === "success") {
        setUpdatedContent(data.comment.content);
        toast.success("Comment updated successfully");

        if (onUpdate) {
          onUpdate(values.content);
        }
        setIsEditMode(false);
      }
    } catch (error) {
      console.log("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  }

  const formik = useFormik({
    initialValues: {
      content: content,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditMode(false);
  };

  // delete
  async function deleteComment() {
    try {
      const { data } = await axiosInstance.delete(
        `/posts/${postId}/comments/${commentId}`
      );

      if (data.message === "success") {
        toast.success("Comment deleted");

        setCommentsUpdated(prev =>
          prev.filter(comment => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log("failed delete comment", error);
      toast.error("failed delete comment");
    }
  }

  // Handle like toggle
  const handleLike = async () => {
    try {
      const response = await toggleLikeComment(postId, commentId);
      if (response.message === "success") {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like comment");
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await createReply(postId, commentId, replyContent);
      if (response.message === "success") {
        toast.success("Reply added");
        setReplyContent("");
        setShowReplyForm(false);
        // Refresh replies
        loadReplies();
        setRepliesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  // Load replies
  const loadReplies = async () => {
    try {
      const response = await getCommentReplies(postId, commentId);
      if (response.replies) {
        setReplies(response.replies);
        setShowReplies(true);
      }
    } catch (error) {
      console.error("Error loading replies:", error);
    }
  };


  return (
    <>
      <div className="flex gap-2.5">
        {/* Avatar */}
        <img
          src={
            commentCreatorImg.includes("undefined") ? user : commentCreatorImg
          }
          alt="User avatar"
          className="size-8 rounded-full object-cover shadow-sm shrink"
        />

        {/* Comment content */}
        <div className="flex-1 space-y-1.5">
          {/* Bubble */}
          <div className="bg-white rounded-2xl rounded-tl-sm ps-4 pe-14 py-2.5 shadow-sm border border-gray-100 inline-block max-w-full">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-gray-900 text-[15px]">
                {commentCreatorName}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 text-[14px] leading-relaxed">
              {updatedContent}
            </p>
          </div>

          {/* Meta actions */}
          <div className="flex items-center gap-4 text-xs px-2">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 font-medium transition-colors hover:underline ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeart} />
              {isLiked ? 'Liked' : 'Like'}
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors hover:underline"
            >
              Reply
            </button>

            <button
              onClick={() => setIsEditMode(true)}
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors hover:underline"
            >
              Edit
            </button>
            <button
              onClick={deleteComment}
              className="text-gray-500 hover:text-red-600 font-medium transition-colors hover:underline"
            >
              Delete
            </button>
            
            {likesCount > 0 && (
              <>
                <span className="text-gray-400">·</span>
                <span className="text-gray-400">
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
              </>
            )}

            {repliesCount > 0 && (
              <>
                <span className="text-gray-400">·</span>
                <button 
                  onClick={showReplies ? () => setShowReplies(false) : loadReplies}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {showReplies ? 'Hide' : 'View'} {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                </button>
              </>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-2 px-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Replies List */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
              {replies.map((reply) => (
                <div key={reply._id} className="flex gap-2">
                  <img
                    src={reply.commentCreator?.photo?.includes("undefined") ? user : reply.commentCreator?.photo || user}
                    alt="Reply avatar"
                    className="size-6 rounded-full object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-xs">
                          {reply.commentCreator?.name || 'User'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* edit */}
      {isEditMode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 p-4 "
          onClick={handleCancel}
        >
          <div
            className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Edit Comment</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xl" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    commentCreatorImg.includes("undefined")
                      ? user
                      : commentCreatorImg
                  }
                  alt="User avatar"
                  className="size-10 rounded-full object-cover shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {commentCreatorName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Textarea */}
              <form onSubmit={formik.handleSubmit}>
                <textarea
                  value={formik.values.content}
                  name="content"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.content}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none min-h-32 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Edit your comment..."
                />

                {/* Error Message */}
                {formik.touched.content && formik.errors.content && (
                  <p className="text-red-500 text-sm mt-2">
                    {formik.errors.content}
                  </p>
                )}

                {/* Character Count */}
                <div className="text-xs text-gray-500 text-right mt-2">
                  {formik.values.content.length} / 500 characters
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={formik.isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // disabled={formik.isSubmitting || !formik.values.content.trim() || (formik.values.content === content && !formik.errors.content)}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {formik.isSubmitting ? (
                      <>
                        <span className="inline-block animate-spin mr-2">
                          ⟳
                        </span>
                        Saving...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
