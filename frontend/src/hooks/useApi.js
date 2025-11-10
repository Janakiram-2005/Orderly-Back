import { useState, useEffect } from 'react';

/**
 * A custom hook to handle API calls.
 * @param {Function} apiService - The function that makes the API call (e.g., fetchPendingRestaurants).
 * @param {Object} options - Configuration options.
 * @param {boolean} options.fetchOnMount - Whether to fetch data when the component mounts. (default: true)
 */
const useApi = (apiService, options = { fetchOnMount: true }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * The main request function to trigger the API call.
   * Can be called manually (e.g., on a button click).
   * @param  {...any} args - Arguments to pass to the apiService function.
   */
  const request = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // If fetchOnMount is true, call the request function when the hook is first used.
  useEffect(() => {
    if (options.fetchOnMount) {
      request();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    data,
    loading,
    error,
    request, // Expose the request function so components can call it manually
  };
};

export default useApi;