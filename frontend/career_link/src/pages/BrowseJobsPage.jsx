import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useJobs from '../hooks/useJobs'
import JobList from '../jobs/components/JobList'
import JobFilters from '../jobs/components/JobFilters'
import Trie from '../utils/trie'
import apiClient from '../apis/apiClient'
import { AuthenticationContext } from '../context/AuthContext'

const BrowseJobsPage = () => {
  const { data: jobs, loading, error, fetchJobs } = useJobs()
  const { isAuthenticated, user } = useContext(AuthenticationContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || searchParams.get('category') || ''
  const [search, setSearch] = useState(initialSearch)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({
    jobType: '',
    location: searchParams.get('location') || '',
    experience: '',
  })
  const jobsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [savedJobs, setSavedJobs] = useState([])
  const [savedJobsUserId, setSavedJobsUserId] = useState(null)
  const [savingJobId, setSavingJobId] = useState(null)
  const [saveError, setSaveError] = useState('')

  const loadJobs = useCallback(() => {
    fetchJobs().catch(() => {})
  }, [fetchJobs])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'js') {
      return
    }
    let active = true
    apiClient.get('/applications/saved-jobs/')
      .then((response) => {
        if (active) {
          const items = Array.isArray(response) ? response : response?.results || []
          setSavedJobs(items.map((item) => Number(item.job)))
          setSavedJobsUserId(user.id)
        }
      })
      .catch((requestError) => {
        if (active) setSaveError(requestError.message || 'Could not load saved jobs.')
      })
    return () => {
      active = false
    }
  }, [isAuthenticated, user?.id, user?.role])

  const jobList = useMemo(() => jobs || [], [jobs])
  const visibleSavedJobs = savedJobsUserId === user?.id ? savedJobs : []

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
    setCurrentPage(1)
    setSearchInput(word)
    setSearch(word)
    setShowSuggestions(false)
  }

  const filteredJobs = jobList
    .filter((job) => {
      if (filters.jobType && job.job_type !== filters.jobType) return false
      if (filters.experience && job.experience_level !== filters.experience) return false
      if (filters.location && !(job.location || '').toLowerCase().includes(filters.location.toLowerCase())) return false
      if (search) {
        const query = search.toLowerCase()
        const matchesTitle = (job.title || '').toLowerCase().includes(query)
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

  const toggleSavedJob = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    setSavingJobId(jobId)
    setSaveError('')
    try {
      const response = await apiClient.post('/applications/saved-jobs/toggle/', { job_id: jobId })
      setSavedJobsUserId(user.id)
      setSavedJobs((current) => response.saved
        ? [...new Set([...current, Number(jobId)])]
        : current.filter((id) => id !== Number(jobId)))
    } catch (requestError) {
      setSaveError(requestError.message || 'Could not update saved jobs.')
    } finally {
      setSavingJobId(null)
    }
  }

  const submitSearch = (event) => {
    event.preventDefault()
    setCurrentPage(1)
    setSearch(searchInput.trim())
    setShowSuggestions(false)
  }

  const handleFilterChange = (nextFilters) => {
    setCurrentPage(1)
    setFilters(nextFilters)
  }

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
      <form onSubmit={submitSearch} className="relative mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            aria-label="Search job title, skills, or company"
            placeholder="Job title, skills, or company"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((word) => (
                <li key={word}>
                  <button
                    type="button"
                    onMouseDown={() => handleSuggestionClick(word)}
                    className="w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {word}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="whitespace-nowrap rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
          Search
        </button>
      </form>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-auto">
          <JobFilters filters={filters} onChange={handleFilterChange} />
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
                onChange={(e) => {
                  setCurrentPage(1)
                  setSortBy(e.target.value)
                }}
              >
                <option value="newest">Newest First</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="salary_low">Salary: Low to High</option>
              </select>
            </div>
          </div>
          {saveError && (
            <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {saveError}
            </p>
          )}
          <JobList
          jobs={paginatedJobs}
          loading={loading}
          canSaveJobs={user?.role === 'js'}
          savedJobs={visibleSavedJobs}
          savingJobId={savingJobId}
          onToggleSavedJob={toggleSavedJob}
          />

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
