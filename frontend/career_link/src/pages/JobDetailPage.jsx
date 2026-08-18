import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getJobById, getSimilarJobs, JOB_TYPE_LABELS } from '../apis/jobsApi'

const JobDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  const loadJob = () => {
    setLoading(true)
    setNotFound(false)
    setError(null)
    getJobById(id)
      .then((data) => {
        if (!data) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setJob(data)
        return getSimilarJobs(data).then((similar) => {
          setSimilarJobs(similar)
          setLoading(false)
        })
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while loading this job.')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadJob()
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

  if (error) {
    return (
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-8 max-w-3xl text-center">
        <p className="text-red-700 font-medium">Couldn't load this job.</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
        <button
          onClick={loadJob}
          className="mt-4 bg-[#0f2a52] text-white px-4 py-2 rounded hover:bg-[#173a6e] transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-8 max-w-3xl text-center">
        <p className="text-gray-700 font-medium">This job posting couldn't be found.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 bg-[#0f2a52] text-white px-4 py-2 rounded hover:bg-[#173a6e] transition-colors"
        >
          Back to Browse Jobs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <button
        onClick={() => navigate('/jobs')}
        className="text-[#0f2a52] text-sm mb-3 hover:underline cursor-pointer"
      >
        ← Back to Browse Jobs
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="bg-gray-50 shadow shadow-black/12 rounded p-6 flex-1 w-full min-w-0">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600 mt-1">{job.employer_name} • {job.location}</p>

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

          <button className="mt-6 bg-[#0f2a52] text-white px-6 py-2 rounded hover:bg-[#173a6e] active:bg-[#0a1d3a] transition-colors cursor-pointer">
            Apply Now
          </button>
        </div>

        {similarJobs.length > 0 && (
          <div className="w-full md:w-72 shrink-0">
            <h3 className="font-semibold mb-3">Similar Jobs</h3>
            <div className="space-y-3">
              {similarJobs.map((sj) => (
                <div
                  key={sj.id}
                  onClick={() => navigate(`/jobs/${sj.id}`)}
                  className="bg-gray-50 shadow shadow-black/12 rounded p-3 cursor-pointer hover:shadow-md hover:shadow-black/20 transition-shadow"
                >
                  <h4 className="font-medium text-sm">{sj.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{sj.employer_name}</p>
                  {sj.salary_min && sj.salary_max && (
                    <p className="text-xs text-gray-500 mt-1">
                      NPR {sj.salary_min.toLocaleString()} - {sj.salary_max.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetailPage
