import { useContext } from "react";
import { Link } from "react-router-dom";
import AddResumeForm from "../components/accounts/AddResumeForm";
import { AuthenticationContext } from "../context/AuthContext";

const ResumePage = () => {
  const { user } = useContext(AuthenticationContext);
  const resumePath = user?.profile?.resume_file;
  const mediaBase = import.meta.env.VITE_MEDIA_BASE_URL || "";

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <Link to="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Resume / CV</h1>
      <p className="mt-2 text-sm text-slate-600">
        Upload a PDF, DOC, or DOCX resume to keep it on your profile.
      </p>
      {resumePath && (
        <a
          href={resumePath.startsWith("http") ? resumePath : `${mediaBase}${resumePath}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:underline"
        >
          View current resume
        </a>
      )}
      <div className="mt-6 border-t border-slate-100 pt-6">
        <AddResumeForm />
      </div>
    </section>
  );
};

export default ResumePage;
