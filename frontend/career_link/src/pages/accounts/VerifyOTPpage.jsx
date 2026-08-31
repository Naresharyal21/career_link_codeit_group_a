import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { verifyOtpSchema } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";
import Button from "../../components/commonuiPart/Button";
import useOtpCooldown from "../../hooks/useOtpCooldown";

const VerifyOTPPage = () => {
  const { verifyOTP, deleteAccount, resendVerificationOTP, sendDeleteOTP, updateEmail } = useAccounts();
  const { purpose } = useParams();

  const {
    formattedTime,
    isCooldown,
    startCooldown,
  } = useOtpCooldown(purpose, 180);


  const navigate = useNavigate();







  const isProtectedPurpose = purpose === "cev" || purpose === "dav";


  const handleResendOTP = async () => {
    if (isCooldown) return;
    try {
      if (purpose === "emv") {
        const email = localStorage.getItem("signupemail");

        if (!email) {
          toast.error("Email not found");
          return;
        }

        await resendVerificationOTP(email, purpose);

      }

      if (purpose === "dav") {
        await sendDeleteOTP(purpose);
      }
      startCooldown();
      toast.success("OTP sent successfully");

    } catch (error) {
      console.log("Resend OTP error:", error);
      toast.error(error.message || "Failed to resend OTP");
    }
  };



  const formik = useFormik({
    initialValues: {
      otp: "",
    },

    validationSchema: verifyOtpSchema,

    onSubmit: async (values) => {
      try {
        // Account deletion
        if (purpose === "dav") {
          await deleteAccount(values.otp, purpose);

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          toast.success("Account deleted successfully");
          navigate("/login");
          return;
        }

        // Protected change-email verification
        if (purpose === "cev") {
          const email = localStorage.getItem("updateemail");

          if (!email) {
            toast.error("Email not found");
            return;
          }

          await verifyOTP(
            email,
            values.otp,
            purpose
          );




          const response=await updateEmail(
            email,

          );
          localStorage.removeItem("updateemail");
          toast.success("Email changed successfully");
          if (response.email_verified) {
            navigate("/");
          } else {
            navigate("/verifyemail");
          }
          return;
        }

        // Normal OTP flows
        const storageKey =
          purpose === "prv"
            ? "resetemail"
            : "signupemail";

        const email = localStorage.getItem(storageKey);

        if (!email) {
          toast.error("Email not found");
          return;
        }

        await verifyOTP(
          email,
          values.otp,
          purpose
        );

        if (purpose === "emv") {
          localStorage.removeItem("signupemail");
          navigate("/login");
          return;
        }

        if (purpose === "prv") {
          navigate("/resetpassword");
          return;
        }

      } catch (error) {
        console.log("OTP verification error:", error);
        toast.error(error.message || "OTP verification failed");
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-2xl shadow shadow-blue-600">

        <h1 className="text-2xl font-bold mb-2">
          {purpose === "emv"
            ? "Verify Your Email"
            : purpose === "prv"
              ? "Verify OTP"
              : purpose === "cev"
                ? "Verify New Email"
                : "Verify Account Deletion"}
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

          <Button
            type="submit"

            variant={purpose === "dav" ? "danger" : "primary"}
            disabled={formik.isSubmitting}
            className="w-full mt-5"
          >

            {formik.isSubmitting
              ? "Deleting..."
              : purpose === "dav"
                ? "Delete My Account Permanently"
                : "Verify OTP"}
          </Button>

        </form>

        {(purpose == "emv" || purpose === "dav" || purpose === "cev") && (
          <div className="flex items-center justify-center">
            <Button
              type="button"
              disabled={isCooldown}
              variant="gray"
              onClick={handleResendOTP}
              className=" mt-4 "
            >
              {isCooldown
                ? `Resend OTP (${formattedTime})`
                : "Resend OTP"}
            </Button>
          </div>
        )}
        {!isProtectedPurpose && (
          <div className="flex items-center justify-center">
            <Link
              to="/forgetpassword"
              className="text-blue-600 underline mt-4 hover:text-blue-800"
            >
              Change Email
            </Link>
          </div>
        )}
        {isProtectedPurpose && (
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className="text-green-600  font-bold mt-4 hover:text-green-800"
            >
              Cancel Process
            </Link>
          </div>
        )}
        {purpose === "prv" && (
          <div className="flex items-center justify-center">
            <Link
              to="/forgetpassword"
              className="text-blue-600 underline mt-4 hover:text-blue-800"
            >
              Change Email
            </Link>
          </div>
        )}



      </div>
    </div>
  );
};

export default VerifyOTPPage;