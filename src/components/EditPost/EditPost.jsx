import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "./../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { PostsContext } from "../../context/PostProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function EditPost({ post, userPhoto, userName }) {
  const { token } = useContext(AuthContext);
  const postsContext = useContext(PostsContext);
  const getAllPosts = postsContext?.getAllPosts;
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    body: Yup.string()
      .min(5, "Post is too short")
      .max(280, "Post is too long")
      .required("Post cannot be empty"),
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "Image is too large", (value) => {
        if (!value) return true; // Image is optional
        return value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // Image is optional
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  const [imagePreview, setImagePreview] = useState(post?.image || null);
  const [isNewImage, setIsNewImage] = useState(false);

  async function handleSubmit(values) {
    const formData = new FormData();

    try {
      formData.append("body", values.body);
      if (isNewImage && values.image) {
        formData.append("image", values.image);
      }
      const options = {
        url: `/posts/${post._id || post.id}`,
        method: "PUT",
        data: formData,
      };
      const response = await axiosInstance(options);
      console.log("Post updated successfully:", response.data);
      if (response.data.message === "success") {
        toast.success("Post updated successfully");
        if (getAllPosts) {
          getAllPosts();
        }
        // Navigate back to post view
        navigate(`/`);
      }
    } catch (error) {
      console.log("Error updating post:", error);
      toast.error("Failed to update post");
    }
  }

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
    setIsNewImage(false);
  };

  const formik = useFormik({
    initialValues: {
      body: post?.body || "",
      image: null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  // Update image preview when post image changes
  useEffect(() => {
    if (post?.image && !isNewImage) {
      setImagePreview(post.image);
    }
  }, [post?.image, isNewImage]);

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-6 px-4 sm:px-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
        {/* Header */}
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="px-5 py-4 flex gap-3">
            <img
              src={userPhoto || post?.user?.photo || "/default-avatar.png"}
              alt={userName || post?.user?.name}
              onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.body}
                name="body"
                rows={4}
                placeholder={`What's on your mind?`}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl
              focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
              resize-none outline-none text-sm "
              />

              {/* Image preview - show existing image or new preview */}
              {imagePreview && !formik.errors.image && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-72 object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage }
                    className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full
                  flex items-center justify-center hover:bg-black transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              )}

              {/* Textbox */}
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-5 py-5 border-t border-gray-300/20 bg-gray-50">
            <div className=" flex items-center justify-between">
              {/* Left actions */}
              <div className="flex items-center gap-2">
                {/* Add photo */}
                <label className="cursor-pointer">
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    name="image"
                    id="image"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        formik.setFieldValue("image", file);
                        setImagePreview(URL.createObjectURL(file));
                        setIsNewImage(true);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.errors.image}
                  />

                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200
              bg-white hover:border-blue-200 hover:bg-blue-50 transition text-sm"
                  >
                    <FontAwesomeIcon icon={faImage} className="text-blue-500" />
                    <span className="text-gray-700">Photo</span>
                  </div>
                </label>
              </div>

              {/* Update button */}
              <button
                type="submit"
                disabled={!formik.values.body.trim()}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white
            transition ${
              formik.values.body.trim()
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
              >
                <span>Update</span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
            <span className="text-red-500 text-sm lowercase">
              {formik.errors.body}
            </span>
            <span className="text-red-500 text-sm">{formik.errors.image}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
