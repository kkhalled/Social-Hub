import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState(null);

  async function getAllPosts() {
    try {
      const { data } = await axiosInstance.get(
        "/posts?page=1&limit=50"
      );

      if (data.message === "success") {
        setPosts([...data.posts].reverse());
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deletePost(postId) {
    try {
      const { data } = await axiosInstance.delete(
        `/posts/${postId}`
      );

      if (data.message === "success") {
        setPosts(prev => prev.filter(post => post._id !== postId));
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
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
    if (token) getAllPosts();
  }, [token]);

  return (
    <PostsContext.Provider value={{ posts, getAllPosts, deletePost, updatePostComments }}>
      {children}
    </PostsContext.Provider>
  );
}
