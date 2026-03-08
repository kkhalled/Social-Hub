import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

/**
 * Custom hook for managing post form (create/edit)
 * Handles validation, image upload, and API submission
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.initialValues - Initial form values
 * @param {Function} options.onSuccess - Callback on successful submission
 * @param {string} options.mode - 'create' or 'edit'
 * @param {string} options.postId - Post ID (for edit mode)
 * @returns {Object} Form state and handlers
 */
export function usePostForm({ initialValues = {}, onSuccess, mode = 'create', postId = null }) {
  const [imagePreview, setImagePreview] = useState(initialValues.imagePreview || null);
  const [isNewImage, setIsNewImage] = useState(false);

  const validationSchema = Yup.object({
    body: Yup.string()
      .min(5, "Post is too short")
      .max(280, "Post is too long")
      .required("Post cannot be empty"),
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "Image is too large (max 5MB)", (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("body", values.body);

    try {
      if (mode === 'create') {
        // Create new post
        if (values.image) {
          formData.append("image", values.image);
        }
        const response = await axiosInstance.post("/posts", formData);
        
        if (response.data.success === true || response.data.message === "success") {
          toast.success("Post created successfully");
          formik.resetForm();
          setImagePreview(null);
          setIsNewImage(false);
          if (onSuccess) onSuccess();
        }
      } else {
        // Edit existing post
        if (isNewImage && values.image) {
          formData.append("image", values.image);
        }
        const response = await axiosInstance.put(`/posts/${postId}`, formData);
        
        if (response.data.message === "success") {
          toast.success("Post updated successfully");
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} post:`, error);
      toast.error(`Failed to ${mode === 'create' ? 'create' : 'update'} post`);
    }
  };

  const formik = useFormik({
    initialValues: {
      body: initialValues.body || "",
      image: null,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handleSubmit,
  });

  /**
   * Handle image selection
   */
  const handleImageChange = (file) => {
    if (file) {
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
      setIsNewImage(true);
    }
  };

  /**
   * Remove selected image
   */
  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
    setIsNewImage(false);
  };

  return {
    formik,
    imagePreview,
    isNewImage,
    handleImageChange,
    removeImage,
  };
}
