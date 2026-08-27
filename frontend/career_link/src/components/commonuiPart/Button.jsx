import React from 'react'

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  className = "",


}) => {

  const variants = {
    primary: "bg-green-600 hover:bg-green-700",
    secondary: "bg-blue-600 text-white  hover:bg-blue-700",
    danger: "bg-red-600 text-white  hover:bg-red-700",
    gray: "bg-gray-200 text-gray-700  hover:bg-gray-300   dark:border-gray-600 dark:hover:bg-gray-700 ",
    outline: "border border-green-600 text-green-600 hover:bg-green-50",
    logout: "w-full p-2 hover:bg-purple-900 hover:text-white cursor-pointer",
    closeButton:"absolute right-8 top-4 text-xl text-gray-500 hover:text-red-500 hover:cursor-pointer"

  }


  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]}
      p-2 rounded-2xl disabled:bg-gray-400 disabled:opacity-50
      ${className}`}     >
      {children}
    </button>
  )
}

export default Button
