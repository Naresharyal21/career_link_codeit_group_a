import React from 'react'
import { useNavigate } from 'react-router'
import { JOB_TYPE_LABELS } from '../../apis/jobsApi'

const JobCard = ({ job }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 shadow shadow-black/12 rounded p-4 mb-4 hover:shadow-md hover:shadow-black/20 transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-black">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.employer?.company_name}</p>
        </div>
        {job.is_urgent && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">Urgent</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-700">
        <span>{job.location}</span>
        <span className="text-gray-300">•</span>
        <span>{JOB_TYPE_LABELS[job.job_type]}</span>
        {job.salary_min && job.salary_max && (
          <>
            <span className="text-gray-300">•</span>
            <span>NPR {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}</span>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {job.skills?.map((skill) => (
          <span key={skill.name} className="text-xs bg-blue-50 text-blue-900 px-2 py-1 rounded">
            {skill.name}
          </span>
        ))}
      </div>

      <button
        onClick={() => navigate(`/jobs/${job.id}`)}
        className="mt-4 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-900 active:bg-blue-950 transition-colors cursor-pointer"
      >
        View Details
      </button>
    </div>
  )
}

export default JobCard
