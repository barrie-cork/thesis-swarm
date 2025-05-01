import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { executeSearchQuery } from 'wasp/client/operations';
import getSearchQueries from 'wasp/client/queries/getSearchQueries';

export function useSearchExecution(sessionId: string) {
  const [selectedEngines, setSelectedEngines] = useState<string[]>(['google', 'pubmed']);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  const { data: queries, isLoading, error } = useQuery(getSearchQueries, { sessionId });

  const executeSearch = async () => {
    if (!selectedQueryId) {
      setExecutionError('Please select a query to execute');
      return;
    }

    if (selectedEngines.length === 0) {
      setExecutionError('Please select at least one search engine');
      return;
    }

    setIsExecuting(true);
    setExecutionError(null);
    setExecutionSuccess(false);

    try {
      await executeSearchQuery({
        queryId: selectedQueryId,
        sessionId,
        searchEngines: selectedEngines
      });
      setExecutionSuccess(true);
    } catch (error) {
      setExecutionError(error.message || 'An error occurred during search execution');
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    queries,
    isLoading,
    error,
    selectedQueryId,
    setSelectedQueryId,
    selectedEngines,
    setSelectedEngines,
    isExecuting,
    executionError,
    executionSuccess,
    executeSearch
  };
} 