import { useState } from "react";
import { toast } from "react-toastify";
import { getPostLikes } from "../api/postsApi";

/**
 * Custom hook for managing post likes modal
 * Handles fetching and displaying list of users who liked the post
 * 
 * @param {string} postId - The post ID
 * @param {number} likesCount - Current likes count
 * @returns {Object} Likes modal state and handlers
 */
export function usePostLikes(postId, likesCount) {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likersList, setLikersList] = useState([]);
  const [likersPage, setLikersPage] = useState(1);
  const [likersHasMore, setLikersHasMore] = useState(false);
  const [likersLoading, setLikersLoading] = useState(false);

  /**
   * Open likes modal and fetch initial likers
   */
  const openLikesModal = async () => {
    if (likesCount === 0) return;
    
    setShowLikesModal(true);
    
    // Don't refetch if we already have data
    if (likersList.length > 0) return;
    
    try {
      setLikersLoading(true);
      const response = await getPostLikes(postId, 1, 20);
      
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

  /**
   * Load more likers (pagination)
   */
  const loadMoreLikers = async () => {
    try {
      setLikersLoading(true);
      const nextPage = likersPage + 1;
      const response = await getPostLikes(postId, nextPage, 20);
      
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

  /**
   * Close likes modal
   */
  const closeLikesModal = () => {
    setShowLikesModal(false);
  };

  return {
    // State
    showLikesModal,
    likersList,
    likersHasMore,
    likersLoading,
    
    // Actions
    openLikesModal,
    loadMoreLikers,
    closeLikesModal,
  };
}
