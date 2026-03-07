
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
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
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/users/change-password`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(data);
      

      if (data.success === true) {
        // Update token if new one is returned (new API returns refreshed token)
        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
          setToken(data.data.token);
        }
        toast.success(data.message || "Password changed successfully!");
        setShowPasswordModal(false)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to change password. Please try again.";
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
