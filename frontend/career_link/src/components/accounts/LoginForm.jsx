import { useFormik } from 'formik'
import React, { useState } from 'react'


import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { loginValidationSchema } from './validationSchema';
import { Link } from 'react-router';


const LoginForm = () => {

  const [showPassword, setShowPassword] = useState(false)
  const handletoggle = () => {
    setShowPassword(showPassword ? false : true)
  }
  const formik = useFormik({

    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginValidationSchema,

    onSubmit: async (values) => {
      console.log(values)
      try {

      } catch (err) {

      }
    }

  })






  return (
    <form onSubmit={formik.handleSubmit}>



      <div className=" mt-10 mb-10  ">

        <input
          id="email"
          name="email"
          type="email"

          placeholder="Enter your Email"


          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}

          className="border rounded-xl  p-2 w-full "
        />

        {formik.touched.email &&
          formik.errors.email && (
            <p className="text-red-700">
              {formik.errors.email}
            </p>
          )}
      </div>



      {/* =========================
          PASSWORD
      ========================= */}

      <div className="mb-4">

        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"

          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}

          className="border rounded-xl p-2 w-full"
        />
        <button type="button" onClick={handletoggle} className=" -ml-9 absolute  mt-3 w-4  text-amber-600"> {showPassword ? <FiEye /> : <FiEyeOff />}</button>

        {formik.touched.password &&
          formik.errors.password && (
            <p className="text-red-700">
              {formik.errors.password}
            </p>
          )}

      </div>


      <button className="bg-green-600 text-white p-2 rounded-2xl w-full mt-10" type="submit">Login</button>



      <Link
        className="ml-60 mt-5 text-x text-blue-600 underline hover:text-purple-800"
        to="/Signup"
      >
        needs signup ?
      </Link>



















    </form >
  )
}

export default LoginForm
