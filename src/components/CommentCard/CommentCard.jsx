import React, { useState, useContext } from "react";
import user from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

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
            <button className="text-gray-500 hover:text-blue-600 font-medium transition-colors hover:underline">
              Like
            </button>

            <button
              onClick={() => setIsEditMode(true)}
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors hover:underline"
            >
              Edit
            </button>
            <button
              onClick={deleteComment}
              className="text-gray-500 hover:text-blue-600 font-medium transition-colors hover:underline"
            >
              delete
            </button>
            <span className="text-gray-400">·</span>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              0 likes
            </button>
          </div>
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
