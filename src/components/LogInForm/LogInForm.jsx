import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import SocialBtns from "../Ui/SocialBtns/SocialBtns";
import Divider from "../Ui/Divider/Divider";
import FormInput from "../Ui/FormInput/FormInput";

import {
  faCalendar,
  faEnvelope,
  faLeftLong,
  faLock,
  faRightLong,
  faSpinner,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useLogIn from "../../hooks/useLogIn";


export default function LogInForm() {
  const {formik , formInputs ,invalidPassword } = useLogIn();
  return (
    <>
      <div className=" bg-white shadow-lg rounded-2xl min-w-6/10 m-auto px-4   py-8  text-sm ">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <span>
           Don't have an account ?{" "}
            <Link className="text-blue-600" to={"/signup"}>
              {" "}
              Sign Up
            </Link>
          </span>
          <SocialBtns />
        </header>

        <Divider />

        <form
          className="space-y-3 max-w-sm mx-auto"
          onSubmit={formik.handleSubmit}
        >
          {formInputs.map((input, i) => (
            <FormInput
              key={i}
              label={input.label}
              id={input.id}
              type={input.type}
              icon={input.icon}
              placeholder={input.placeholder}
              formik={formik}
              invalidPassword={invalidPassword}
              
            />
          ))}


          {/* submiting button  */}

          {formik.isSubmitting ? (
            <button
              className=" space-x-1 w-full py-4  rounded-xl mt-2 bg-blue-500 text-white "
              type="submit"
            >
              <span className="text-[16px]">Log In</span>
              <FontAwesomeIcon icon={faSpinner} spin />
            </button>
          ) : (
            <button
              className=" btn space-x-1 w-full py-3 rounded-xl mt-2  disabled:cursor-no-drop bg-linear-to-r from-blue-500 to-blue-400 disabled:from-gray-500 disabled:to-gray-400  text-white "
              disabled={!(formik.isValid && formik.dirty)}
              type="submit"
            >
              <span className="text-[16px]">Log In</span>
              <FontAwesomeIcon icon={faRightLong} />
            </button>
          )}
        </form>
      </div>
    </>
  );
}
