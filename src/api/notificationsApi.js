import axiosInstance from './axiosInstance';

// Get notifications list
export const getNotifications = async (page = 1, limit = 10, unread = false) => {
  let url = `/notifications?page=${page}&limit=${limit}`;
  if (unread) url += '&unread=true';
  const { data } = await axiosInstance.get(url);
  return data;
};

// Get unread notification count
export const getUnreadCount = async () => {
  const { data } = await axiosInstance.get('/notifications/unread-count');
  return data;
};

// Mark single notification as read
export const markAsRead = async (notificationId) => {
  const { data } = await axiosInstance.patch(`/notifications/${notificationId}/read`);
  return data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const { data } = await axiosInstance.patch('/notifications/read-all');
  return data;
};
