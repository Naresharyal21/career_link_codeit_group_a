import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getJobById, JOB_TYPE_LABELS } from '../apis/jobsApi'

const JobDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    getJobById(id).then((data) => {
      if (!data) {
        setNotFound(true)
      } else {
        setJob(data)
      }
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-6 max-w-3xl animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-8 max-w-3xl text-center">
        <p className="text-gray-700 font-medium">This job posting couldn't be found.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
        >
          Back to Browse Jobs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/jobs')}
        className="text-blue-950 text-sm mb-3 hover:underline cursor-pointer"
      >
        ← Back to Browse Jobs
      </button>

      <div className="bg-gray-50 shadow shadow-black/12 rounded p-6">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="text-gray-600 mt-1">{job.employer?.company_name} • {job.location}</p>

        <div className="flex gap-4 mt-4 text-sm text-gray-700">
          <span>{JOB_TYPE_LABELS[job.job_type]}</span>
          {job.salary_min && job.salary_max && (
            <span>NPR {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}</span>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Job Description</h3>
          <p className="text-gray-700 mt-1">{job.description}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Responsibilities</h3>
          <p className="text-gray-700 mt-1">{job.responsibilities}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Requirements</h3>
          <p className="text-gray-700 mt-1">{job.requirements}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Benefits</h3>
          <p className="text-gray-700 mt-1">{job.benefits}</p>
        </div>

        <button className="mt-6 bg-blue-950 text-white px-6 py-2 rounded hover:bg-blue-900 active:bg-blue-950 transition-colors cursor-pointer">
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default JobDetailPage
