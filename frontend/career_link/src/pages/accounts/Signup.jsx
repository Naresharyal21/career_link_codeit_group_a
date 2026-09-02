import React from 'react'
import SignupForm from '../../components/accounts/SignupForm'

const Signup = () => {
  return (
    <div className='flex flex-col items-center bg-blue-100 h-screen  '>
      <h1 className='mt-20 mb-6 text-xl text-blue-600'>Create account</h1>
      <div className=" w-150 bg-blue-100 p-8   border-b-cyan-600 rounded-4xl  shadow shadow-blue-600">

      <SignupForm />
      </div>
    </div>
  )
}

export default Signup
