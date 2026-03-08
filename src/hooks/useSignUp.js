
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { BASE_URL } from '../config/api';

export default function useSignUp(){

    const [existErrorMsg, setExistErrorMsg] = useState(null);
  const navgiate = useNavigate();
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const signUpSchema = yup.object({
    name: yup
      .string()
      .required("name is required")
      .min(3, "name must be at least 3 characters ")
      .max(20),

    username: yup
      .string()
      .required("username is required")
      .min(3, "username must be at least 3 characters")
      .max(30, "username must be at most 30 characters"),

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

    rePassword: yup
      .string()
      .required(" confirm password is required ")
      .oneOf(
        [yup.ref("password")],
        "password and confirm password should be the same "
      ),

    dateOfBirth: yup.string().required("date is required"),

    gender: yup
      .string()
      .required("gender is required")
      .oneOf(["male", "female"]),
  });

  async function handleSubmit(values) {
    setExistErrorMsg(null);
    try {
      // POST to /users/signup
      const { data } = await axios.post(`${BASE_URL}/users/signup`, values);

      if (data.success === true || data.message === "success") {
        toast.success(data.message || "Account created successfully!");
        formik.resetForm();
        setTimeout(() => {
          navgiate("/login");
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Signup failed. Please try again.";
      
      // Check if it's a username exists error
      if (errorMsg.toLowerCase().includes("username") && errorMsg.toLowerCase().includes("exist")) {
        setExistErrorMsg(errorMsg);
        toast.error(errorMsg);
      } else if (errorMsg.toLowerCase().includes("email") && errorMsg.toLowerCase().includes("exist")) {
        setExistErrorMsg(errorMsg);
        toast.error(errorMsg);
      } else {
        setExistErrorMsg(errorMsg);
        toast.error(errorMsg);
      }
      console.error("Signup error:", error);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },

    validationSchema: signUpSchema,

    onSubmit: handleSubmit,
  });

  // Clear server error when user starts typing in relevant fields
  React.useEffect(() => {
    if ((formik.values.email || formik.values.username) && existErrorMsg) {
      setExistErrorMsg(null);
    }
  }, [formik.values.email, formik.values.username]);
  // console.log(formik);

  //  label , icon , palceholder ,name -value - id
  const formInputs = [
    {
      label: "Full Name",
      id: "name",
      type: "text",
      icon: faUser,
      placeholder: "Enter Your Full Name",
    },
    {
      label: "Username",
      id: "username",
      type: "text",
      icon: faUser,
      placeholder: "Choose a username",
    },
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
      placeholder: "Create a strong password",
    },
    {
      label: "Confirm Password",
      id: "rePassword",
      type: "password",
      icon: faLock,
      placeholder: "Re-enter your password",
    },
  ];

  return {formik , existErrorMsg ,formInputs ,setExistErrorMsg}
}
