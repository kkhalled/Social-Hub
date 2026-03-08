import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyProfile, getUserBookmarks } from "../api/usersApi";
import { getUserPosts } from "../api/postsApi";

/**
 * Custom hook for fetching profile data, posts, and bookmarks
 * @returns {Object} Profile data and loading states
 */
export function useProfileData() {
  const { user, token, setUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getMyProfile();
        if (response.success === true || response.message === "success") {
          const userData = response.data?.user || response.user;
          setProfileData(userData);
          if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    async function fetchSaved() {
      try {
        setLoadingSaved(true);
        const response = await getUserBookmarks(1, 50);
        if (response.message === "success" || response.success === true) {
          setSavedPosts(response.data?.bookmarks || response.bookmarks || []);
        }
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      } finally {
        setLoadingSaved(false);
      }
    }

    if (token) {
      fetchProfile();
      fetchSaved();
    }
  }, [token]);

  // Fetch user posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const userId = user?._id || user?.id;
        if (!userId) return;
        const response = await getUserPosts(userId, 1, 50);
        if (response.message === "success") {
          setUserPosts(response.data?.posts || []);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    }
    if (user) fetchPosts();
  }, [user?._id]);

  return {
    profileData,
    userPosts,
    savedPosts,
    loadingProfile,
    loadingPosts,
    loadingSaved,
    setProfileData,
  };
}
