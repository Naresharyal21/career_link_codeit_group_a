import React from 'react'
import { useFormik } from 'formik'
import { verifyresumeaschema } from './validationSchema'
import Button from '../commonuiPart/Button'

const AddResumeForm = ({ onClose }) => {

  const formik = useFormik({

    initialValues: {

      resume_file: "",
    },

    validationSchema: verifyresumeaschema,

    onSubmit: async (values) => {
      console.log(values)
    }
  })


  return (
    <div >
      <form onSubmit={formik.handleSubmit} className='flex flex-col mt-10'>

        <input
          id="resume_file"
          type='file'
          name='resume_file'
          accept='.pdf, .doc,.docx'
          hidden
          onChange={(event) => {
            formik.setFieldValue(
              "resume_file",
              event.currentTarget.files[0]
            );
          }} />
        <label
          htmlFor='resume_file'
          className='cursor-pointer inline-flex item-center p-4 mb-5 bg-blue-50  text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200'>Upload Resume</label>

        <span className="text-xs text-gray-600 truncate max-w-120">
          {formik.values.resume_file
            ? formik.values.resume_file.name
            : "No file chosen"}
        </span>



        <Button
          type="submit"

          className=" px-6 mt-5 py-3 rounded-3xl disabled:opacity-50"
        >
          Add Resume
        </Button>





      </form>
      <Button

        onClick={onClose}
        variant='secondary'

        className=" px-6 w-full mt-5 py-3 rounded-3xl disabled:opacity-50"
      >
        Cancel Process
      </Button>
    </div>
  )
}

export default AddResumeForm 
