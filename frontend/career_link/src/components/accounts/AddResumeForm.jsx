import { useContext, useRef, useState } from "react";
import { useFormik } from "formik";
import { verifyresumeaschema } from "./validationSchema";
import Button from "../commonuiPart/Button";
import apiClient from "../../apis/apiClient";
import accountsApi from "../../apis/accountsApi";
import { AuthenticationContext } from "../../context/AuthContext";

const AddResumeForm = ({ onClose }) => {
  const { setUser } = useContext(AuthenticationContext);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: { resume_file: null },
    validationSchema: verifyresumeaschema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      const formData = new FormData();
      formData.append("resume_file", values.resume_file);
      try {
        await apiClient.put("/accounts/me/", formData);
        const user = await accountsApi.getMe();
        setUser(user);
        resetForm();
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose?.();
      } catch (error) {
        setSubmitError(error.message || "Unable to upload your resume.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {submitError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}
      <div>
        <label
          htmlFor="resume_file"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Resume file
        </label>
        <input
          id="resume_file"
          ref={fileInputRef}
          type="file"
          name="resume_file"
          accept=".pdf,.doc,.docx"
          onChange={(event) =>
            formik.setFieldValue("resume_file", event.currentTarget.files?.[0] || null)
          }
          className="block w-full rounded-xl border border-slate-300 p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700"
        />
        {formik.values.resume_file && (
          <p className="mt-2 truncate text-xs text-slate-600">{formik.values.resume_file.name}</p>
        )}
        {formik.errors.resume_file && (
          <p role="alert" className="mt-2 text-sm text-red-700">{formik.errors.resume_file}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">PDF, DOC, or DOCX; maximum size 5 MB.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={formik.isSubmitting} className="rounded-xl px-5 py-2.5">
          {formik.isSubmitting ? "Uploading…" : "Upload resume"}
        </Button>
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            disabled={formik.isSubmitting}
            variant="gray"
            className="rounded-xl px-5 py-2.5"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddResumeForm;
