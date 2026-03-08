import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { toggleLikeComment } from "../../api/commentsApi";

/**
 * LikeButton Component
 * Handles the like/unlike functionality for comments
 */
export default function LikeButton({ 
  postId, 
  commentId, 
  initialIsLiked = false, 
  initialLikesCount = 0 
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  // Sync with props
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  const handleLike = async () => {
    try {
      const response = await toggleLikeComment(postId, commentId);
      
      if (response.success === true || response.message === "success") {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like comment");
    }
  };

  return (
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
  );
}
