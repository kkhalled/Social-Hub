import React, { useContext } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostProvider";
import { usePostForm } from "../../hooks/usePostForm";
import ImageUploader from "../shared/ImageUploader";
import VisibilitySelector from "../shared/VisibilitySelector";

/**
 * CreatePost Component
 * Form for creating a new post with image upload and visibility options
 */
export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const { getAllPosts } = useContext(PostsContext);

  // Use custom hook for form management
  const { formik, imagePreview, handleImageChange, removeImage } = usePostForm({
    mode: 'create',
    onSuccess: () => {
      if (getAllPosts) getAllPosts();
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <form onSubmit={formik.handleSubmit}>
        {/* User Info with Visibility */}
        <div className="px-5 pt-5 pb-2 flex items-center gap-3">
          <Link to="/profile">
            <img
              src={user?.photo || defaultAvatar}
              alt={user?.name || "User"}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
            />
          </Link>
          <div>
            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
            <VisibilitySelector value="public" onChange={() => {}} />
          </div>
        </div>

        {/* Textarea */}
        <div className="px-5 py-2">
          <textarea
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="body"
            rows={3}
            placeholder={`What's on your mind, ${
              user?.name?.split(" ")[0] || ""
            }?`}
            className="w-full bg-transparent resize-none outline-none text-gray-800 text-[15px] placeholder:text-gray-400 leading-relaxed"
          />
        </div>

        {/* Image Preview */}
        <div className="px-5">
          <ImageUploader
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            error={formik.errors.image}
            showButton={false}
          />
        </div>

        {/* Errors */}
        {formik.errors.body && formik.touched.body && (
          <div className="px-5 pb-2">
            <p className="text-red-500 text-xs">{formik.errors.body}</p>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <ImageUploader
            imagePreview={null}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            buttonText="Photo"
            buttonClassName=""
          />

          <button
            type="submit"
            disabled={!formik.values.body.trim() || formik.isSubmitting}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
              formik.values.body.trim() && !formik.isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Post</span>
          </button>
        </div>
      </form>
    </div>
  );
}
