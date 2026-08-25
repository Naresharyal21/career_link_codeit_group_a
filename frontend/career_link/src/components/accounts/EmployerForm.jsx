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
          className="border rounded p-2 w-full"
        />

        {formik.touched.company_description &&
          formik.errors.company_description && (
            <p className="text-red-700">
              {formik.errors.company_description}
            </p>
          )}
      </div>


      {/* 
          COMPANY WEBSITE
       */}
      <div className="flex justify-between">


        <div className="mb-2 w-65">
          <input
            id="website"
            name="website"
            type="url"
            placeholder="Enter your company website"
            value={formik.values.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded p-2 w-full"
          />

          {formik.touched.website &&
            formik.errors.website && (
              <p className="text-red-700">
                {formik.errors.website}
              </p>
            )}
        </div>


         {/* COMPANY PHONE */}
          


        <div className="mb-2 w-65">
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder=" Company phone number"
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
      </div>


      {/* 
          COMPANY LOGO
       */}

      <div className="mb-5 flex items-center justify-between border p-3 rounded-lg">

        <label className="font-medium text-gray-700 text-sm">
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

        <div className="flex items-center gap-3">

          <label
            htmlFor="logo"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
          >
            Choose File
          </label>

          <span className="text-xs text-gray-600 truncate max-w-120">
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