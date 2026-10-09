import React from 'react'
import { Link } from "react-router-dom";
import { useState } from "react";
import Auth0LoginButtons from "../../components/accounts/Auth0LoginButtons";
import LoginForm from '../../components/accounts/LoginForm'


const Login = () => {
  const [selectedRole, setSelectedRole] = useState("js");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-violet-700"
        >
          ← Back to CareerLink
        </Link>
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          Welcome back
        </h1>
        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium text-slate-700">
            Sign in as
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "js", label: "Jobseeker" },
              { value: "ep", label: "Employer" },
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                aria-pressed={selectedRole === role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`login-role-option rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  selectedRole === role.value
                    ? "border-violet-600 bg-violet-50 text-violet-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </fieldset>
        <LoginForm selectedRole={selectedRole} />
        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <Auth0LoginButtons role={selectedRole} />
      </div>
    </div>
  )
}

export default Login
