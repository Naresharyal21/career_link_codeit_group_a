import React from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";

import { loginValidationSchema } from "../../components/accounts/validationSchema";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: loginValidationSchema,

    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center  ">

      <div className="w-full   shadow shadow-blue-600 rounded-2xl max-w-md p-6">

        <h1 className="text-2xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your email to receive an OTP.
        </p>

        <form onSubmit={formik.handleSubmit}>

          {/* EMAIL */}

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

            {formik.touched.email &&
              formik.errors.email && (
                <p className="text-red-700">
                  {formik.errors.email}
                </p>
              )}

          </div>

          {/* SEND OTP */}

          <button
            className="bg-green-600 text-white p-2 rounded-2xl w-full mt-7"
            type="submit"
            >
            Send OTP
          </button>

        </form>
<div className="flex items-center justify-center">

        {/* BACK TO LOGIN */}

        <Link to="/login"
          className="text-blue-600 underline mt-4 hover:"
          >
          Back to Login
        </Link>

      </div>
          </div>

    </div>
  );
};

export default ForgetPasswordPage;