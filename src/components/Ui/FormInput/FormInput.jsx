import { faCalendar, faUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";


export default function FormInput({ label, id, icon, placeholder, type,formik,existErrorMsg ,invalidPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <>
      
      
        {/* Form Input */}
        <div className="space-y-1 text-[12px]">
          <label htmlFor={id} className=" text-gray-600">
            {label}
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={icon}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
             
              type={inputType}
              name={id}
              id={id}
              value={formik.values[id] }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={placeholder}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            )}
          </div>
        </div>
         { formik.errors[id] && formik.touched[id] ? <p className="text-red-500 -mt-3 text-[12px]"> * {formik.errors[id]}</p> : ""}
         {(id==="username" && existErrorMsg && existErrorMsg.toLowerCase().includes("username")) ? <p className="text-red-500 -mt-3 text-[12px]"> * {existErrorMsg}</p> : ""}  
         {(type==="email" && existErrorMsg && existErrorMsg.toLowerCase().includes("email")) ? <p className="text-red-500 -mt-3 text-[12px]"> * {existErrorMsg}</p> : ""}  
         {(type==="password" && invalidPassword) ? <p className="text-red-500 -mt-3 text-[12px]"> * {invalidPassword}</p> : ""}  
        
    
    </>
  );
}
// label , icon , palceholder
