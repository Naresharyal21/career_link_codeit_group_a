
import React, { useState } from "react";
import { Link, replace, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { emailRule } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";
import Button from "../../components/commonuiPart/Button";

const EmailChangePage = () => {
 

  const { sendnewemailotp, loading } = useAccounts();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
     
    },

    validationSchema: Yup.object({
      new_email: emailRule,
      
    }),

    onSubmit: async (values) => {
      
    localStorage.setItem("updateemail", values.new_email);
      try {

       

        const response = await sendnewemailotp(
          
          values.new_email

        
         
        );


    navigate("/pr/verifyotp/cev",{ replace:true});
        

     

        

      } catch (error) {
        console.log("Password reset error:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-6 rounded-2xl shadow shadow-blue-600">

        <h1 className="text-2xl font-bold mb-2">
          Please Enter Your Email.
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your New email for your account.
        </p>

        <form onSubmit={formik.handleSubmit}>

          {/* email */}
          <div className="mb-4">

            <input
              id="new_email"
              name="new_email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.new_email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-xl p-3 w-full"
            />

            {formik.touched.new_email &&
              formik.errors.new_email && (
                <p className="text-red-700">
                  {formik.errors.new_email}
                </p>
              )}

          </div>

        

        
        

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="primary"
            
            disabled={loading}
            className=" text-white p-3 rounded-2xl w-full disabled:bg-gray-400"
          >
            {loading ? "Proceeding..." : "Proceed Forward"}
          </Button>

        </form>

      

      </div>

    </div>
  );
};

export default EmailChangePage;