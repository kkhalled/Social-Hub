import axiosInstance from './axiosInstance';

// Get post comments
export const getPostComments = async (postId, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
  return data;
};

// Create comment
export const createComment = async (postId, content) => {
  const { data } = await axiosInstance.post(`/posts/${postId}/comments`, { content });
  return data;
};

// Update comment
export const updateComment = async (postId, commentId, content) => {
  const { data } = await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content });
  return data;
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  const { data } = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  return data;
};

// Like/Unlike comment (toggle)
export const toggleLikeComment = async (postId, commentId) => {
  const { data } = await axiosInstance.put(`/posts/${postId}/comments/${commentId}/like`);
  return data;
};

// Get comment replies
export const getCommentReplies = async (postId, commentId, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`);
  return data;
};

// Create reply
export const createReply = async (postId, commentId, content) => {
  const { data } = await axiosInstance.post(`/posts/${postId}/comments/${commentId}/replies`, { content });
  return data;
};
