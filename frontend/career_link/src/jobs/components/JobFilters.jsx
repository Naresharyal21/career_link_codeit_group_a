import React from 'react'

const JobFilters = ({ filters, onChange }) => {
  const hasActiveFilters = filters.jobType || filters.location || filters.experience

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 w-full md:w-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ jobType: '', location: '', experience: '' })}
            className="text-sm text-[#0f2a52] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Job Type</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0f2a52] focus:border-[#0f2a52]"
          value={filters.jobType}
          onChange={(e) => onChange({ ...filters, jobType: e.target.value })}
        >
          <option value="">Any</option>
          <option value="FT">Full-time</option>
          <option value="PT">Part-time</option>
          <option value="RM">Remote</option>
          <option value="CT">Contract</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Location</label>
        <input
          type="text"
          placeholder="e.g. Kathmandu"
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0f2a52] focus:border-[#0f2a52]"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Experience Level</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0f2a52] focus:border-[#0f2a52]"
          value={filters.experience}
          onChange={(e) => onChange({ ...filters, experience: e.target.value })}
        >
          <option value="">Any Level</option>
          <option value="EN">Entry Level</option>
          <option value="MD">Mid Level</option>
          <option value="SR">Senior Level</option>
        </select>
      </div>
    </div>
  )
}

export default JobFilters
