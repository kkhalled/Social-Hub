import React, { useContext, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faXmark,
  faGlobe,
  faChevronDown,
  faLock,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/user.png";
import { AuthContext } from "./../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { PostsContext } from "../../context/PostProvider";
import { Link } from "react-router";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: faGlobe },
  { value: "followers", label: "Followers", icon: faUserGroup },
  { value: "only_me", label: "Only me", icon: faLock },
];

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const { getAllPosts } = useContext(PostsContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const visibilityRef = useRef(null);

  const currentVisibility = VISIBILITY_OPTIONS.find((v) => v.value === visibility);

  useEffect(() => {
    function handleClickOutside(e) {
      if (visibilityRef.current && !visibilityRef.current.contains(e.target)) {
        setShowVisibilityMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  async function handleSubmit(values) {
    const formData = new FormData();
    try {
      formData.append("body", values.body);
      if (values.image) {
        formData.append("image", values.image);
      }
      const response = await axiosInstance.post("/posts", formData);
      if (response.data.success === true || response.data.message === "success") {
        formik.resetForm();
        getAllPosts();
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
  };

  const formik = useFormik({
    initialValues: { body: "", image: null },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <form onSubmit={formik.handleSubmit}>
        {/* User Info */}
        <div className="px-5 pt-5 pb-2 flex items-center gap-3">
          <Link to="/profile">
            <img
              src={user?.photo || defaultAvatar}
              alt={user?.name || "User"}
              onError={(e) => { e.target.src = defaultAvatar; }}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
            />
          </Link>
          <div>
            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
            <div className="relative" ref={visibilityRef}>
              <button
                type="button"
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 px-2 py-0.5 rounded-full"
              >
                <FontAwesomeIcon icon={currentVisibility.icon} className="text-[10px]" />
                <span>{currentVisibility.label}</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-[8px]" />
              </button>

              {showVisibilityMenu && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  {VISIBILITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setVisibility(option.value);
                        setShowVisibilityMenu(false);
                      }}
                      className={`w-full px-3 py-2 flex items-center gap-2.5 text-sm transition-colors ${
                        visibility === option.value
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FontAwesomeIcon icon={option.icon} className="text-xs w-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="px-5 py-2">
          <textarea
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="body"
            rows={3}
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || ""}?`}
            className="w-full bg-transparent resize-none outline-none text-gray-800 text-[15px] placeholder:text-gray-400 leading-relaxed"
          />
        </div>

        {/* Image preview */}
        {imagePreview && !formik.errors.image && (
          <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-gray-200 relative group">
            <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        {/* Errors */}
        {(formik.errors.body || formik.errors.image) && (
          <div className="px-5 pb-2 space-y-1">
            {formik.errors.body && (
              <p className="text-red-500 text-xs">{formik.errors.body}</p>
            )}
            {formik.errors.image && (
              <p className="text-red-500 text-xs">{formik.errors.image}</p>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600">
              <input
                className="hidden"
                type="file"
                accept="image/*"
                name="image"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    formik.setFieldValue("image", file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              <FontAwesomeIcon icon={faImage} className="text-green-500" />
              <span className="hidden sm:inline font-medium">Photo</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!formik.values.body.trim() && !formik.values.image}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
              formik.values.body.trim() || formik.values.image
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            <span>Post</span>
            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
          </button>
        </div>
      </form>
    </div>
  );
}
