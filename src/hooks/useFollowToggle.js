import { useState } from "react";
import { toggleFollowUser } from "../api/usersApi";
import { toast } from "react-toastify";

/**
 * Custom hook to handle follow/unfollow logic
 * @param {string} userId - The ID of the user to follow/unfollow
 * @param {boolean} isFollowing - Current following state
 * @param {function} setIsFollowing - Function to update following state
 * @param {function} updateFollowerCount - Function to update follower count
 * @returns {object} - Follow toggle handler and loading state
 */
export default function useFollowToggle(userId, isFollowing, setIsFollowing, updateFollowerCount) {
  const [followLoading, setFollowLoading] = useState(false);

  async function handleFollowToggle() {
    try {
      setFollowLoading(true);
      const response = await toggleFollowUser(userId);
      if (response.message === "success" || response.success === true) {
        const nowFollowing = !isFollowing;
        setIsFollowing(nowFollowing);
        toast.success(nowFollowing ? "Following!" : "Unfollowed");
        updateFollowerCount(nowFollowing ? 1 : -1);
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  }

  return { handleFollowToggle, followLoading };
}
