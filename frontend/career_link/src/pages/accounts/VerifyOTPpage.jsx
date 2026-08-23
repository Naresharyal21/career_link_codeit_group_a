import React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useFormik } from "formik";

import { verifyOtpSchema } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";

const VerifyOTPPage = () => {
  const { verifyOTP } = useAccounts();
  const navigate = useNavigate();
  const {purpose} = useParams();

  const formik = useFormik({
    initialValues: {
      otp: "",
    },

    validationSchema: verifyOtpSchema,

   onSubmit: async (values) => {
    console.log(values)
  try {
    const storageKey=purpose==="prv"?"resetemail":purpose==="emv"?"signupemail":"deleteemail";
    
    const email = localStorage.getItem(storageKey);
     console.log("Email:", email);
        console.log("OTP:", values.otp);
        console.log("Purpose:", purpose);


    const response = await verifyOTP(
      email,
      values.otp,
      purpose
    );
    console.log("OTP verified:", response);
  localStorage.removeItem(storageKey);

if (purpose==="emv"){
     localStorage.removeItem("signupemail");
      navigate("/login");
}
if (purpose==="prv"){
  localStorage.setItem("resetemail",email);
  navigate("/resetpassword");
}
if (purpose==="dav"){
  localStorage.setItem("deleteemail",email);
  navigate("/deleteaccount");
}
   

  } catch (error) {
    console.log("OTP verification error:", error);
  }
},
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-2xl shadow shadow-blue-600">

        <h1 className="text-2xl font-bold mb-2">{purpose==="emv"?"Verify Your Email":purpose==="prv"?"Verify OTP":"Verify Account Deletion"}
          
        </h1>

        <p className="text-gray-500 mb-6">
          Enter the OTP sent to your email.
        </p>

        <form onSubmit={formik.handleSubmit}>

          <div className="mb-2">
            <input
              type="text"
              name="otp"
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={formik.values.otp}
              onChange={(e) => {
                const value = e.target.value;

                if (/^[0-9]*$/.test(value)) {
                  formik.setFieldValue("otp", value);
                }
              }}
              onBlur={formik.handleBlur}
              className="border rounded-xl p-3 w-full text-center text-xl tracking-widest"
            />
          </div>

          {formik.touched.otp && formik.errors.otp && (
            <p className="text-red-600 text-center mb-4">
              {formik.errors.otp}
            </p>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-green-600 text-white p-2 rounded-2xl w-full mt-5 disabled:bg-gray-400"
          >
            {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="flex items-center justify-center">
          <Link
            to="/forgetpassword"
            className="text-blue-600 underline mt-4 hover:text-blue-800"
          >
            Change Email
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTPPage;