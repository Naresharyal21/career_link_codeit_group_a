import SignupForm from "../../components/accounts/SignupForm";
import { useLocation } from "react-router-dom";

const Signup = () => {
  const { state } = useLocation();
  const auth0Onboarding = state?.auth0Onboarding;

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative isolate overflow-hidden bg-gradient-to-br from-[#182846] via-[#233d67] to-[#6048d8] p-7 text-white sm:p-10 lg:flex lg:min-h-full lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full border-[36px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-16 -z-10 h-56 w-56 rounded-full bg-violet-400/20 blur-2xl"
          />

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-100">
              A better way to move forward
            </p>
            <h1 className="mt-6 max-w-md text-3xl font-bold leading-tight text-white sm:text-4xl">
              Your next opportunity starts with one small step.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100 sm:text-base">
              Create your CareerLink account to connect with great employers,
              discover meaningful work, and keep your career moving.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-12 lg:grid-cols-1">
            {[
              "Discover opportunities that fit you",
              "Keep your applications organized",
              "Build connections with local employers",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm text-white/95 backdrop-blur-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300/20 text-emerald-200"
                >
                  ✓
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </aside>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-sm font-semibold text-violet-700">
              Welcome to CareerLink
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {auth0Onboarding ? "Complete your profile" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {auth0Onboarding
                ? "Add a few details to finish setting up your CareerLink account."
                : "Choose how you’ll use CareerLink and fill in your details."}
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </section>
  );
};

export default Signup;
