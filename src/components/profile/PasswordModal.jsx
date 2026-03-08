import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faXmark,
  faLock,
  faEye,
  faEyeSlash,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

/**
 * PasswordModal Component
 * Modal for changing user password
 */
export default function PasswordModal({
  show,
  onClose,
  formik,
  showCurrentPassword,
  showNewPassword,
  onToggleCurrentPassword,
  onToggleNewPassword,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faKey} className="text-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Change Password</h2>
                <p className="text-xs text-gray-400">Create a strong password</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4">
            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              show={showCurrentPassword}
              onToggle={onToggleCurrentPassword}
              error={formik.touched.password && formik.errors.password}
            />
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              name="newPassword"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              show={showNewPassword}
              onToggle={onToggleNewPassword}
              error={formik.touched.newPassword && formik.errors.newPassword}
            />

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-800 font-semibold mb-2 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                Password Requirements
              </p>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>&#10003; At least 8 characters</li>
                <li>&#10003; Uppercase and lowercase letters</li>
                <li>&#10003; At least one number</li>
                <li>&#10003; At least one special character</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition shadow-sm"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Password Field ──────────────────────────────────────────────────────── */

function PasswordField({ label, placeholder, show, onToggle, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <FontAwesomeIcon
          icon={faLock}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
        />
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
            error ? "border-red-300" : "border-gray-200"
          } focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm outline-none transition`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="text-sm" />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
