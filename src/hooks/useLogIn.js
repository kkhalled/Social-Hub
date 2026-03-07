
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';

export default function useLogIn(){

  const {token ,setToken} = useContext(AuthContext);

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
        localStorage.setItem("token",data.token)
        setToken(
          data.token
        )
        
        
        toast.success("Welcome Back");
        setTimeout(() => {
          navgiate("/");
        }, 500);
      }
    } catch (error) {
      setinvalidPassword(error.response.data.error);
      console.log(error);
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
