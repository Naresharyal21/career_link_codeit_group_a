import React from "react";

const EmployerForm = ({ formik }) => {
  return (
    <div>

      {/* 
          COMPANY DESCRIPTION
       */}

      <div className="mb-2">
        <textarea
          id="company_description"
          name="company_description"
          placeholder="Tell us about your company"
          value={formik.values.company_description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows="2"
          aria-label="Company description"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
        />

        {formik.touched.company_description &&
          formik.errors.company_description && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {formik.errors.company_description}
            </p>
          )}
      </div>


      {/* 
          COMPANY WEBSITE
       */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">


        <div className="mb-2 w-full">
          <input
            id="website"
            name="website"
            type="url"
            aria-label="Company website"
            placeholder="Enter your company website"
            value={formik.values.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />

          {formik.touched.website &&
            formik.errors.website && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {formik.errors.website}
              </p>
            )}
        </div>


         {/* COMPANY PHONE */}
          


        <div className="mb-2 w-full">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-label="Company phone number"
            placeholder=" Company phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />

          {formik.touched.phone &&
            formik.errors.phone && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {formik.errors.phone}
              </p>
            )}
        </div>
      </div>


      {/* 
          COMPANY LOGO
       */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">

        <label className="text-sm font-medium text-slate-700">
          Company Logo
        </label>

        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files[0];

            formik.setFieldValue(
              "logo",
              file || null
            );
          }}
        />

        <div className="flex min-w-0 flex-wrap items-center gap-3">

          <label
            htmlFor="logo"
            className="inline-flex cursor-pointer items-center rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors duration-200 hover:bg-violet-100"
          >
            Choose File
          </label>

          <span className="max-w-full truncate text-xs text-slate-500 sm:max-w-48">
            {formik.values.logo
              ? formik.values.logo.name
              : "No file chosen"}
          </span>

        </div>
      </div>

    </div>
  );
};

export default EmployerForm;