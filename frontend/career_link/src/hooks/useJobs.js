import useApi from "./useApi";
import { getJobs, getJobById, getSimilarJobs } from "../apis/jobsApi";
import {
  getCategories,
  getSkills,
  getMyJobPostings,
  createJobPosting,
  getJobPostingById,
  updateJobPosting,
  deleteJobPosting,
} from "../apis/employerJobsApi";

const useJobs = () => {
  const { data, loading, error, execute } = useApi();

  const fetchJobs = async () => {
    return await execute(() => getJobs());
  };

  const fetchJobById = async (id) => {
    return await execute(() => getJobById(id));
  };

  const fetchSimilarJobs = async (currentId, limit) => {
    return await execute(() => getSimilarJobs(currentId, limit));
  };

  const fetchCategories = async () => {
    return await execute(() => getCategories());
  };

  const fetchSkills = async () => {
    return await execute(() => getSkills());
  };

  const fetchMyJobPostings = async () => {
    return await execute(() => getMyJobPostings());
  };

  const postJob = async (payload) => {
    return await execute(() => createJobPosting(payload));
  };

  const fetchMyJobPostingById = async (id) => {
    return await execute(() => getJobPostingById(id));
  };

  const editJob = async (id, payload) => {
    return await execute(() => updateJobPosting(id, payload));
  };

  const removeJob = async (id) => {
    return await execute(() => deleteJobPosting(id));
  };

  return {
    data,
    loading,
    error,
    fetchJobs,
    fetchJobById,
    fetchSimilarJobs,
    fetchCategories,
    fetchSkills,
    fetchMyJobPostings,
    postJob,
    fetchMyJobPostingById,
    editJob,
    removeJob,
  };
};

export default useJobs;
