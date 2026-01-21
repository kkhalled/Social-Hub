import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";


export default function FormInput({ label, id, icon, placeholder, type,formik,existErrorMsg ,invalidPassword }) {
    
  return (
    <>
      
      
        {/* Full Name */}
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
             
              type={type}
              name={id}
              id={id}
              value={formik.values[id] }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={placeholder}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>
         { formik.errors[id] && formik.touched[id] ? <p className="text-red-500 -mt-3 text-[12px]"> * {formik.errors[id]}</p> : ""}
         {(type==="email" && existErrorMsg) ? <p className="text-red-500 -mt-3 text-[12px]"> * {existErrorMsg}</p> : ""}  
         {(type==="password" && invalidPassword) ? <p className="text-red-500 -mt-3 text-[12px]"> * {invalidPassword}</p> : ""}  
        
    
    </>
  );
}
// label , icon , palceholder
