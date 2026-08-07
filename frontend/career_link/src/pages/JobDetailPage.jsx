import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getJobById, JOB_TYPE_LABELS } from '../apis/jobsApi'

const JobDetailPage = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobById(id).then((data) => {
      setJob(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!job) return <p className="text-gray-500">Job not found.</p>

  return (
    <div className="bg-gray-50 shadow shadow-black/12 rounded p-6 max-w-3xl">
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

      <button className="mt-6 bg-purple-900 text-white px-6 py-2 rounded hover:bg-purple-800 transition-colors">
        Apply Now
      </button>
    </div>
  )
}

export default JobDetailPage
