import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getPostComments } from "../api/commentsApi";

/**
 * Custom hook for managing post comments
 * Handles comment fetching, expansion, and state
 * 
 * @param {string} postId - The post ID
 * @param {Array} initialComments - Initial comments from props
 * @param {number} initialCommentsCount - Initial comments count
 * @param {Object} topComment - Top comment to display when collapsed
 * @returns {Object} Comments state and handlers
 */
export function usePostComments(
  postId,
  initialComments = [],
  initialCommentsCount = 0,
  topComment = null
) {
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [topCommentState, setTopCommentState] = useState(topComment);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [fullComments, setFullComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Sync with initial comments prop
  useEffect(() => {
    if (Array.isArray(initialComments) && initialComments.length > 0) {
      const first = initialComments[0];
      
      // Check if we have full comment objects
      if (typeof first === "object" && first?.commentCreator) {
        setFullComments(initialComments);
        setCommentsCount(initialComments.length);
        setCommentsExpanded(true);
      }
    }
  }, [initialComments]);

  /**
   * Toggle comments expansion - fetches if needed
   */
  const expandComments = async () => {
    // If already expanded, collapse
    if (commentsExpanded) {
      setCommentsExpanded(false);
      return;
    }
    
    // If we already have comments, just expand
    if (fullComments.length > 0) {
      setCommentsExpanded(true);
      return;
    }
    
    // Fetch from API
    try {
      setLoadingComments(true);
      setCommentsExpanded(true);
      const response = await getPostComments(postId);
      
      if (response.success === true || response.message === "success") {
        const fetched = response.data?.comments || response.comments || [];
        setFullComments(fetched);
        setCommentsCount(fetched.length);
      }
    } catch (err) {
      toast.error("Could not load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  /**
   * Update comments list (used by CreateComment and CommentCard)
   */
  const updateComments = (updater) => {
    setFullComments((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setCommentsCount(Array.isArray(next) ? next.length : commentsCount + 1);
      
      // Update top comment if we have comments
      if (Array.isArray(next) && next.length > 0) {
        setTopCommentState(next[next.length - 1]);
      }
      
      return Array.isArray(next) ? next : prev;
    });
  };

  return {
    // State
    commentsCount,
    topCommentState,
    commentsExpanded,
    fullComments,
    loadingComments,
    
    // Actions
    expandComments,
    updateComments,
    setFullComments,
    setCommentsCount,
  };
}
