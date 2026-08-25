import { useFormik } from 'formik'
import React, { useState, useContext } from 'react'




import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { loginValidationSchema } from './validationSchema';
import { Link, useNavigate, } from 'react-router';
import useAccounts from '../../hooks/useAccounts';
import { AuthenticationContext } from '../../context/AuthContext';
import Button from '../commonuiPart/Button';




const LoginForm = () => {
  const navigate = useNavigate();

  const { login, loading } = useAccounts();

  const [showPassword, setShowPassword] = useState(false)


  const { loginUser } = useContext(AuthenticationContext);

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

      try {
        const response = await login(values)

        loginUser(
          response.access,
          response.refresh
        );



        navigate("/")


      } catch (err) {


      }
    }

  })






  return (
    <form onSubmit={formik.handleSubmit}>



      <div className="  mb-4  ">

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


      <Button
        type="submit"
        className="w-full mt-7"
      >
        Login
      </Button>

      <div className="flex flex-col items-center ">


        <Link
          className=" mb-8 mt-2 text-x text-blue-600 underline hover:text-purple-800"
          to="/forgetpassword"
        >
          Forget password?
        </Link>
        <hr></hr>
        <Link
          className="bg-blue-600  pl-9 pr-9 -mt-3 text-white p-3    rounded-2xl "
          to="/Signup"
        >
          Signup
        </Link>

      </div>


















    </form >
  )
}

export default LoginForm
