import React, { useContext, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostProvider";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/user.png";

export default function CreateComment({ postId, setCommentsUpdated, onCommentCreated }) {
  const { user } = useContext(AuthContext);
  const postsContext = useContext(PostsContext);
  const updatePostComments = postsContext?.updatePostComments;

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!content.trim() && !imageFile) return;
    try {
      setSubmitting(true);
      let data;
      if (imageFile) {
        const formData = new FormData();
        formData.append("content", content || "");
        formData.append("image", imageFile);
        const res = await axiosInstance.post(`/posts/${postId}/comments`, formData);
        data = res.data;
      } else {
        const res = await axiosInstance.post(`/posts/${postId}/comments`, { content });
        data = res.data;
      }
      if (data.success === true || data.message === "success") {
        const newComment = data.data?.comment || data.comment;
        const allComments = data.data?.comments || data.comments;
        if (allComments) {
          setCommentsUpdated(allComments);
        } else if (newComment) {
          setCommentsUpdated((prev) => [...(Array.isArray(prev) ? prev : []), newComment]);
        }
        setContent("");
        removeImage();
        if (updatePostComments && newComment) updatePostComments(postId, newComment);
        if (onCommentCreated && newComment) onCommentCreated(newComment);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = (content.trim().length > 0 || imageFile) && !submitting;

  return (
    <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="flex gap-3 items-start">
        {/* Avatar */}
        <img
          src={user?.photo || defaultAvatar}
          alt={user?.name || "User"}
          onError={(e) => { e.target.src = defaultAvatar; }}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-2 ring-gray-100"
        />

        {/* Input bubble */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl focus-within:border-blue-400 focus-within:shadow-sm transition-all overflow-hidden">
          {/* Image preview */}
          {imagePreview && (
            <div className="px-4 pt-3">
              <div className="relative inline-block group/preview">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-auto rounded-xl object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-sm opacity-0 group-hover/preview:opacity-100"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-[9px]" />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && canSubmit) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Comment as ${user?.name || "user"}...`}
            rows={1}
            className="w-full px-4 py-3 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-2.5">
            <label className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors group/photo">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover/photo:bg-emerald-50 flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faImage} className="text-sm text-gray-400 group-hover/photo:text-emerald-600 transition-colors" />
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-300 font-medium">Enter to send</span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  canSubmit
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow hover:scale-105"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} className="text-[11px]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
