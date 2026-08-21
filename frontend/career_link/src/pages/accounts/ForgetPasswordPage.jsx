import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";


import { forgotpasswordSchema } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";

const ForgetPasswordPage = () => {
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const { forgotpassword } = useAccounts();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: forgotpasswordSchema,

    onSubmit: async (values) => {
      try {
        const response = await forgotpassword(values.email);
        localStorage.setItem("resetemail",values.email)

         

        // Start 3 minute countdown
        const resendTime = Date.now() + 3 * 60 * 1000;
        localStorage.setItem("forgotPasswordResendTime", resendTime);
        setCountdown(180)

        navigate("/verifyotp")

      } catch (error) {
       
      }
    },
  });

  useEffect(() => {
    const savedResendTime = localStorage.getItem("forgotPasswordResendTime");
    if (!savedResendTime) return;

    const remaningTime = Math.ceil((Number(savedResendTime) - Date.now()) / 1000);
    if (remaningTime > 0) {
      setCountdown(remaningTime);
    } else {
      localStorage.removeItem("forgotPasswordResendTime");
      setCountdown(0);
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      const savedResendTime = localStorage.getItem(
        "forgotPasswordResendTime"
      );

      if (!savedResendTime) {
        setCountdown(0);
        return;
      }

      const remainingTime = Math.ceil(
        (Number(savedResendTime) - Date.now()) / 1000
      );

      if (remainingTime <= 0) {
        localStorage.removeItem("forgotPasswordResendTime");
        setCountdown(0);
      } else {
        setCountdown(remainingTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;




  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full shadow shadow-blue-600 rounded-2xl max-w-md p-6">

        <h1 className="text-2xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your email to receive an OTP.
        </p>

        <form onSubmit={formik.handleSubmit}>

          <div className="mb-4">

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-xl p-2 w-full"
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-700">
                {formik.errors.email}
              </p>
            )}

          </div>

          <button
            className="bg-green-600 text-white p-2 rounded-2xl w-full mt-7
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={countdown > 0 || formik.isSubmitting}
          >
            {countdown > 0
              ? `Resend OTP in ${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`
              : "Send OTP"}
          </button>

        </form>

        <div className="flex items-center justify-center">

          <Link
            to="/login"
            className="text-blue-600 underline mt-4 hover:text-blue-800"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ForgetPasswordPage;