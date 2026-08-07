import React from 'react'
import JobCard from './JobCard'

const JobList = ({ jobs, loading }) => {
  if (loading) {
    return <p className="text-gray-500">Loading jobs...</p>
  }

  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-500">No jobs found.</p>
  }

  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

export default JobList
