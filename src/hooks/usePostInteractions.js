import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { toggleLikePost, toggleBookmarkPost, sharePost } from "../api/postsApi";

/**
 * Custom hook for managing post interactions
 * Handles likes, bookmarks, and shares
 * 
 * @param {string} postId - The post ID
 * @param {boolean} initialIsLiked - Initial liked state
 * @param {number} initialLikesCount - Initial likes count
 * @param {boolean} initialIsBookmarked - Initial bookmarked state
 * @returns {Object} Interaction state and handlers
 */
export function usePostInteractions(
  postId,
  initialIsLiked = false,
  initialLikesCount = 0,
  initialIsBookmarked = false
) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  
  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  // Sync with props
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsLiked, initialLikesCount, initialIsBookmarked]);

  /**
   * Toggle like on post
   */
  const handleLike = async () => {
    try {
      const response = await toggleLikePost(postId);
      
      if (response.success === true || response.message === "success") {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  };

  /**
   * Toggle bookmark on post
   */
  const handleBookmark = async () => {
    try {
      const response = await toggleBookmarkPost(postId);
      
      if (response.success === true || response.message === "success") {
        setIsBookmarked(!isBookmarked);
        toast.success(isBookmarked ? "Bookmark removed" : "Post saved");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark post");
    }
  };

  /**
   * Open share modal
   */
  const openShareModal = () => {
    setShareMessage("");
    setShowShareModal(true);
  };

  /**
   * Close share modal
   */
  const closeShareModal = () => {
    setShowShareModal(false);
    setShareMessage("");
  };

  /**
   * Submit share
   */
  const handleShareSubmit = async () => {
    try {
      setShareLoading(true);
      const response = await sharePost(postId, shareMessage);
      
      if (response.success === true || response.message === "success") {
        toast.success("Post shared!");
        closeShareModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to share post");
    } finally {
      setShareLoading(false);
    }
  };

  return {
    // Like state
    isLiked,
    likesCount,
    handleLike,
    
    // Bookmark state
    isBookmarked,
    handleBookmark,
    
    // Share state
    showShareModal,
    shareMessage,
    shareLoading,
    setShareMessage,
    openShareModal,
    closeShareModal,
    handleShareSubmit,
  };
}
