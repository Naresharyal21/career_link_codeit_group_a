import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const ModeratorSectionPage = ({
  title,
  description,
  eyebrow = "Moderation",
  children,
  backLabel = "Back",
  backTo = "/report",
  action = null,
  className = "",
}) => {
  const navigate = useNavigate();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`min-h-full transition-colors duration-300 ${
        isDark
          ? "text-white"
          : "text-[#172337]"
      } ${className}`}
    >
     
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <p
            className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark
                ? "text-violet-400"
                : "text-[#6C4DFF]"
            }`}
          >
            {eyebrow}
          </p>

          <h1
            className={`text-2xl font-bold sm:text-3xl ${
              isDark
                ? "text-white"
                : "text-[#172337]"
            }`}
          >
            {title}
          </h1>

          {description && (
            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${
                isDark
                  ? "text-slate-400"
                  : "text-[#64748B]"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action}

          {backTo && (
            <button
              type="button"
              onClick={() => navigate(backTo)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {backLabel}
            </button>
          )}
        </div>
      </div>

     
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};

export default ModeratorSectionPage;