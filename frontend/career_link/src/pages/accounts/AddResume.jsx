import React from 'react'

import AddResumeForm from '../../components/accounts/AddResumeForm'
import Button from '../../components/commonuiPart/Button'

const AddResume = ({onClose}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center '>
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <Button
          type="button"
          onClick={onClose}
          variant="closeButton"
          aria-label="Close resume dialog"
        >
          <span aria-hidden="true" className="font-bold">×</span>
        </Button>
        <h2 className="mb-5 pr-8 text-xl font-semibold text-slate-900">Upload your resume</h2>
        <AddResumeForm onClose={onClose} />
      </div>
    </div>
  )
}

export default AddResume
