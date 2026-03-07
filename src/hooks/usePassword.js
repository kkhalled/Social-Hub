
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
export default function usePassword({setShowPasswordModal}) {

    let {token, setToken } =useContext(AuthContext);
  
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const passwordSchema = yup.object({
    password: yup
      .string()
      .required("password is required")
      .matches(
        passwordRegex,
        "password should be Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character",
      ),

    newPassword: yup
      .string()
      .required("password is required")
      .matches(
        passwordRegex,
        "password should be Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character",
      ),

    
  });

  async function handleSubmit(values) {
    try {
      // PATCH to /users/change-password
      const { data } = await axiosInstance.patch("/users/change-password", values);
      console.log(data);
      

      if (data.message === "success") {
        // Update token if new one is returned (new API returns refreshed token)
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        }
        toast.success("Password changed successfully!");
        setShowPasswordModal(false)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to change password. Please try again.";
      console.error("Password change error:", error);
      toast.error(errorMsg);
    }
  }

  const formik = useFormik({
    initialValues: {
      
      password: "",
      newPassword:"",
     
      
    },

    validationSchema: passwordSchema,

    onSubmit: handleSubmit,
  });
  return {formik}
}
