import React from 'react'
import LoginForm from '../../components/accounts/LoginForm'

const Login = () => {
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
      
      <div className=" w-100 h-100 bg-gray-50 border-b-cyan-600 rounded-4xl  shadow shadow-blue-600 pt-15 p-4">
         <h1 className=' mb-6 -mt-9 pl-[40%] text-xl text-blue-600'>Login</h1>
       <LoginForm/>
       </div>
    </div>
  )
}

export default Login
