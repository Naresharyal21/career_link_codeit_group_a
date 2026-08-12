import React from 'react'
import SignupForm from '../../components/accounts/SignupForm'

const Signup = () => {
  return (
    <div className='flex flex-col items-center  '>
      <h1 className='mt-4 mb-4 text-xl text-blue-600'>Create account</h1>
      <div className=" w-150 bg-gray-50 p-8   border-b-cyan-600 rounded-4xl  shadow shadow-blue-600">

      <SignupForm />
      </div>
    </div>
  )
}

export default Signup
