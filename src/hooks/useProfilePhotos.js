import { useState, useRef, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import {
  uploadProfilePhoto,
  uploadCoverPhoto,
  deleteProfilePhoto,
  deleteCoverPhoto,
} from "../api/usersApi";

/**
 * Custom hook for managing profile and cover photo uploads/deletions
 * @param {Function} setProfileData - Setter for profile data
 * @returns {Object} Photo management state and handlers
 */
export function useProfilePhotos(setProfileData) {
  const { user, setUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [imagePreview, coverPreview]);

  /**
   * Upload profile photo
   */
  async function updatePhoto(file) {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image exceeds 4MB limit");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const response = await uploadProfilePhoto(formData);
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user;
        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        toast.success("Profile photo updated!");
      }
    } catch {
      toast.error("Failed to upload photo");
    }
  }

  /**
   * Upload cover photo
   */
  async function updateCover(file) {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image exceeds 4MB limit");
      return;
    }
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const response = await uploadCoverPhoto(formData);
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user;
        if (updatedUser) {
          setUser(updatedUser);
          setProfileData(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        toast.success("Cover photo updated!");
      }
    } catch {
      toast.error("Failed to upload cover");
    }
  }

  /**
   * Delete profile photo
   */
  async function removePhoto(onSuccess) {
    try {
      const response = await deleteProfilePhoto();
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user || { ...user, photo: null };
        setUser(updatedUser);
        setProfileData(updatedUser);
        setImagePreview(null);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile photo removed!");
        if (onSuccess) onSuccess();
      }
    } catch {
      toast.error("Failed to remove photo");
    }
  }

  /**
   * Delete cover photo
   */
  async function removeCover(onSuccess) {
    try {
      const response = await deleteCoverPhoto();
      if (response.message === "success" || response.success === true) {
        const updatedUser = response.data?.user || response.user || { ...user, cover: null };
        setUser(updatedUser);
        setProfileData(updatedUser);
        setCoverPreview(null);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Cover photo removed!");
        if (onSuccess) onSuccess();
      }
    } catch {
      toast.error("Failed to remove cover");
    }
  }

  return {
    fileInputRef,
    coverInputRef,
    imagePreview,
    coverPreview,
    setImagePreview,
    setCoverPreview,
    updatePhoto,
    updateCover,
    removePhoto,
    removeCover,
  };
}
