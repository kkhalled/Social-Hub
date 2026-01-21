
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
export default function usePassword({setShowPasswordModal}) {

    let {token } =useContext(AuthContext);
  
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
      const options = {
        url: "https://linked-posts.routemisr.com/users/change-password",
        method: "PATCH",
        data: values,
        headers:{token}
      };

      let { data } = await axios.request(options);
      console.log(data);
      

      if (data.message === "success") {
        toast.success("Password Changed");
        setShowPasswordModal(false)
      }
    } catch (error) {
      console.log(error.response);
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
