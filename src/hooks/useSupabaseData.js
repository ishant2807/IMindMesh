import { useState, useCallback } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/data/materials`);
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/data/tables`);
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const result = await response.json();
      return result.tables || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTableData = useCallback(async (tableName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/data/table/${tableName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${tableName}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchMaterials,
    fetchTables,
    fetchTableData
  };
};
