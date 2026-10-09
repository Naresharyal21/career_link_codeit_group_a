const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  ...buttonProps

}) => {

  const variants = {
    primary: "bg-[#6C4DFF] text-white hover:bg-[#5738E8] shadow-sm hover:shadow-md",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
    gray: "border border-slate-200 bg-slate-100 text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
    outline: "border border-violet-300 bg-white text-violet-700 hover:border-violet-400 hover:bg-violet-50",
    logout: "w-full bg-transparent text-slate-700 hover:bg-violet-50 hover:text-violet-700",
    closeButton: "absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center bg-transparent text-slate-400 hover:bg-red-50 hover:text-red-600"

  }


  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-button-variant={variant}
      {...buttonProps}
      className={`inline-flex items-center justify-center gap-2 rounded-xl p-2 font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:opacity-70 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
