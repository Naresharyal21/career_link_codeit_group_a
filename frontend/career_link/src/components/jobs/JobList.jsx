import React from 'react'
import JobCard from './Jobcard'

const SkeletonCard = () => (
  <div className="bg-gray-50 shadow shadow-black/12 rounded p-4 mb-4 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="h-9 bg-gray-200 rounded w-28"></div>
  </div>
)

const JobList = ({ jobs, loading }) => {
  if (loading) {
    return (
      <div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-8 text-center">
        <p className="text-gray-600 font-medium">No jobs match your filters.</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
      </div>
    )
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