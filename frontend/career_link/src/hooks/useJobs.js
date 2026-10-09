import { useCallback } from "react";
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

  const fetchJobs = useCallback(async () => {
    return await execute(() => getJobs());
  }, [execute]);

  const fetchJobById = useCallback(async (id) => {
    return await execute(() => getJobById(id));
  }, [execute]);

  const fetchSimilarJobs = useCallback(async (currentId, limit) => {
    return await execute(() => getSimilarJobs(currentId, limit));
  }, [execute]);

  const fetchCategories = useCallback(async () => {
    return await execute(() => getCategories());
  }, [execute]);

  const fetchSkills = useCallback(async () => {
    return await execute(() => getSkills());
  }, [execute]);

  const fetchMyJobPostings = useCallback(async () => {
    return await execute(() => getMyJobPostings());
  }, [execute]);

  const postJob = useCallback(async (payload) => {
    return await execute(() => createJobPosting(payload));
  }, [execute]);

  const fetchMyJobPostingById = useCallback(async (id) => {
    return await execute(() => getJobPostingById(id));
  }, [execute]);

  const editJob = useCallback(async (id, payload) => {
    return await execute(() => updateJobPosting(id, payload));
  }, [execute]);

  const removeJob = useCallback(async (id) => {
    return await execute(() => deleteJobPosting(id));
  }, [execute]);

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
