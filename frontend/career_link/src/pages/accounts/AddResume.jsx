import React from 'react'

import AddResumeForm from '../../components/accounts/AddResumeForm'
import Button from '../../components/commonuiPart/Button'

const AddResume = ({onClose}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center '>
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
 <Button
          type='button'
          onClick={onClose}
          variant='closeButton'><h2 className='font-bold -mt-1 '>X</h2></Button>


      <AddResumeForm/>
      </div>
    </div>
  )
}

export default AddResume
