
import React, { useState } from "react";



import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";

import EmployerForm from "./EmployerForm";
import JobseekerForm from "./JobseekerForm";


import { FiEye, FiEyeOff } from "react-icons/fi";


import useAccounts from "../../hooks/useAccounts";
import { signupValidationSchema } from "./validationSchema";
import { nepallocation } from "../../appstore/nepallocation";


const SignupForm = () => {
  const { register, loading } = useAccounts();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",

      role: "js",

      location: "",
      phone: "",
      date_of_birth: "",
      resume_file: null,
      profile_pictur: null,
      company_description: "",
      website: "",
      logo: null,
    },

    validationSchema: signupValidationSchema,

   onSubmit: async (values) => {
  try {
    // 1. Register user first
    await register(values);

    // 2. Save email only after successful registration
    localStorage.setItem("signupemail", values.email);

    // 3. Go to OTP verification
    navigate("/verifyotp/emv");

  } catch (err) {
    console.error("Registration failed:", err);
  }
},
  });

  const [showPassword, setShowPassword] = useState(false);
  const handletoggle = () => {
    setShowPassword(!showPassword);
  };

  const handleRoleChange = (newRole) => {
    if (newRole === "js") {
      formik.resetForm({
        values: {
          ...formik.initialValues,
          role: "js"
        },

      });

    }

    if (newRole === "ep") {
      formik.resetForm({
        values: {
          ...formik.initialValues,
          role: "ep"
        },

      });

    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* ROLE TOGGLE BUTTONS */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleRoleChange("js")}
            className={`px-6 py-3 rounded-xl transition ${formik.values.role === "js"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            Jobseeker
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("ep")}
            className={`px-6 py-3 rounded-xl transition ${formik.values.role === "ep"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            Employer
          </button>
        </div>
      </div>

      {/* USERNAME / COMPANY NAME & EMAIL */}
      <div className="flex justify-between">
        <div className="mb-4 w-65">
          <input
            id="username"
            name="username"
            type="text"
            placeholder={
              formik.values.role === "ep"
                ? "Enter your Company Name"
                : "Enter your Full Name"
            }
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-red-700">{formik.errors.username}</p>
          )}
        </div>

        <div className="mb-4 w-65">
          <input
            id="email"
            name="email"
            type="email"
            placeholder={
              formik.values.role === "ep"
                ? "Enter your Company Email"
                : "Enter your Email"
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-700">{formik.errors.email}</p>
          )}
        </div>
      </div>

      {/* PASSWORD */}
      <div className="flex justify-between">
        <div className="mb-4 w-65">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          <button
            type="button"
            onClick={handletoggle}
            className="-ml-9 absolute mt-3 w-4 text-amber-600"
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-700">{formik.errors.password}</p>
          )}
        </div>
        {/* conform  PASSWORD */}
        <div className="mb-4 w-65 ">
          <input
            id="confirmpassword"
            name="confirmpassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />
          <button
            type="button"
            onClick={handletoggle}
            className="-ml-9 absolute mt-3 w-4 text-amber-600"
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
          {formik.touched.confirmpassword && formik.errors.confirmpassword && (
            <p className="text-red-700">{formik.errors.confirmpassword}</p>
          )}
        </div>
      </div>

      {/* LOCATION */}
      <div className="mb-4">
        <select
          id="location"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border rounded p-2 pr-5 w-full bg-white"
        >
          <option value="" disabled>
            {formik.values.role === "ep"
              ? "Select your Company Location"
              : "Select your Location"}
          </option>
          {nepallocation.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {formik.touched.location && formik.errors.location && (
          <p className="text-red-700">{formik.errors.location}</p>
        )}
      </div>

      {/* SUB-FORMS */}
      {formik.values.role === "js" && <JobseekerForm formik={formik} />}
      {formik.values.role === "ep" && <EmployerForm formik={formik} />}

      {/* SUBMIT */}
      <div className="flex flex-col">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-3xl hover:-translate-y-1 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
        <Link
          className="ml-90 mt-2 text-x text-blue-600 underline hover:text-purple-800"
          to="/login"
        >
          already have account?
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;