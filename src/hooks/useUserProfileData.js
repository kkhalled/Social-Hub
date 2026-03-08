import { useState, useEffect } from "react";
import { getUserProfile } from "../api/usersApi";
import { getUserPosts } from "../api/postsApi";

/**
 * Custom hook to fetch user profile and posts data
 * @param {string} userId - The ID of the user to fetch
 * @returns {object} - Profile data, posts, loading states, and refresh function
 */
export default function useUserProfileData(userId) {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadingPosts(true);
    setUserProfile(null);
    setUserPosts([]);
    loadUserProfile();
    loadUserPosts();
  }, [userId]);

  async function loadUserProfile() {
    try {
      const response = await getUserProfile(userId);
      if (response.message === "success" || response.success === true) {
        const fetchedUser = response.data?.user || response.user;
        setUserProfile(fetchedUser);
        setIsFollowing(response.data?.isFollowing ?? false);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserPosts() {
    try {
      const response = await getUserPosts(userId, 1, 50);
      if (response.message === "success" || response.success === true) {
        setUserPosts(response.data?.posts || []);
      }
    } catch (error) {
      console.error("Error loading user posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }

  function updateFollowerCount(increment) {
    setUserProfile((prev) =>
      prev
        ? {
            ...prev,
            followersCount: (prev.followersCount ?? 0) + increment,
          }
        : prev
    );
  }

  return {
    userProfile,
    userPosts,
    loading,
    loadingPosts,
    isFollowing,
    setIsFollowing,
    updateFollowerCount,
  };
}
