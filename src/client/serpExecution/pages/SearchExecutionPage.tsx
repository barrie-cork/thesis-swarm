import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSearchSession, getSearchExecutions } from 'wasp/client/operations';
import { MainLayout } from '../../shared/components/MainLayout';
import { SearchEngineSelector } from '../components/SearchEngineSelector';
import { useSearchExecution } from '../hooks/useSearchExecution';

export function SearchExecutionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [maxResults, setMaxResults] = useState(100);

  // Get session details
  const { data: session, isLoading: isLoadingSession, error: sessionError } = 
    useQuery(getSearchSession, { id: sessionId });

  // Use our custom hook for search execution
  const {
    queries,
    isLoading: isLoadingQueries,
    selectedQueryId,
    setSelectedQueryId,
    selectedEngines,
    setSelectedEngines,
    isExecuting,
    executionError,
    executionSuccess,
    executeSearch
  } = useSearchExecution(sessionId);

  // Get executions for this session
  const { data: executions, isLoading: isLoadingExecutions } = 
    useQuery(getSearchExecutions, { sessionId });

  const handleExecuteSearch = async () => {
    await executeSearch();
  };

  if (isLoadingSession || isLoadingQueries) {
    return (
      <MainLayout>
        <div className="p-4">
          <div className="animate-pulse bg-gray-200 h-8 w-48 mb-4 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-24 w-full rounded"></div>
        </div>
      </MainLayout>
    );
  }

  if (sessionError) {
    return (
      <MainLayout>
        <div className="p-4">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Error loading session: {sessionError.message}
          </div>
          <Link 
            to="/search-strategy" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Search Strategy
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">{session?.name}</h1>
            <p className="text-gray-600">{session?.description}</p>
          </div>
          <Link 
            to="/search-strategy" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Search Strategy
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Execute Search Query</h2>
          
          {queries && queries.length > 0 ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Query
                </label>
                <select
                  value={selectedQueryId || ''}
                  onChange={(e) => setSelectedQueryId(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {queries.map((query) => (
                    <option key={query.id} value={query.id}>
                      {query.query}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Results
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-6">
                <SearchEngineSelector
                  onSelect={setSelectedEngines}
                  selectedEngines={selectedEngines}
                />
              </div>

              <button
                onClick={handleExecuteSearch}
                disabled={isExecuting || !selectedQueryId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isExecuting ? 'Executing...' : 'Execute Search'}
              </button>

              {executionError && (
                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
                  {executionError}
                </div>
              )}

              {executionSuccess && (
                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded">
                  Search executed successfully!
                </div>
              )}
            </>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
              <p>
                No queries available for this session. 
                <Link 
                  to={`/search-strategy`} 
                  className="ml-1 text-blue-600 hover:underline"
                >
                  Create a query
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Execution History</h2>
          
          {isLoadingExecutions ? (
            <div className="animate-pulse space-y-4">
              <div className="bg-gray-200 h-12 rounded"></div>
              <div className="bg-gray-200 h-12 rounded"></div>
            </div>
          ) : executions && executions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Results
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {executions.map((execution) => {
                    const query = queries?.find((q) => q.id === execution.queryId);
                    const duration = execution.endTime 
                      ? new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime() 
                      : null;
                    
                    return (
                      <tr key={execution.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {query?.query || 'Unknown query'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${execution.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              execution.status === 'running' ? 'bg-blue-100 text-blue-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {execution.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(execution.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {duration !== null ? `${Math.round(duration / 1000)}s` : 'In progress'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {execution.resultCount || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {execution.status === 'completed' && (
                            <Link
                              to={`/results/${sessionId}`}
                              className="text-blue-600 hover:underline"
                            >
                              View Results
                            </Link>
                          )}
                          {execution.status === 'failed' && execution.error && (
                            <span className="text-red-600" title={execution.error}>
                              Error
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No executions found for this session.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 