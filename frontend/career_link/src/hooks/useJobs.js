import useApi from "./useApi";
import { getJobs, getJobById, getSimilarJobs } from "../apis/jobsApi";
import {
  getCategories,
  getSkills,
  getMyJobPostings,
  createJobPosting,
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
  };
};

export default useJobs;
