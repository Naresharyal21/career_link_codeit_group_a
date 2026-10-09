import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { passwordRule, passwordconfirmRule } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { resetPassword, loading } = useAccounts();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },

    validationSchema: Yup.object({
      password: passwordRule,
      confirmpassword: passwordconfirmRule,
    }),

    onSubmit: async (values) => {
      try {
        const email = localStorage.getItem("resetemail");
        if (!email) {
          toast.error("Your password reset session expired. Request a new OTP.");
          navigate("/forgetpassword", { replace: true });
          return;
        }

        await resetPassword(email, values.password);

        localStorage.removeItem("resetemail");
        localStorage.removeItem("otpResendCooldown_prv");
        localStorage.removeItem("forgotPasswordResendTime");

        toast.success("Password reset successfully. Please sign in.");
        navigate("/login");

      } catch (error) {
        toast.error(error.message || "Unable to reset your password.");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

        <h1 className="text-2xl font-bold mb-2">
          Reset Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your new password.
        </p>

        <form onSubmit={formik.handleSubmit}>

          {/* PASSWORD */}
          <div className="mb-4">

            <input
              id="password"
              name="password"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-xl p-3 w-full"
            />

            {formik.touched.password &&
              formik.errors.password && (
                <p className="text-red-700">
                  {formik.errors.password}
                </p>
              )}

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-4">

            <input
              id="confirmpassword"
              name="confirmpassword"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formik.values.confirmpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-xl p-3 w-full"
            />

            {formik.touched.confirmpassword &&
              formik.errors.confirmpassword && (
                <p className="text-red-700">
                  {formik.errors.confirmpassword}
                </p>
              )}

          </div>

          {/* SHOW PASSWORD */}
          <div className="mb-4">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() =>
                  setShowPassword(!showPassword)
                }
              />

              Show password
            </label>

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className="bg-green-600 text-white p-3 rounded-2xl w-full disabled:bg-gray-400"
          >
            {loading || formik.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        <div className="flex justify-center">

          <Link
            to="/login"
            className="text-blue-600 underline mt-4"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ResetPasswordPage;