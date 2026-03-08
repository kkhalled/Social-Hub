import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostProvider";
import { usePostForm } from "../../hooks/usePostForm";
import ImageUploader from "../shared/ImageUploader";
import defaultAvatar from "../../assets/user.png";

/**
 * EditPost Component
 * Form for editing an existing post
 */
export default function EditPost({ post, userPhoto, userName }) {
  const { user } = useContext(AuthContext);
  const postsContext = useContext(PostsContext);
  const getAllPosts = postsContext?.getAllPosts;
  const navigate = useNavigate();

  // Use custom hook for form management
  const { formik, imagePreview, handleImageChange, removeImage } = usePostForm({
    initialValues: {
      body: post?.body || "",
      imagePreview: post?.image || null,
    },
    mode: 'edit',
    postId: post?._id || post?.id,
    onSuccess: () => {
      if (getAllPosts) getAllPosts();
      // Navigate back to post view (remove edit mode)
      navigate(`/post/${post?._id || post?.id}`);
    },
  });

  // Update image preview when post changes
  useEffect(() => {
    if (post?.image && !imagePreview) {
      // Set initial image from post
    }
  }, [post?.image, imagePreview]);

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-6 px-4 sm:px-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
        <form onSubmit={formik.handleSubmit}>
          {/* Header */}
          <div className="px-5 py-4 flex gap-3">
            <img
              src={userPhoto || post?.user?.photo || defaultAvatar}
              alt={userName || post?.user?.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="body"
                rows={4}
                placeholder={`What's on your mind?`}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none outline-none text-sm"
              />

              {/* Image Preview */}
              <ImageUploader
                imagePreview={imagePreview || (post?.image)}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                error={formik.errors.image}
                showButton={false}
              />
            </div>
          </div>

          {/* Errors */}
          {formik.errors.body && formik.touched.body && (
            <div className="px-5 pb-2">
              <p className="text-red-500 text-xs">{formik.errors.body}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="px-5 py-5 border-t border-gray-300/20 bg-gray-50">
            <div className="flex items-center justify-between">
              {/* Image Upload Button */}
              <ImageUploader
                imagePreview={null}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                buttonText="Photo"
                buttonClassName=""
              />

              {/* Update Button */}
              <button
                type="submit"
                disabled={!formik.values.body.trim() || formik.isSubmitting}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white transition ${
                  formik.values.body.trim() && !formik.isSubmitting
                    ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Update</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
