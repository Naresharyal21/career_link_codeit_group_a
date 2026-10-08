import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";

const DashboardHomePage = () => {
  const { user } = useContext(AuthenticationContext);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-[#6C4DFF]">Dashboard</p>
        <h1 className="mt-2 text-2xl font-bold text-[#172337] sm:text-3xl">
          Welcome back{user?.username ? `, ${user.username}` : ""}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pick up where you left off on CareerLink.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/jobs"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#172337]">Find jobs</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse opportunities and find your next role.
          </p>
        </Link>
        <Link
          to="/applications"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#172337]">
            My applications
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Review the status of your job applications.
          </p>
        </Link>
      </section>
    </div>
  );
};

export default DashboardHomePage;
