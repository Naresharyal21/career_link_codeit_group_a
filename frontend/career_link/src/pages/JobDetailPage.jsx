import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineArrowLeft } from 'react-icons/hi'
import { FaRupeeSign } from 'react-icons/fa'
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
        return getSimilarJobs(id).then((similar) => {
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-3xl animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-3xl text-center">
        <p className="text-red-700 font-medium">Couldn't load this job.</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
        <button
          onClick={loadJob}
          className="mt-4 bg-[#0f2a52] text-white px-4 py-2 rounded-md hover:bg-[#173a6e] transition-colors cursor-pointer text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-3xl text-center">
        <p className="text-gray-700 font-medium">This job posting couldn't be found.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 bg-[#0f2a52] text-white px-4 py-2 rounded-md hover:bg-[#173a6e] transition-colors cursor-pointer text-sm font-medium"
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
        className="flex items-center gap-1 text-[#0f2a52] text-sm mb-4 hover:underline cursor-pointer"
      >
        <HiOutlineArrowLeft />
        Back to Browse Jobs
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 flex-1 w-full min-w-0">
          <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
          <p className="text-gray-500 mt-1">{job.employer_name}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <HiOutlineLocationMarker className="text-gray-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineBriefcase className="text-gray-400" />
              {JOB_TYPE_LABELS[job.job_type]}
            </span>
            {job.salary_min && job.salary_max && (
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <FaRupeeSign className="text-gray-400" />
                NPR {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900">Job Description</h3>
            <p className="text-gray-600 mt-1.5 leading-relaxed">{job.description}</p>
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-gray-900">Responsibilities</h3>
            <p className="text-gray-600 mt-1.5 leading-relaxed">{job.responsibilities}</p>
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-gray-900">Requirements</h3>
            <p className="text-gray-600 mt-1.5 leading-relaxed">{job.requirements}</p>
          </div>

          <div className="mt-5">
            <h3 className="font-semibold text-gray-900">Benefits</h3>
            <p className="text-gray-600 mt-1.5 leading-relaxed">{job.benefits}</p>
          </div>

          <button className="mt-6 bg-[#0f2a52] text-white px-6 py-2.5 rounded-md hover:bg-[#173a6e] active:bg-[#0a1d3a] transition-colors cursor-pointer text-sm font-medium">
            Apply Now
          </button>
        </div>

        {similarJobs.length > 0 && (
          <div className="w-full md:w-72 shrink-0">
            <h3 className="font-semibold text-gray-900 mb-3">Similar Jobs</h3>
            <div className="space-y-3">
              {similarJobs.map((sj) => (
                <div
                  key={sj.id}
                  onClick={() => navigate(`/jobs/${sj.id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <h4 className="font-medium text-sm text-gray-900">{sj.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{sj.employer_name}</p>
                  {sj.salary_min && sj.salary_max && (
                    <p className="text-xs text-gray-600 font-medium mt-1 flex items-center gap-1">
                      <FaRupeeSign className="text-gray-400" />
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
