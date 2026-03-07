
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config/api';

export default function useLogIn(){

  const {token, setToken, setUser} = useContext(AuthContext);

    const [invalidPassword, setinvalidPassword] = useState(null);
  const navgiate = useNavigate();
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const signInSchema = yup.object({

    email: yup
      .string()
      .email(" email is invalid ")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "email must include domain like .com"
      )
      .required("email is required"),

    password: yup
      .string()
      .required("password is required")
      .matches(
        passwordRegex,
        "password should be Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),

   
  });

  async function handleSubmit(values) {
    try {
      const { data } = await axios.post(`${BASE_URL}/users/signin`, values);

      if (data.success === true) {
        console.log(data);
        
        // Store token and user from response.data
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
          setUser(data.data.user);
        }
        
        toast.success(data.message || "Welcome Back");
        setTimeout(() => {
          navgiate("/");
        }, 500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Login failed. Please check your credentials.";
      setinvalidPassword(errorMsg);
      console.error(error);
      toast.error(errorMsg);
    }
  }

  const formik = useFormik({
    initialValues: {
    
      email: "",
      password: "",
  
    },

    validationSchema : signInSchema,

    onSubmit: handleSubmit,
  });

  // Clear server error when user starts typing
  React.useEffect(() => {
    if ((formik.values.email || formik.values.password) && invalidPassword) {
      setinvalidPassword(null);
    }
  }, [formik.values.email, formik.values.password]);
  // console.log(formik);

  //  label , icon , palceholder ,name -value - id
  const formInputs = [
 
    {
      label: "Email Address",
      id: "email",
      type: "email",
      icon: faEnvelope,
      placeholder: "name@example.com",
    },
    {
      label: "Password",
      id: "password",
      type: "password",
      icon: faLock,
      placeholder: "enter your password",
    },
  
  ];

  return {formik ,formInputs , invalidPassword }
}
