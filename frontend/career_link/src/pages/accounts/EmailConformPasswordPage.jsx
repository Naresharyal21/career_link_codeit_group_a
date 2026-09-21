
import React, { useState } from "react";
import { Link, replace, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { passwordRule, passwordconfirmRule } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";

const EmailConformPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { confirmPassword, loading } = useAccounts();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
     
    },

    validationSchema: Yup.object({
      password: passwordRule,
      
    }),

    onSubmit: async (values) => {
    
      try {
       

        const response = await confirmPassword(
          
          values.password
         
        );


    navigate("/get/new/email/",{ replace:true});
    
        

     

        

      } catch (error) {
        console.log("Password reset error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-6 rounded-2xl shadow shadow-blue-600">

        <h1 className="text-2xl font-bold mb-2">
          To Change Email Please Enter Your Password First.
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your current password.
        </p>

        <form onSubmit={formik.handleSubmit}>

          {/* PASSWORD */}
          <div className="mb-4">

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a password"
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
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded-2xl w-full disabled:bg-gray-400"
          >
            {loading ? "conforming..." : "Conform Password"}
          </button>

        </form>

        {/* <div className="flex justify-center">

          <Link
            to="/login"
            className="text-blue-600 underline mt-4"
          >
            Back to Login
          </Link>

        </div> */}

      </div>

    </div>
  );
};

export default EmailConformPasswordPage;