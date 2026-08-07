import React, { useEffect, useState } from 'react'
import { getJobs } from '../apis/jobsApi'
import JobList from '../jobs/components/JobList'
import JobFilters from '../jobs/components/JobFilters'

const BrowseJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ jobType: '', location: '', experience: '' })

  useEffect(() => {
    getJobs().then((data) => {
      setJobs(data)
      setLoading(false)
    })
  }, [])

  const filteredJobs = jobs.filter((job) => {
    if (filters.jobType && job.job_type !== filters.jobType) return false
    if (filters.experience && job.experience_level !== filters.experience) return false
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex gap-6">
      <JobFilters filters={filters} onChange={setFilters} />
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Browse Jobs</h2>
        <JobList jobs={filteredJobs} loading={loading} />
      </div>
    </div>
  )
}

export default BrowseJobsPage
