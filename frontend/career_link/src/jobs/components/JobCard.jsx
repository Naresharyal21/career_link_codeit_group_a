import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineBriefcase } from 'react-icons/hi'
import { FaRupeeSign } from 'react-icons/fa'
import { JOB_TYPE_LABELS } from '../../apis/jobsApi'

const JobCard = ({ job, canSave = false, isSaved = false, saving = false, onToggleSaved }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 mb-4 hover:shadow-md hover:border-gray-300 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.employer_name}</p>
        </div>
        {job.is_urgent && (
          <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-full font-medium whitespace-nowrap">
            Urgent
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
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

      <div className="flex flex-wrap gap-2 mt-3">
        {job.skills?.map((skill) => (
          <span key={skill.name} className="text-xs bg-[#eef2f8] text-[#0f2a52] px-2 py-1 rounded-full">
            {skill.name}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          View details
        </button>
        {canSave && (
          <button
            type="button"
            disabled={saving}
            onClick={onToggleSaved}
            aria-pressed={isSaved}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? "Saving…" : isSaved ? "Saved" : "Save job"}
          </button>
        )}
      </div>
    </div>
  )
}

export default JobCard
