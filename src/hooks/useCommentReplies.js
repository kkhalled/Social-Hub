import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCommentReplies, createReply } from "../api/commentsApi";

/**
 * Custom hook for managing comment replies
 * Handles fetching, creating, and displaying replies
 * 
 * @param {string} postId - The post ID
 * @param {string} commentId - The comment ID
 * @param {Array} initialReplies - Initial replies from props
 * @param {number} initialRepliesCount - Initial replies count
 * @returns {Object} Reply state and handlers
 */
export function useCommentReplies(postId, commentId, initialReplies = [], initialRepliesCount = 0) {
  const [repliesState, setRepliesState] = useState(initialReplies || []);
  const [showReplies, setShowReplies] = useState(initialReplies && initialReplies.length > 0);
  const [repliesCount, setRepliesCount] = useState(
    initialRepliesCount ?? initialReplies?.length ?? 0
  );
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  // Sync with props
  useEffect(() => {
    setRepliesState(initialReplies || []);
    const count = initialRepliesCount ?? initialReplies?.length ?? 0;
    setRepliesCount(count);
    
    if (initialReplies && initialReplies.length > 0) {
      setShowReplies(true);
    }
  }, [initialReplies, initialRepliesCount]);

  /**
   * Toggle replies visibility - fetches if needed
   */
  const loadReplies = async () => {
    // If already showing, hide
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    
    // If we already have replies in state, just show them
    if (repliesState.length > 0) {
      setShowReplies(true);
      return;
    }
    
    // Fetch from API
    if (loadingReplies) return;
    
    try {
      setLoadingReplies(true);
      const response = await getCommentReplies(postId, commentId);
      
      if (response.success === true || response.message === "success") {
        const repliesData = response.data?.replies || response.replies || [];
        setRepliesState(repliesData);
        setRepliesCount(repliesData.length);
        setShowReplies(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  /**
   * Submit a new reply
   */
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;
    
    try {
      const response = await createReply(postId, commentId, replyContent);
      
      if (response.success === true || response.message === "success") {
        toast.success(response.message || "Reply added");
        setReplyContent("");
        setShowReplyForm(false);
        // Reload replies to show the new one
        await loadReplies();
        setRepliesCount((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply");
    }
  };

  /**
   * Cancel reply form
   */
  const cancelReply = () => {
    setShowReplyForm(false);
    setReplyContent("");
  };

  return {
    // State
    repliesState,
    showReplies,
    repliesCount,
    loadingReplies,
    showReplyForm,
    replyContent,
    
    // Actions
    loadReplies,
    handleReplySubmit,
    setShowReplyForm,
    setReplyContent,
    cancelReply,
  };
}
