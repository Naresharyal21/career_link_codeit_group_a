
import React, { useContext, useState } from "react";



import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EmployerForm from "./EmployerForm";
import JobseekerForm from "./JobseekerForm";


import { FiEye, FiEyeOff } from "react-icons/fi";


import useAccounts from "../../hooks/useAccounts";
import { signupValidationSchema } from "./validationSchema";
import Button from "../commonuiPart/Button";
import LocationSelect from "../commonuiPart/LocationSelect";
import accountsApi from "../../apis/accountsApi";
import { AuthenticationContext } from "../../context/AuthContext";


const SignupForm = () => {
  const { register, loading } = useAccounts();
  const navigate = useNavigate();
  const location = useLocation();
  const auth0Onboarding = location.state?.auth0Onboarding;
  const { loginUser, logoutUser, setUser } = useContext(AuthenticationContext);

  const formik = useFormik({
    initialValues: {
      username: auth0Onboarding?.username || "",
      company_name: "",
      email: auth0Onboarding?.email || "",
      password: "",
      confirmpassword: "",

      role: auth0Onboarding?.role || "js",

      location: "",
      phone: "",
      date_of_birth: "",
      resume_file: null,
      profile_pictur: null,
      company_description: "",
      website: "",
      logo: null,
    },

    validationSchema: auth0Onboarding
      ? signupValidationSchema.omit(["password", "confirmpassword"])
      : signupValidationSchema,

    onSubmit: async (values) => {
      try {
        if (auth0Onboarding) {
          const {
            password: _password,
            confirmpassword: _confirmPassword,
            ...profile
          } = values;
          const response = await accountsApi.completeAuth0Onboarding({
            ...profile,
            id_token: auth0Onboarding.idToken,
          });

          loginUser(response.access, response.refresh);
          const user = await accountsApi.getMe();
          setUser(user);
          sessionStorage.removeItem("careerlink_auth0_role");
          sessionStorage.removeItem("careerlink_auth0_return_path");
          navigate("/dashboard", { replace: true, state: null });
          return;
        }

        // 1. Register user first
        await register(values);
        // 2. Save email only after successful registration
        localStorage.setItem("signupemail", values.email);

        // 3. Go to OTP verification
        navigate("/verifyotp/emv");

      } catch (err) {
        if (auth0Onboarding) logoutUser();
        toast.error(err.message || "Registration failed. Please try again.");
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const handletoggle = () => {
    setShowPassword((visible) => !visible);
  };

  const handleRoleChange = (newRole) => {
    formik.setFieldValue("role", newRole);
    formik.setTouched({});
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* ROLE TOGGLE BUTTONS */}
      {!auth0Onboarding && (
        <div className="mb-8 flex justify-center">
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => handleRoleChange("js")}
              aria-pressed={formik.values.role === "js"}
              variant={formik.values.role === "js" ? "secondary" : "gray"}
              className="w-full px-3 py-3 text-sm transition"
            >
              Jobseeker
            </Button>
            <Button
              type="button"
              onClick={() => handleRoleChange("ep")}
              aria-pressed={formik.values.role === "ep"}
              variant={formik.values.role === "ep" ? "secondary" : "gray"}
              className="w-full px-3 py-3 text-sm transition"
            >
              Employer
            </Button>
          </div>
        </div>
      )}

      {/* USERNAME / COMPANY NAME & EMAIL */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="mb-4 w-full">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="name"
            aria-label={formik.values.role === "ep" ? "Company name" : "Full name"}
            placeholder={
              formik.values.role === "ep"
                ? "Enter your Company Name"
                : "Enter your Full Name"
            }
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />
          {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {formik.errors.username}
              </p>
            )}
        </div>

        <div className="mb-4 w-full">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="Email address"
            placeholder={
              formik.values.role === "ep"
                ? "Enter your Company Email"
                : "Enter your Email"
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={Boolean(auth0Onboarding)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-xs text-red-600" role="alert">{formik.errors.email}</p>
          )}
        </div>
      </div>

      {/* PASSWORD */}
      {!auth0Onboarding && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative mb-4 w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-label="Password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
            <button
              type="button"
              onClick={handletoggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 text-slate-500 transition hover:text-violet-700"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-600" role="alert">{formik.errors.password}</p>
            )}
          </div>
          <div className="relative mb-4 w-full">
            <input
              id="confirmpassword"
              name="confirmpassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-label="Confirm password"
              placeholder="Re-enter password"
              value={formik.values.confirmpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
            <button
              type="button"
              onClick={handletoggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 text-slate-500 transition hover:text-violet-700"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
            {formik.touched.confirmpassword && formik.errors.confirmpassword && (
              <p className="mt-1 text-xs text-red-600" role="alert">{formik.errors.confirmpassword}</p>
            )}
          </div>
        </div>
      )}

      {/* LOCATION */}
      <div className="mb-4 ">
        <LocationSelect
          id="location"
          ariaLabel={formik.values.role === "ep" ? "Company location" : "Location"}
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          placeholder={
            formik.values.role === "ep"
              ? "Select your Company Location"
              : "Select your Location"
          }
        />
        {formik.touched.location && formik.errors.location && (
          <p className="mt-1 text-xs text-red-600" role="alert">{formik.errors.location}</p>
        )}
      </div>

      {/* SUB-FORMS */}
      {formik.values.role === "js" && <JobseekerForm formik={formik} />}
      {formik.values.role === "ep" && <EmployerForm formik={formik} />}

      {/* SUBMIT */}
      <div className="flex flex-col">
        <Button
          type="submit"
          disabled={loading || formik.isSubmitting}
          variant="secondary"
          className="w-full rounded-xl px-6 py-3 transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {formik.isSubmitting
            ? "Creating account..."
            : auth0Onboarding
              ? "Complete account"
              : loading
                ? "Creating account..."
                : "Register"}
        </Button>
        <Link
          className="mt-4 text-center text-sm font-medium text-slate-600 transition hover:text-violet-700"
          to="/login"
        >
          Already have an account? <span className="font-semibold text-violet-700">Sign in</span>
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
