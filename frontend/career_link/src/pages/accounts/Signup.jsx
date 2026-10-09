import React from 'react'
import SignupForm from '../../components/accounts/SignupForm'

const Signup = () => {
  return (
    <div className='flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10'>
      <h1 className='mb-6 text-2xl font-bold text-slate-900'>Create your account</h1>
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">

      <SignupForm />
      </div>
    </div>
  )
}

export default Signup
