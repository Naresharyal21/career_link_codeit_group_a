import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../apis/apiClient";
import { JOB_TYPE_LABELS, getJobs } from "../apis/jobsApi";
import { AuthenticationContext } from "../context/AuthContext";

const STATUS_STYLES = {
  APPLIED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  INTERVIEW: "bg-cyan-50 text-cyan-700",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  WITHDRAWN: "bg-slate-100 text-slate-600",
};

const STATUS_LABELS = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const getItems = (response) => (
  Array.isArray(response) ? response : response?.results || []
);

const getCount = (response, items) => (
  typeof response?.count === "number" ? response.count : items.length
);

const DashboardHomePage = () => {
  const { user } = useContext(AuthenticationContext);
  const isEmployer = user?.role === "ep";
  const [dashboard, setDashboard] = useState({
    applications: [],
    applicationCount: 0,
    savedJobs: [],
    savedJobCount: 0,
    jobs: [],
    jobCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [applicationResponse, secondaryResponse, jobsResponse] = await Promise.all([
          apiClient.get("/applications/"),
          isEmployer
            ? apiClient.get("/jobs/manage/")
            : apiClient.get("/applications/saved-jobs/"),
          isEmployer ? Promise.resolve(null) : getJobs(),
        ]);
        const applications = getItems(applicationResponse);
        const secondaryItems = getItems(secondaryResponse);
        const jobs = isEmployer ? [] : getItems(jobsResponse);

        if (active) {
          setDashboard({
            applications,
            applicationCount: getCount(applicationResponse, applications),
            savedJobs: isEmployer ? [] : secondaryItems,
            savedJobCount: isEmployer ? 0 : getCount(secondaryResponse, secondaryItems),
            jobs,
            jobCount: isEmployer ? getCount(secondaryResponse, secondaryItems) : getCount(jobsResponse, jobs),
          });
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || "Unable to load your dashboard.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, [isEmployer, reloadKey]);

  const { applications, applicationCount, savedJobs, savedJobCount, jobs, jobCount } = dashboard;
  const openApplications = applications.filter((application) =>
    ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW"].includes(application.status),
  ).length;
  const activePostings = dashboard.jobs.filter((job) => job.is_active).length;

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#172337] via-[#233d67] to-[#6048d8] p-6 text-white shadow-lg sm:p-9">
        <div aria-hidden="true" className="absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full border-[36px] border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-28 right-1/3 -z-10 h-56 w-56 rounded-full bg-violet-400/20 blur-2xl" />
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
              CareerLink dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Welcome back{user?.username ? `, ${user.username}` : ""}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              {isEmployer
                ? "Your hiring activity, job listings, and new candidates—all in one place."
                : "Stay on top of your applications and discover opportunities that move your career forward."}
            </p>
          </div>
          <Link
            to={isEmployer ? "/employer/post-job" : "/jobs"}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#24334A] shadow transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            {isEmployer ? "Post a job" : "Explore jobs"}
            <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading dashboard">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm">
              <div className="m-5 h-4 w-1/2 rounded bg-slate-200" />
              <div className="mx-5 mt-5 h-8 w-1/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section aria-label="Dashboard summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label={isEmployer ? "Applications received" : "Applications sent"}
              value={applicationCount}
              detail={isEmployer ? `${openApplications} in progress` : `${openApplications} awaiting an outcome`}
              icon="▤"
              tone="blue"
              to="/dashboard/applications"
            />
            {isEmployer ? (
              <StatCard
                label="Job postings"
                value={jobCount}
                detail={`${activePostings} active in the latest listings`}
                icon="▱"
                tone="violet"
                to="/employer/jobs"
              />
            ) : (
              <StatCard
                label="Saved jobs"
                value={savedJobCount}
                detail="Opportunities bookmarked for later"
                icon="☆"
                tone="amber"
                to="/dashboard/saved-jobs"
              />
            )}
            <StatCard
              label={isEmployer ? "Hiring tools" : "Opportunities"}
              value={isEmployer ? "Ready" : jobCount}
              detail={isEmployer ? "Review candidates and update listings" : "Active jobs to explore"}
              icon={isEmployer ? "✓" : "⌕"}
              tone="green"
              to={isEmployer ? "/dashboard/applications" : "/jobs"}
            />
          </section>

          <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    {isEmployer ? "Candidate activity" : "Your progress"}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {isEmployer ? "Recent applications" : "Recent applications"}
                  </h2>
                </div>
                <Link to="/dashboard/applications" className="text-sm font-semibold text-blue-700 hover:underline">
                  View all
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-base font-semibold text-slate-900">
                    {isEmployer ? "No candidates yet" : "Your journey starts here"}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {isEmployer
                      ? "Applications to your job postings will appear here."
                      : "Apply for a job to see your application progress here."}
                  </p>
                  <Link
                    to={isEmployer ? "/employer/post-job" : "/jobs"}
                    className="mt-4 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    {isEmployer ? "Post your first job" : "Browse jobs"}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((application) => (
                    <li key={application.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7">
                      <div className="min-w-0">
                        {isEmployer && (
                          <p className="mb-1 truncate text-xs font-medium text-slate-500">
                            Applicant: {application.job_seeker}
                          </p>
                        )}
                        <Link
                          to={`/jobs/${application.job}`}
                          className="block truncate font-semibold text-slate-900 hover:text-blue-700"
                        >
                          {application.job_title || `Job #${application.job}`}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {application.created_at
                            ? `Submitted ${new Date(application.created_at).toLocaleDateString()}`
                            : "Application submitted"}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[application.status] || "bg-slate-100 text-slate-700"}`}>
                        {STATUS_LABELS[application.status] || application.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                  {isEmployer ? "Your hiring" : "A little momentum"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {isEmployer ? "Quick actions" : "Make your next move"}
                </h2>
              </div>
              <div className="space-y-3 p-5 sm:p-7">
                {isEmployer ? (
                  <>
                    <ActionLink to="/employer/post-job" title="Create a job posting" description="Reach candidates looking for their next role." />
                    <ActionLink to="/employer/jobs" title="Manage your listings" description={`${jobCount} posting${jobCount === 1 ? "" : "s"} in your account.`} />
                    <ActionLink to="/dashboard/applications" title="Review candidates" description={`${applicationCount} application${applicationCount === 1 ? "" : "s"} received.`} />
                  </>
                ) : (
                  <>
                    <ActionLink to="/jobs" title="Find a role that fits" description={`${jobCount} active opportunit${jobCount === 1 ? "y" : "ies"} to explore.`} />
                    <ActionLink to="/dashboard/resume" title="Polish your profile" description="Keep your resume and details ready to share." />
                    <ActionLink to="/dashboard/saved-jobs" title="Revisit saved jobs" description={`${savedJobCount} opportunity${savedJobCount === 1 ? "" : "ies"} saved for later.`} />
                  </>
                )}
              </div>
            </section>
          </div>

          {!isEmployer && (
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Saved for later
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">Your saved jobs</h2>
                </div>
                <Link to="/dashboard/saved-jobs" className="text-sm font-semibold text-blue-700 hover:underline">
                  View saved jobs
                </Link>
              </div>
              {savedJobs.length === 0 ? (
                <div className="px-6 py-7">
                  <p className="text-sm text-slate-600">
                    Save interesting roles while browsing and they’ll be collected here.
                  </p>
                  <Link to="/jobs" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline">
                    Find jobs →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 sm:grid sm:grid-cols-2 sm:divide-y-0">
                  {savedJobs.slice(0, 4).map((savedJob) => (
                    <li key={savedJob.id} className="border-slate-100 px-5 py-4 sm:border-b sm:px-7">
                      <Link to={`/jobs/${savedJob.job}`} className="font-semibold text-slate-900 hover:text-blue-700">
                        {savedJob.job_title || `Job #${savedJob.job}`}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {savedJob.saved_at
                          ? `Saved ${new Date(savedJob.saved_at).toLocaleDateString()}`
                          : "Saved job"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {!isEmployer && (
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    Hand-picked for your next step
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">Explore open opportunities</h2>
                </div>
                <Link to="/jobs" className="text-sm font-semibold text-blue-700 hover:underline">
                  Browse all jobs
                </Link>
              </div>
              {jobs.length === 0 ? (
                <p className="px-6 py-8 text-sm text-slate-600">There are no active listings to show right now. Check back soon.</p>
              ) : (
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                  {jobs.slice(0, 3).map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="group rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 font-bold text-violet-700">
                          {job.title?.charAt(0).toUpperCase() || "J"}
                        </span>
                        {job.is_urgent && (
                          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 truncate font-bold text-slate-900 group-hover:text-violet-700">
                        {job.title}
                      </h3>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {job.employer_name || "CareerLink employer"}
                      </p>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        {job.location} · {JOB_TYPE_LABELS[job.job_type] || job.job_type}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};

function StatCard({ label, value, detail, icon, tone, to }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${colors[tone]}`}>
          {icon}
        </span>
      </div>
    </Link>
  );
}

function ActionLink({ to, title, description }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/50"
    >
      <span className="min-w-0">
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span>
      </span>
      <span aria-hidden="true" className="text-lg font-semibold text-violet-700">→</span>
    </Link>
  );
}

export default DashboardHomePage;
