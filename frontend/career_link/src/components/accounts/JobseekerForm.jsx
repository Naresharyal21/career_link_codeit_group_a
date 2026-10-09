import React from "react";

const JobseekerForm = ({ formik }) => {
  return (
    <div>

      {/* 
          PHONE
       */}
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="mb-4 w-full">
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          aria-label="Phone number"
          placeholder="Enter your phone number"
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


      {/* 
          DATE OF BIRTH
       */}

      <div className="mb-4 w-full">
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          aria-label="Date of birth"
          value={formik.values.date_of_birth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
        />

        {formik.touched.date_of_birth &&
          formik.errors.date_of_birth && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {formik.errors.date_of_birth}
            </p>
          )}
      </div>
</div>

      {/* 
          RESUME
       */}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">

        <label className="text-sm font-medium text-slate-700">
          Resume
        </label>

        <input
          id="resume_file"
          name="resume_file"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files[0];

            formik.setFieldValue(
              "resume_file",
              file || null
            );
          }}
        />

        <div className="flex min-w-0 flex-wrap items-center gap-3">

          <label
            htmlFor="resume_file"
            className="inline-flex cursor-pointer items-center rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors duration-200 hover:bg-violet-100"
          >
            Upload Resume
          </label>

          <span className="max-w-full truncate text-xs text-slate-500 sm:max-w-48">
            {formik.values.resume_file
              ? formik.values.resume_file.name
              : "No file chosen"}
          </span>

        </div>



      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">

        <label className="text-sm font-medium text-slate-700">
          Profile Picture
        </label>

        <input
          id="profile_pictur"
          name="profile_pictur"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files[0];

            formik.setFieldValue(
              "profile_pictur",
              file || null
            );
          }}
        />

        <div className="flex min-w-0 flex-wrap items-center gap-3">

          <label
            htmlFor="profile_pictur"
            className="inline-flex cursor-pointer items-center rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition-colors duration-200 hover:bg-violet-100"
          >
            Choose Image
          </label>

          <span className="max-w-full truncate text-xs text-slate-500 sm:max-w-48">
            {formik.values.profile_pictur
              ? formik.values.profile_pictur.name
              : "No file chosen"}
          </span>

        </div>

      </div>


    </div>
  );
};

export default JobseekerForm;