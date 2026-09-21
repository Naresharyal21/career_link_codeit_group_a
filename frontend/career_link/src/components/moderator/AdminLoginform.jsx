import React from 'react'
import Button from '../commonuiPart/Button'
import { useFormik } from 'formik'
import { loginValidationSchema } from '../accounts/validationSchema'

const AdminLoginform = () => {

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      console.log(values)
    }
  })






  return (
    <div className=' flex w-100 flex-col  justify-around items-center   shadow shadow-blue-600  h-120 rounded-2xl '>
      <h1 className='font-bold text-3xl text-green-700'>Admin Login</h1>

      <form onSubmit={formik.handleSubmit} className='flex w-90  flex-col  '>
        <div className=' mb-10  '>

          <input className='w-90 border p-3 rounded-3xl '
            type="email"
            name="email"
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

          <input className='w-90 border p-3 rounded-3xl'
            type="password"
            name="password"
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

        <Button className=' p-3 mb-5 rounded-3xl' type="submit">
          Login
        </Button>
      </form>
    </div>
  )
}

export default AdminLoginform
