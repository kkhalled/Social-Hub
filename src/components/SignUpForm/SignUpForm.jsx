import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import SocialBtns from "../Ui/SocialBtns/SocialBtns";
import Divider from "../Ui/Divider/Divider";
import FormInput from "../Ui/FormInput/FormInput";
import * as yup from "yup";
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
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import useSignUp from "../../hooks/useSignUp";

export default function SignUpForm() {
  const {formik , existErrorMsg ,formInputs ,setExistErrorMsg} = useSignUp();
  return (
    <>
      <div className=" bg-white shadow-lg rounded-2xl min-w-6/10 m-auto px-4   py-8  text-sm ">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Crete Account</h1>
          <span>
            Already have an account ?{" "}
            <Link className="text-blue-600" to={"/login"}>
              {" "}
              sign in
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
              existErrorMsg={existErrorMsg}
            />
          ))}

          <div className="flex gap-4 text-[12px] mb-5">
            <div className="calendar w-1/2 ">
              <label htmlFor="dateOfBirth" className=" text-gray-600">
                Date Of Birth
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-100  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.dateOfBirth && formik.touched.dateOfBirth ? (
                <p className="text-red-500"> * {formik.errors.dateOfBirth}</p>
              ) : (
                ""
              )}
            </div>

            <div className="gender w-1/2 text-[12px]">
              <label htmlFor="gender" className=" text-gray-600">
                Gender
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faVenusMars}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  name="gender"
                  id="gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                  className="w-full pl-11 pr-4 py-2 rounded-lg bg-gray-100  border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                >
                  <option value="">select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {formik.errors.gender && formik.touched.gender ? (
                <p className="text-red-500"> * {formik.errors.gender}</p>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* submiting button  */}

          {formik.isSubmitting ? (
            <button
              className=" space-x-1 w-full py-3 rounded-xl -mt-2 bg-blue-500 text-white "
              type="submit"
            >
              <span className="text-[16px]">Creating Account</span>
              <FontAwesomeIcon icon={faSpinner} spin />
            </button>
          ) : (
            <button
              className=" btn space-x-1 w-full py-3 rounded-xl -mt-2  disabled:cursor-no-drop bg-linear-to-r from-blue-500 to-blue-400 disabled:from-gray-500 disabled:to-gray-400  text-white "
              disabled={!(formik.isValid && formik.dirty)}
              type="submit"
            >
              <span className="text-[16px]">Create Account</span>
              <FontAwesomeIcon icon={faRightLong} />
            </button>
          )}
        </form>
      </div>
    </>
  );
}
