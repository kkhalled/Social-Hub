import axiosInstance from './axiosInstance';

// Get all posts with pagination
export const getAllPosts = async (page = 1, limit = 50) => {
  const { data } = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
  return data;
};

// Get home feed (posts from followed users)
export const getHomeFeed = async (onlyFollowing = false, page = 1, limit = 10, cursor = null) => {
  let url = `/posts/feed?page=${page}&limit=${limit}`;
  if (onlyFollowing) {
    url += '&only=following';
  }
  if (cursor) {
    url += `&cursor=${cursor}`;
  }
  const { data } = await axiosInstance.get(url);
  return data;
};

// Get single post
export const getPost = async (postId) => {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
  return data;
};

// Create post
export const createPost = async (formData) => {
  const { data } = await axiosInstance.post('/posts', formData);
  return data;
};

// Update post
export const updatePost = async (postId, formData) => {
  const { data } = await axiosInstance.put(`/posts/${postId}`, formData);
  return data;
};

// Delete post
export const deletePost = async (postId) => {
  const { data } = await axiosInstance.delete(`/posts/${postId}`);
  return data;
};

// Like/Unlike post (toggle)
export const toggleLikePost = async (postId) => {
  const { data } = await axiosInstance.put(`/posts/${postId}/like`);
  return data;
};

// Get post likes
export const getPostLikes = async (postId, page = 1, limit = 20) => {
  const { data } = await axiosInstance.get(`/posts/${postId}/likes?page=${page}&limit=${limit}`);
  return data;
};

// Bookmark/Unbookmark post (toggle)
export const toggleBookmarkPost = async (postId) => {
  const { data } = await axiosInstance.put(`/posts/${postId}/bookmark`);
  return data;
};

// Share post
export const sharePost = async (postId) => {
  const { data } = await axiosInstance.post(`/posts/${postId}/share`);
  return data;
};

// Get user posts
export const getUserPosts = async (userId, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/users/${userId}/posts?page=${page}&limit=${limit}`);
  return data;
};
