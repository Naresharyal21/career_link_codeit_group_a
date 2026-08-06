import React from "react";
import heroImg from "../../../assets/hero-office-picture.jpg";

function HomePage() {
  return (
    <>
      <section className=" bg-gradient-to-br from-slate-900 to-blue-900  py-25">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-2 items-center gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
              <span className="uppercase text-sm font-medium tracking-wide text-slate-400">0 open roles</span>
              <span className="text-slate-500"> &middot;</span>
              <span className="uppercase text-sm font-medium tracking-wide text-slate-400">0 companies</span>
            </div>
            <h1 className="mt-6 text-7xl font-bold leading-[1.05] text-white">Find work worth doing.</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              CareerLink brings job seekers, employers and verified listings together — with resume tools and honest status tracking on every application.
            </p>
            <form method="get" className="mt-10 flex gap-2">
              <input
                type="search"
                className="flex-1 bg-slate-800 rounded-xl focus:ring-3 focus:ring-blue-700 placeholder:text-slate-400 px-6 py-4 text-slate-900 outline-none"
                placeholder="Job Titles,Skills or Company"
              />
              <button
                type="submit"
                className="rounded-xl  bg-slate-700  focus:ring-2 focus:ring-white bg-blue-600 px-8 py-4 font-semibold text-white transition-colors duration-300 hover:bg-blue-400"
              >
                Search
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 inline ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.75L21 12m0 0l-3.75 3.25M21 12H3" />
                </svg>
              </button>
            </form>
          </div>

          <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-2xl"></div>
            <img src={heroImg} alt="office-picture" className="w-full rounded-2xl shadow-2xl object-cover" />
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

     <h1 className="text-center">Will continue tomarrow</h1>
    </>
  );
}

export default HomePage;