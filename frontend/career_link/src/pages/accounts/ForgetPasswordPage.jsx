import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { forgotpasswordSchema } from "../../components/accounts/validationSchema";
import useAccounts from "../../hooks/useAccounts";
import useOtpCooldown from "../../hooks/useOtpCooldown";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotpassword } = useAccounts();
  const { formattedTime, isCooldown, startCooldown } = useOtpCooldown("prv", 180);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotpasswordSchema,
    onSubmit: async (values) => {
      const email = values.email.trim().toLowerCase();
      try {
        await forgotpassword(email);
        localStorage.setItem("resetemail", email);
        startCooldown();
        navigate("/verifyotp/prv");
      } catch (error) {
        toast.error(error.message || "Unable to send the password reset OTP.");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your registered email and we’ll send you a verification code.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {formik.touched.email && formik.errors.email && (
            <p role="alert" className="mt-2 text-sm text-red-700">{formik.errors.email}</p>
          )}
          <button
            type="submit"
            disabled={isCooldown || formik.isSubmitting}
            className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {formik.isSubmitting
              ? "Sending code…"
              : isCooldown
                ? `Try again in ${formattedTime}`
                : "Send verification code"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-700 hover:underline">
            Back to login
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForgetPasswordPage;
