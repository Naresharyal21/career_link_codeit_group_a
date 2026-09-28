import React, { useEffect, useMemo, useState } from 'react'
import useJobs from '../hooks/useJobs'
import JobList from '../jobs/components/JobList'
import JobFilters from '../jobs/components/JobFilters'
import Trie from '../utils/trie'

const BrowseJobsPage = () => {
  const { data: jobs, loading, error, fetchJobs } = useJobs()
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({ jobType: '', location: '', experience: '' })
  const jobsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)

  const loadJobs = () => {
    fetchJobs().catch(() => {})
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const jobList = jobs || []

  // Build a Trie from job titles and skill names whenever the job list changes.
  const searchTrie = useMemo(() => {
    const trie = new Trie()
    jobList.forEach((job) => {
      if (job.title) trie.insert(job.title)
      job.skills?.forEach((s) => trie.insert(s.name))
    })
    return trie
  }, [jobList])

  const suggestions = useMemo(() => {
    if (!search) return []
    return searchTrie.getSuggestions(search, 6)
  }, [search, searchTrie])

  const handleSuggestionClick = (word) => {
    setSearch(word)
    setShowSuggestions(false)
  }

  const filteredJobs = jobList
    .filter((job) => {
      if (filters.jobType && job.job_type !== filters.jobType) return false
      if (filters.experience && job.experience_level !== filters.experience) return false
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (search) {
        const query = search.toLowerCase()
        const matchesTitle = job.title.toLowerCase().includes(query)
        const matchesCompany = job.employer_name?.toLowerCase().includes(query)
        const matchesSkill = job.skills?.some((s) => s.name.toLowerCase().includes(query))
        if (!matchesTitle && !matchesCompany && !matchesSkill) return false
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

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  const loadPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, sortBy, filters])

  if (error) {
    return (
      <div className="bg-gray-50 shadow shadow-black/12 rounded p-8 text-center">
        <p className="text-red-700 font-medium">Couldn't load jobs.</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
        <button
          onClick={loadJobs}
          className="mt-4 bg-[#0f2a52] text-white px-4 py-2 rounded hover:bg-[#173a6e] transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className='   p-4 '>
      <div className="bg-gray-50   shadow shadow-black/12 rounded p-4 mb-6 flex gap-3 relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Job title, skills, or company"
            className="border rounded p-2 text-sm w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((word) => (
                <li
                  key={word}
                  onMouseDown={() => handleSuggestionClick(word)}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {word}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="bg-[#0f2a52] text-white px-6 py-2 rounded hover:bg-[#173a6e] active:bg-[#0a1d3a] transition-colors cursor-pointer whitespace-nowrap">
          Search
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-auto">
          <JobFilters filters={filters} onChange={setFilters} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">Browse Jobs</h2>
            <div className="flex flex-wrap items-center gap-3">
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
          <JobList jobs={paginatedJobs} loading={loading} />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => loadPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-[#0f2a52] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => loadPage(page)}
                  className={
                    page === currentPage
                      ? 'w-9 h-9 flex items-center justify-center rounded bg-[#0f2a52] text-white font-medium cursor-pointer'
                      : 'w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-[#0f2a52] hover:bg-gray-100 cursor-pointer'
                  }
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => loadPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-[#0f2a52] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowseJobsPage
