import React from 'react'

const JobFilters = ({ filters, onChange }) => {
  const hasActiveFilters = filters.jobType || filters.location || filters.experience

  return (
    <div className="bg-gray-50 shadow shadow-black/12 rounded p-4 w-full md:w-60">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Filters</h3>
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
        <label className="text-sm font-medium block mb-1">Job Type</label>
        <select
          className="w-full border rounded p-2 text-sm"
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
        <label className="text-sm font-medium block mb-1">Location</label>
        <input
          type="text"
          placeholder="e.g. Kathmandu"
          className="w-full border rounded p-2 text-sm"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Experience Level</label>
        <select
          className="w-full border rounded p-2 text-sm"
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