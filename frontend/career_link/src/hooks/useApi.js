import React, { useState } from "react";

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiFunction) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFunction();

      setData(result);

      return result;
    } catch (err) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi;
