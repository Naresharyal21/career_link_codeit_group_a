import React from 'react'
import Button from '../commonuiPart/Button'
import { useFormik } from 'formik'
import { loginValidationSchema } from '../accounts/validationSchema'
import useModerator from '../../hooks/useModerator'
import {toast} from "react-toastify"


const AdminLoginform = () => {


  const {adminlogin}=useModerator();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,


    onSubmit: async (values) => {
      try {
        await adminlogin(values);
        const apiBaseUrl = new URL(
          import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
          window.location.origin
        );
        window.location.assign(new URL("/admin/", apiBaseUrl.origin));
      } catch (error) {
        toast.error(error.message || "Login failed!");
      }
    },
  })






  return (
    <div className=' flex w-100 flex-col  justify-around items-center   shadow shadow-blue-600  h-120 rounded-2xl '>
      <h1 className='font-bold text-3xl text-green-700'>Admin Login</h1>

      <form onSubmit={formik.handleSubmit} className='flex w-90  flex-col  '>
        <div className=' mb-10  '>

          <input className='w-full border p-3 rounded-3xl '
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              aria-label="Email address"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email &&
            formik.errors.email && (
              <p className="text-red-700 pl-3">
                {formik.errors.email}
              </p>
            )}
        </div>

        <div className=' mb-20 ' >

          <input className='w-full border p-3 rounded-3xl'
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            aria-label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password &&
            formik.errors.password && (
              <p className="text-red-700 pl-3">
                {formik.errors.password}
              </p>
            )}


        </div>

        <Button className='w-full p-3 mb-5 rounded-3xl' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  )
}

export default AdminLoginform
