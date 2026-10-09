import React from 'react'
import LoginForm from '../../components/accounts/LoginForm'


const Login = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10'>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
         <h1 className='mb-6 text-center text-2xl font-bold text-slate-900'>Welcome back</h1>
       <LoginForm/>
       </div>
    </div>
  )
}

export default Login
