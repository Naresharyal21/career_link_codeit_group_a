import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImg from "../../../assets/hero-office-picture.jpg";


const featuredJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Nimbus Tech",
    logo: "https://ui-avatars.com/api/?name=Nimbus+Tech&background=1e293b&color=fff",
    location: "Kathmandu, Nepal",
    salary: "Rs.80000 - Rs.120000/mo",
    type: "Full-time",
    experience: "1-3 years",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Brightside Studio",
    logo: "https://ui-avatars.com/api/?name=Brightside&background=1e293b&color=fff",
    location: "Remote",
    salary: "Rs.70000 - Rs.100,000/mo",
    type: "Part-time",
    experience: "2+ years",
  },
  {
    id: 3,
    title: "Backend Engineer (Django)",
    company: "Hivewire",
    logo: "https://ui-avatars.com/api/?name=Hivewire&background=1e293b&color=fff",
    location: "Pokhara, Nepal",
    salary: "Rs.100,000 - Rs.150,000/mo",
    type: "Full-time",
    experience: "3+ years",
  },
];

const popularCategories = ["Engineering", "Design", "Marketing", "Sales", "Customer Support", "Finance"];

function HomePage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [savedJobs, setSavedJobs] = useState([]);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/browse?keyword=${keyword}&location=${location}`);
  }

  function toggleSaveJob(jobId) {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  }

  return (
    <>
     <section className=" bg-gradient-to-br from-slate-900 to-blue-900  py-25">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-2 items-center gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
              <span className="uppercase text-sm font-medium tracking-wide text-slate-400">128 open roles</span>
              <span className="text-slate-500"> &middot;</span>
              <span className="uppercase text-sm font-medium tracking-wide text-slate-400">34 companies</span>
              <span className="text-slate-500"> &middot;</span>
              <span className="uppercase text-sm font-medium tracking-wide text-slate-400">2,400 job seekers</span>
              <span className="text-slate-500"> &middot;</span>
              <span className="uppercase text-sm font-medium tracking-wide text-slate-400">34 employers</span>
            </div>
            <h1 className="mt-6 text-7xl font-bold leading-[1.05] text-white">Find work worth doing.</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              CareerLink brings job seekers, employers and verified listings together — with resume tools and honest status tracking on every application.
            </p>

            <form onSubmit={handleSearch} className="mt-10 flex items-center gap-2 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17.25 10.5a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
                </svg>
                <input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-base text-white placeholder:text-slate-400 outline-none focus:bg-white/5 transition-colors duration-300"
                  placeholder="Job titles, skills or company"
                />
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div className="relative w-52">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-base text-white placeholder:text-slate-400 outline-none focus:bg-white/5 transition-colors duration-300"
                  placeholder="Location"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Search
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.75L21 12m0 0l-3.75 3.25M21 12H3" />
                </svg>
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">Popular:</span>
              {popularCategories.map((category) => (
                <Link
                  key={category}
                  to={`/browse?category=${category}`}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-slate-200 hover:bg-white/20 transition-colors duration-300"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-2xl"></div>
            <img src={heroImg} alt="office-picture" className="w-full rounded-2xl shadow-2xl object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold text-slate-900">Featured jobs</h2>
            <Link to="/browse" className="text-blue-600 font-semibold hover:text-blue-800">
              View all jobs →
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <article key={job.id} className="rounded-2xl border border-slate-200 p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
                <div className="flex items-center gap-3">
                  <img src={job.logo} alt={job.company} className="h-12 w-12 rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-600">{job.company}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{job.type}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{job.experience}</span>
                </div>

                <p className="mt-4 font-semibold text-blue-700">{job.salary}</p>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="flex-1 text-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
                  >
                    Apply
                  </Link>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`rounded-lg border px-4 py-2 font-semibold transition-colors duration-300 ${
                      savedJobs.includes(job.id)
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-slate-300 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {savedJobs.includes(job.id) ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-8">
          <h2 className="text-4xl font-bold text-slate-900">Everything a job search needs</h2>

          <div className="mt-12 grid grid-cols-4 gap-8">
            <article className="rounded-2xl bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Search that respects your time</h3>
              <p className="mt-2 text-slate-600">Filter by salary, experience, category, education and remote setup — then apply in two clicks.</p>
            </article>

            <article className="rounded-2xl bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Resume management</h3>
              <p className="mt-2 text-slate-600">Keep multiple resumes, mark a primary, and attach the right one to every application.</p>
            </article>

            <article className="rounded-2xl bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7.5 15l3-3 2.25 2.25L18 9" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Application tracking</h3>
              <p className="mt-2 text-slate-600">Watch each application move from applied to under review, shortlisted, interview and offer.</p>
            </article>

            <article className="rounded-2xl bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25c0 5.25-3.438 9.75-8.25 11.25C7.938 21.75 4.5 17.25 4.5 12V5.25L12 2.25l7.5 3V12Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Verified employers</h3>
              <p className="mt-2 text-slate-600">Every company is reviewed and every posting is approved before it reaches candidates.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-3xl px-8">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-8 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-900">Ready to take the next step?</h2>
            <p className="mx-auto mt-3 max-w-md text-blue-600">
              Create your profile, upload your resume, and start applying to jobs in minutes.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-700"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.75L21 12m0 0l-3.75 3.25M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;