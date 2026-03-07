import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { getAllPosts as getAllPostsApi, getHomeFeed } from "../api/postsApi";

export const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [feedType, setFeedType] = useState("all"); // "all" or "following"

  async function getAllPosts(type = "all") {
    try {
      let response;
      if (type === "following") {
        response = await getHomeFeed(true, 1, 50);
      } else {
        response = await getAllPostsApi(1, 50);
      }

      if (response.success === true || response.message === "success") {
        const postsData = response.data?.posts || response.posts || [];
        setPosts([...postsData].reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
    }
  }

  async function deletePost(postId) {
    try {
      const { data } = await axiosInstance.delete(`/posts/${postId}`);

      if (data.success === true || data.message === "success") {
        setPosts(prev => prev.filter(post => post._id !== postId));
        toast.success(data.message || "Post deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  }

  // Update a specific post's comments in the feed
  function updatePostComments(postId, newComment) {
    setPosts(prev => {
      if (!prev) return prev;

      return prev.map(post =>
        post._id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          : post
      );
    });
  }

  useEffect(() => {
    if (token) getAllPosts(feedType);
  }, [token, feedType]);

  return (
    <PostsContext.Provider value={{ posts, getAllPosts, deletePost, updatePostComments, feedType, setFeedType }}>
      {children}
    </PostsContext.Provider>
  );
}
