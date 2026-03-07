import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faSmile,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import hero from "../../assets/hero.jpg";
import defaultAvatar from "../../assets/user.png";
import { AuthContext } from "./../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";

// import { usePosts } from "../../hooks/usePosts";

import { PostsContext } from "../../context/PostProvider";
import { Link } from "react-router";

export default function CreatePost({ userName, userPhoto }) {

  



  const { token  } = useContext(AuthContext);
  const {user} = useContext(AuthContext);


  const { getAllPosts } = useContext(PostsContext);

  const validationSchema = Yup.object({
    body: Yup.string()
      .min(5, "Post is too short")
      .max(280, "Post is too long")
      .required("Post cannot be empty"),
    image: Yup.mixed()
      .nullable()
      .test("fileSize", "Image is too large (max 5MB)", (value) => {
        // Image is optional
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // Image is optional
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  async function handleSubmit(values) {
    const formData = new FormData();

    try {
      formData.append("body", values.body);
      if (values.image) {
        formData.append("image", values.image);
      }
      const options = {
        url: "/posts",
        method: "POST",
        data: formData,
      };
      const response = await axiosInstance(options);
      console.log("Post created successfully:", response.data);
      if (response.data.message === "success") {
        formik.resetForm();
        getAllPosts();
        setImagePreview(null);
      }
    } catch (error) {
      console.log("Error creating post:", error);
    }
  }

  // Revoke the data uri to avoid memory leaks
  const [imagePreview, setImagePreview] = useState(null);

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
  };

  const formik = useFormik({
    initialValues: {
      body: "",
      image: null,
    },

    validationSchema: validationSchema,

    onSubmit: handleSubmit,
  });

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-6 px-4 sm:px-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
        {/* Header */}
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="px-5 py-4 flex gap-3">
            <Link to={"/profile"}>
            <img
              src={user?.photo || defaultAvatar}
              alt={userName}
              className="w-11 h-11 rounded-full object-cover cursor-pointer"
              
            />
            </Link>
            <div className="flex-1">
              <textarea
                // element="textarea"
                value={formik.values.body}
                // touched={formik.touched.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.body}
                name="body"
                rows={4}
                placeholder={`What's on your mind, ${user?.name}?`}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl
              focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
              resize-none outline-none text-sm "
              />

              {/* Image preview */}
              {imagePreview && !formik.errors.image && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-72 object-cover"
                  />

                  <button
                    onClick={removeImage}
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
                      formik.setFieldValue("image", file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.errors.image}
                    // touched={formik.touched.image}
                  />

                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200
              bg-white hover:border-blue-200 hover:b transition text-sm"
                  >
                    <FontAwesomeIcon icon={faImage} className="text-blue-500" />
                    <span className="text-gray-700">Photo</span>
                  </div>
                </label>
              </div>

              {/* Post button */}
              <button
                type="submit"
                disabled={!formik.values.body.trim() && !formik.values.image}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white
            transition ${
              formik.values.body.trim() || formik.values.image
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
              >
                <span>Post</span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {formik.errors.body && (
                <span className="text-red-500 text-sm block">
                  {formik.errors.body}
                </span>
              )}
              {formik.errors.image && (
                <span className="text-red-500 text-sm block">
                  {formik.errors.image}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
