import React from "react";

const JobseekerForm = ({ formik }) => {
  return (
    <div>

      {/* =========================
          PHONE
      ========================= */}

      <div className="mb-4">
        <input
          id="phone"
          name="phone"
          type="text"
          placeholder="Enter your phone number"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border rounded p-2 w-full"
        />

        {formik.touched.phone &&
          formik.errors.phone && (
            <p className="text-red-700">
              {formik.errors.phone}
            </p>
          )}
      </div>


      {/* =========================
          DATE OF BIRTH
      ========================= */}

      <div className="mb-4">
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={formik.values.date_of_birth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border rounded p-2 w-full"
        />

        {formik.touched.date_of_birth &&
          formik.errors.date_of_birth && (
            <p className="text-red-700">
              {formik.errors.date_of_birth}
            </p>
          )}
      </div>


      {/* =========================
          RESUME
      ========================= */}

      <div className="mb-4 flex items-center justify-between border p-3 rounded-lg">

        <label className="font-medium text-gray-700 text-sm">
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

        <div className="flex items-center gap-3">

          <label
            htmlFor="resume_file"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
          >
            Upload Resume
          </label>

          <span className="text-xs text-gray-600 truncate max-w-120">
            {formik.values.resume_file
              ? formik.values.resume_file.name
              : "No file chosen"}
          </span>

        </div>



      </div>
      <div className="mb-4 flex items-center justify-between border p-3 rounded-lg">

        <label className="font-medium text-gray-700 text-sm">
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

        <div className="flex items-center gap-3">

          <label
            htmlFor="profile_pictur"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
          >
            Choose Image
          </label>

          <span className="text-xs text-gray-600 truncate max-w-120">
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