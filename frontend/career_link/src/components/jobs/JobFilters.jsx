import React from 'react'

const JobFilters = ({ filters, onChange }) => {
  return (
    <div className="bg-gray-50 shadow shadow-black/12 rounded p-4 w-60">
      <h3 className="font-semibold mb-3">Filters</h3>

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