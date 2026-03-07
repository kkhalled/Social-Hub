import axiosInstance from './axiosInstance';

// Get user profile (public)
export const getUserProfile = async (userId) => {
  const { data } = await axiosInstance.get(`/users/${userId}/profile`);
  return data;
};

// Get my profile
export const getMyProfile = async () => {
  const { data } = await axiosInstance.get('/users/profile-data');
  return data;
};

// Follow/Unfollow user (toggle)
export const toggleFollowUser = async (userId) => {
  const { data } = await axiosInstance.put(`/users/${userId}/follow`);
  return data;
};

// Get follow suggestions
export const getFollowSuggestions = async (limit = 10) => {
  const { data } = await axiosInstance.get(`/users/suggestions?limit=${limit}`);
  return data;
};

// Get user bookmarks
export const getUserBookmarks = async (page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/users/bookmarks?page=${page}&limit=${limit}`);
  return data;
};

// Upload profile photo
export const uploadProfilePhoto = async (formData) => {
  const { data } = await axiosInstance.put('/users/upload-photo', formData);
  return data;
};
