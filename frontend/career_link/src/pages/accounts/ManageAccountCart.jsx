import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiShield, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

import Button from "../../components/commonuiPart/Button";
import useAccounts from "../../hooks/useAccounts";
import useOtpCooldown from "../../hooks/useOtpCooldown";

const ManageAccountCart = ({ onClose }) => {
  const { sendDeleteOTP } = useAccounts();
  const navigate = useNavigate();
  const { formattedTime, isCooldown, startCooldown } = useOtpCooldown("dav", 180);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const handleDeleteAccount = async () => {
    try {
      await sendDeleteOTP();
      startCooldown();
      navigate("/verifyotp/dav");
    } catch (error) {
      toast.error(error.message || "Could not send the account deletion OTP.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-account-title"
        aria-describedby="manage-account-description"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25"
      >
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 px-6 pb-5 pt-6 sm:px-7">
          <Button
            type="button"
            onClick={onClose}
            variant="closeButton"
            aria-label="Close account settings"
          >
            <span aria-hidden="true" className="text-xl leading-none">×</span>
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
            <FiShield className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2
            id="manage-account-title"
            className="mt-4 pr-10 text-2xl font-bold text-slate-900"
          >
            Manage account
          </h2>
          <p id="manage-account-description" className="mt-2 text-sm leading-6 text-slate-600">
            Update your account details or securely request account deletion.
          </p>
        </div>

        <div className="space-y-3 p-6 sm:p-7">
          <Link
            to="/conformpassword"
            onClick={onClose}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition duration-200 hover:border-violet-200 hover:bg-violet-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-200">
              <FiMail className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                Change email address
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Verify your password before updating your email.
              </span>
            </span>
            <span aria-hidden="true" className="text-lg text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-700">
              →
            </span>
          </Link>

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <FiTrash2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Delete account</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  We’ll send a verification code before the deletion process continues.
                </p>
                <Button
                  type="button"
                  disabled={isCooldown}
                  onClick={handleDeleteAccount}
                  variant="danger"
                  className="mt-4 w-full px-4 py-2.5 text-sm"
                >
                  {isCooldown
                    ? `Try again in ${formattedTime}`
                    : "Request account deletion"}
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onClose}
            variant="gray"
            className="w-full px-4 py-2.5 text-sm"
          >
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ManageAccountCart;
