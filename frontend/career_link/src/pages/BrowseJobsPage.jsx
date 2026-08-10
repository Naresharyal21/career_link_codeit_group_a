import React, { useEffect, useState } from 'react'
import { getJobs } from '../apis/jobsApi'
import JobList from '../jobs/components/JobList'
import JobFilters from '../jobs/components/JobFilters'

const BrowseJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({ jobType: '', location: '', experience: '' })

  useEffect(() => {
    getJobs().then((data) => {
      setJobs(data)
      setLoading(false)
    })
  }, [])

  const filteredJobs = jobs
    .filter((job) => {
      if (filters.jobType && job.job_type !== filters.jobType) return false
      if (filters.experience && job.experience_level !== filters.experience) return false
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (search) {
        const query = search.toLowerCase()
        const matchesTitle = job.title.toLowerCase().includes(query)
        const matchesCompany = job.employer?.company_name?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesCompany) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      }
      if (sortBy === 'salary_high') {
        return (b.salary_max || 0) - (a.salary_max || 0)
      }
      if (sortBy === 'salary_low') {
        return (a.salary_min || 0) - (b.salary_min || 0)
      }
      return 0
    })

  return (
    <div>
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-4 mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Job title, skills, or company"
          className="flex-1 border rounded p-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-950 text-white px-6 py-2 rounded hover:bg-blue-900 active:bg-blue-950 transition-colors cursor-pointer">
          Search
        </button>
      </div>

      <div className="flex gap-6">
        <JobFilters filters={filters} onChange={setFilters} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Browse Jobs</h2>
            <div className="flex items-center gap-3">
              {!loading && (
                <span className="text-sm text-gray-500">{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found</span>
              )}
              <select
                className="border rounded p-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
              </select>
            </div>
          </div>
          <JobList jobs={filteredJobs} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default BrowseJobsPage
