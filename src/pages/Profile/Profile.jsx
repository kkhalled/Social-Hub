import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faArrowLeft,
  faKey,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faXmark,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/user.png";
import usePassword from "../../hooks/usePassword";

export default function Profile() {
  const { user, token, setUser } = useContext(AuthContext);

  

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {formik} = usePassword({setShowPasswordModal});

  if (!user) return null;


  // ==============================
  // Update profile photo (JSON body)
  // ==============================
  async function updatePhoto(file) {
    const MAX_SIZE = 4 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      console.error("Image exceeds 4MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const { data } = await axiosInstance.put(
        "/users/upload-photo",
        formData
      );
      console.log(data);

      if (data.message === "success") {
        // setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Upload photo error:", error);
    }
  }


  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border overflow-hidden mb-6">
          <div className="h-40 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600" />

          <div className="px-8 pb-8 -mt-20">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const previewUrl = URL.createObjectURL(file);
                  setImagePreview(previewUrl);

                  updatePhoto(file); // ✅ File مباشرة
                }}
              />

              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview || user.photo || defaultAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faCamera}
                      className="text-white text-2xl mb-1"
                    />
                    <p className="text-white text-xs font-medium">
                      Change Photo
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Active
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Personal Information
              </h3>
              <div className="divide-y divide-gray-200">
                <InfoRow label="Full Name" value={user.name} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value="+1 (555) 123-4567" />
                <InfoRow label="Gender" value={user.gender} />
                <InfoRow label="Birth" value={user.dateOfBirth} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Security Settings
          </h2>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faKey}
                  className="text-red-600 text-xl"
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 mb-1">
                  Change Password
                </h3>
                <p className="text-sm text-gray-600">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          {" "}
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {" "}
            {/* Modal Header */}{" "}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  {" "}
                  <FontAwesomeIcon icon={faKey} className="text-red-600" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h2 className="text-xl font-bold text-gray-900">
                    {" "}
                    Change Password{" "}
                  </h2>{" "}
                  <p className="text-sm text-gray-500">
                    {" "}
                    Create a strong, secure password{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
              >
                {" "}
                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-gray-500 text-xl"
                />{" "}
              </button>{" "}
            </div>{" "}
            {/* Modal Body */}{" "}
            <form
              onSubmit={formik.handleSubmit}
          
            >
              <div className="p-6 space-y-5">
                {" "}
                <PasswordField
                  label="Current Password"
                  placeholder="Enter current password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  show={showCurrentPassword}
                  onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                />{" "}
                <PasswordField
                  label="New Password"
                  placeholder="Enter new password"
                  name="newPassword"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword(!showNewPassword)}
                />{" "}
               
                {/* Password Requirements */}{" "}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                  {" "}
                  <p className="text-sm text-blue-900 font-bold mb-3 flex items-center gap-2">
                    {" "}
                    <FontAwesomeIcon icon={faShieldHalved} /> Password
                    Requirements{" "}
                  </p>{" "}
                  <ul className="space-y-2">
                    {" "}
                    <RequirementItem text="At least 8 characters long" />{" "}
                    <RequirementItem text="Contains uppercase and lowercase letters" />{" "}
                    <RequirementItem text="Contains at least one number" />{" "}
                    <RequirementItem text="Contains at least one special character" />{" "}
                  </ul>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                {" "}
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-200 font-semibold transition"
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition active:scale-95 shadow-lg">
                  
                  Update Password{" "}
                </button>
              </div>
            </form>
            {/* Modal Footer */}{" "}
          </div>
        </div>
      )}
    </div>
  );
}
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  show,
  onToggle,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <FontAwesomeIcon
          icon={faLock}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          name={name}          
          value={value}        
          onChange={onChange}  
          className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-gray-200
                     focus:ring-2 focus:ring-blue-100 focus:border-blue-500
                     text-sm outline-none transition"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
  );
}


function RequirementItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm text-blue-800">
      <span className="text-green-600 mt-0.5">✓</span>
      <span>{text}</span>
    </li>
  );
}
