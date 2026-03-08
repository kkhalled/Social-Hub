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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 10;

  async function getAllPosts(type = "all", pageNum = 1, append = false) {
    try {
      if (append) setLoadingMore(true);
      
      let response;
      if (type === "following") {
        response = await getHomeFeed(true, pageNum, LIMIT);
      } else {
        response = await getAllPostsApi(pageNum, LIMIT);
      }

      if (response.success === true || response.message === "success") {
        const postsData = response.data?.posts || response.posts || [];
        const paginationInfo = response.data?.paginationInfo || response.paginationInfo;
        
        if (append) {
          setPosts(prev => [...(prev || []), ...postsData]);
        } else {
          setPosts(postsData);
        }
        
        // Check if more pages available
        if (paginationInfo) {
          setHasMore(paginationInfo.currentPage < paginationInfo.numberOfPages);
        } else {
          setHasMore(postsData.length >= LIMIT);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
    } finally {
      setLoadingMore(false);
    }
  }

  function loadMore() {
    if (!loadingMore && hasMore) {
      getAllPosts(feedType, page + 1, true);
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
    if (token) {
      setPage(1);
      setHasMore(true);
      setPosts(null);
      getAllPosts(feedType, 1, false);
    }
  }, [token, feedType]);

  return (
    <PostsContext.Provider value={{ posts, getAllPosts, deletePost, updatePostComments, feedType, setFeedType, loadMore, hasMore, loadingMore }}>
      {children}
    </PostsContext.Provider>
  );
}
