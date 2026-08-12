import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import useAccounts from "../../hooks/useAccounts";
import JobseekerForm from "./JobseekerForm";
import EmployerForm from "./EmployerForm";
import { nepalLocations } from "../../appstore/nepalLocations";

const SignupForm = () => {
  const { register, loading } = useAccounts();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      // Common
      username: "",
      email: "",
      password: "",
      role: "js",
      location: "",

      // Jobseeker
      phone: "",
      date_of_birth: "",
      resume_file: null,
      profile_pictur: null,

      // Employer
      company_description: "",
      website: "",
      logo: null,
    },

    validationSchema: Yup.object({

      // USERNAME / COMPANY NAME

      username: Yup.string()
        .required("This field is required")
        .min(3, "Must be at least 3 characters"),


      // EMAIL

      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),


      // PASSWORD

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),


      // ROLE

      role: Yup.string()
        .oneOf(["js", "ep"], "Invalid role")
        .required("Role is required"),


      // LOCATION

      location: Yup.string()
        .required("Location is required"),


      // JOBSEEKER PHONE

      phone: Yup.string().when("role", {
        is: "js",
        then: (schema) =>
          schema.required("Phone number is required"),
        otherwise: (schema) =>
          schema.notRequired(),
      }),


      // JOBSEEKER DATE OF BIRTH

      date_of_birth: Yup.date()
        .nullable()
        .when("role", {
          is: "js",
          then: (schema) =>
            schema
              .max(
                new Date(
                  new Date().setFullYear(
                    new Date().getFullYear() - 18
                  )
                ),
                "You must be at least 18 years old"
              )
              .required("Date of birth is required"),

          otherwise: (schema) =>
            schema.notRequired(),
        }),


      // EMPLOYER WEBSITE

      website: Yup.string().when("role", {
        is: "ep",
        then: (schema) =>
          schema
            .url("Enter a valid website URL")
            .nullable(),

        otherwise: (schema) =>
          schema.notRequired(),
      }),

      company_description:Yup.string().max(450, "Must be at with in 450 characters"),
    }),


    // SUBMIT

    onSubmit: async (values) => {
      console.log("FORM SUBMITTED");
      console.log(values);

      try {
        await register(values);

        console.log("Registration successful");

        navigate("/login");
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  });


  // ROLE CHANGE


  const handleRoleChange = (newRole) => {
    if (newRole === "js") {
      formik.setValues({
        ...formik.values,

        role: "js",

        // Clear employer fields
        company_description: "",
        website: "",
        logo: null,
      });

      formik.setTouched({
        ...formik.touched,

        website: false,
      });
    }

    if (newRole === "ep") {
      formik.setValues({
        ...formik.values,

        role: "ep",

        // Clear jobseeker fields
        phone: "",
        date_of_birth: "",
        resume_file: null,
        profile_pictur: null,
      });

      formik.setTouched({
        ...formik.touched,

        phone: false,
        date_of_birth: false,
      });
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>

      {/* =========================
          ROLE
      ========================= */}

      <div className="flex justify-center mb-3">
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

      {/* =========================
          USERNAME / COMPANY NAME
      ========================= */}

      <div className="mb-2">

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

        {formik.touched.username &&
          formik.errors.username && (
            <p className="text-red-700">
              {formik.errors.username}
            </p>
          )}

      </div>

      {/* =========================
          EMAIL
      ========================= */}

      <div className="mb-2">

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

        {formik.touched.email &&
          formik.errors.email && (
            <p className="text-red-700">
              {formik.errors.email}
            </p>
          )}

      </div>

      {/* =========================
          PASSWORD
      ========================= */}

      <div className="mb-2">

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"

          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}

          className="border rounded p-2 w-full"
        />

        {formik.touched.password &&
          formik.errors.password && (
            <p className="text-red-700">
              {formik.errors.password}
            </p>
          )}

      </div>

      {/* =========================
          LOCATION
      ========================= */}

      <div className="mb-2">

        <select
          id="location"
          name="location"

          value={formik.values.location}

          onChange={formik.handleChange}
          onBlur={formik.handleBlur}

          className="border rounded p-2 w-full bg-white"
        >

          <option value="" disabled>
            {formik.values.role === "ep"
              ? "Select your Company Location"
              : "Select your Location"}
          </option>

          {nepalLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}

        </select>

        {formik.touched.location &&
          formik.errors.location && (
            <p className="text-red-700">
              {formik.errors.location}
            </p>
          )}

      </div>

      {/* =========================
          JOBSEEKER FORM
      ========================= */}

      {formik.values.role === "js" && (
        <JobseekerForm formik={formik} />
      )}

      {/* =========================
          EMPLOYER FORM
      ========================= */}

      {formik.values.role === "ep" && (
        <EmployerForm formik={formik} />
      )}

      {/* =========================
          SUBMIT
      ========================= */}

      <div className="flex flex-col">

        <button
          type="submit"
          disabled={loading}

          className="bg-green-600 text-white px-6 py-3 rounded-3xl hover:-translate-y-1 transition disabled:opacity-50"
        >
          {loading
            ? "Creating account..."
            : "Register"}
        </button>

      </div>

    </form>
  );
};

export default SignupForm;