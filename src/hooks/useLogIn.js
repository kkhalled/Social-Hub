
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';

export default function useLogIn(){

  const {token, setToken, setUser} = useContext(AuthContext);

    const [invalidPassword, setinvalidPassword] = useState(null);
  const navgiate = useNavigate();
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

  const signUpSchema = yup.object({

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
      const options = {
        url: "/users/signin",
        method: "POST",
        data: values,
      };

      let { data } = await axiosInstance.request(options);

      if (data.message === "success") {

        console.log(data);
        localStorage.setItem("token", data.token);
        setToken(data.token);
        
        // Store user data if available in the response
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          // If user data not in signin response, fetch it
          try {
            const profileResponse = await axiosInstance.get("/users/profile-data");
            if (profileResponse.data.message === "success") {
              localStorage.setItem("user", JSON.stringify(profileResponse.data.user));
              setUser(profileResponse.data.user);
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
          }
        }
        
        toast.success("Welcome Back");
        setTimeout(() => {
          navgiate("/");
        }, 500);
      }
    } catch (error) {
      setinvalidPassword(error.response?.data?.error || "Login failed. Please check your credentials.");
      console.log(error);
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    }
  }

  const formik = useFormik({
    initialValues: {
    
      email: "",
      password: "",
  
    },

    validationSchema: signUpSchema,

    onSubmit: handleSubmit,
  });
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
