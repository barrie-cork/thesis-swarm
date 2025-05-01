import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSearchSession, getProcessedResults, processSessionResults } from 'wasp/client/operations';
import { MainLayout } from '../../shared/components/MainLayout';

interface FilterState {
  searchTerm: string;
  sortBy: 'relevance' | 'title' | 'date';
  sortOrder: 'asc' | 'desc';
  domains: string[];
  fileTypes: string[];
}

export function ResultsManagerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    domains: [],
    fileTypes: []
  });

  // Get session details
  const { data: session, isLoading: isLoadingSession, error: sessionError } = 
    useQuery(getSearchSession, { id: sessionId });

  // Get processed results
  const { 
    data: results, 
    isLoading: isLoadingResults, 
    error: resultsError,
    refetch: refetchResults 
  } = useQuery(getProcessedResults, { sessionId });

  // Process raw results
  const handleProcessResults = async () => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      await processSessionResults({ sessionId });
      await refetchResults();
    } catch (error: any) {
      setProcessingError(error.message || 'Failed to process results');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter results
  const filteredResults = React.useMemo(() => {
    if (!results) return [];
    
    return results.filter(result => {
      // Search term filter
      if (filters.searchTerm && 
          !result.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !result.snippet?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Domain filter
      if (filters.domains.length > 0) {
        const domain = new URL(result.url).hostname;
        if (!filters.domains.includes(domain)) {
          return false;
        }
      }
      
      // File type filter
      if (filters.fileTypes.length >
          0) {
        const fileType = result.url.split('.').pop() || '';
        if (!filters.fileTypes.includes(fileType)) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by selected field
      if (filters.sortBy === 'title') {
        return filters.sortOrder === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      }
      
      // For demo purposes, let's assume there's a relevance score in metadata
      if (filters.sortBy === 'relevance') {
        const scoreA = a.metadata.relevanceScore || 0;
        const scoreB = b.metadata.relevanceScore || 0;
        return filters.sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
      
      // Default sort is by processed date (from metadata)
      const dateA = a.metadata.processedAt ? new Date(a.metadata.processedAt).getTime() : 0;
      const dateB = b.metadata.processedAt ? new Date(b.metadata.processedAt).getTime() : 0;
      return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [results, filters]);

  // Get unique domains and file types for filters
  const uniqueDomains = React.useMemo(() => {
    if (!results) return [];
    const domains = results.map(result => {
      try {
        return new URL(result.url).hostname;
      } catch (e) {
        return '';
      }
    }).filter(Boolean);
    return [...new Set(domains)];
  }, [results]);

  const uniqueFileTypes = React.useMemo(() => {
    if (!results) return [];
    const fileTypes = results.map(result => result.url.split('.').pop() || '').filter(Boolean);
    return [...new Set(fileTypes)];
  }, [results]);

  // Update filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => {
      // If clicking the same sort field, toggle order
      if (prev.sortBy === sortBy) {
        return { ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' };
      }
      // Otherwise, set the new sort field with default desc order
      return { ...prev, sortBy, sortOrder: 'desc' };
    });
  };

  const toggleDomainFilter = (domain: string) => {
    setFilters(prev => {
      const isSelected = prev.domains.includes(domain);
      return {
        ...prev,
        domains: isSelected 
          ? prev.domains.filter(d => d !== domain)
          : [...prev.domains, domain]
      };
    });
  };

  const toggleFileTypeFilter = (fileType: string) => {
    setFilters(prev => {
      const isSelected = prev.fileTypes.includes(fileType);
      return {
        ...prev,
        fileTypes: isSelected 
          ? prev.fileTypes.filter(ft => ft !== fileType)
          : [...prev.fileTypes, fileType]
      };
    });
  };

  if (isLoadingSession) {
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
            <h1 className="text-2xl font-bold mb-1">{session?.name} - Results</h1>
            <p className="text-gray-600">{session?.description}</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to={`/search-execution/${sessionId}`}
              className="text-blue-600 hover:underline"
            >
              ← Back to Search Execution
            </Link>
            <Link 
              to={`/review/${sessionId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Review Results →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Results Processing</h2>
            <button
              onClick={handleProcessResults}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Process Raw Results'}
            </button>
          </div>
          
          {processingError && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
              {processingError}
            </div>
          )}
          
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Processing Pipeline:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Raw results retrieval from search API</li>
              <li>Result normalization and metadata extraction</li>
              <li>URL normalization for consistency</li>
              <li>Basic deduplication based on URL</li>
              <li>Storing processed results for review</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Processed Results</h2>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search filter */}
            <div className="col-span-3 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Results
              </label>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={handleSearchChange}
                placeholder="Search within results..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Sort selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => handleSortChange('relevance')}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                    filters.sortBy === 'relevance' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Relevance
                </button>
                <button
                  onClick={() => handleSortChange('title')}
                  className={`px-3 py-2 text-sm font-medium ${
                    filters.sortBy === 'title' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Title
                </button>
                <button
                  onClick={() => handleSortChange('date')}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                    filters.sortBy === 'date' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Date
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter pills */}
          {(filters.domains.length > 0 || filters.fileTypes.length > 0) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.domains.map(domain => (
                <span 
                  key={domain}
                  onClick={() => toggleDomainFilter(domain)}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md flex items-center cursor-pointer"
                >
                  {domain}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </span>
              ))}
              
              {filters.fileTypes.map(fileType => (
                <span 
                  key={fileType}
                  onClick={() => toggleFileTypeFilter(fileType)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md flex items-center cursor-pointer"
                >
                  .{fileType}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </span>
              ))}
              
              <span 
                onClick={() => setFilters(prev => ({ ...prev, domains: [], fileTypes: [] }))}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md flex items-center cursor-pointer"
              >
                Clear All
              </span>
            </div>
          )}
          
          {/* Results display */}
          {isLoadingResults ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ) : resultsError ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              Error loading results: {resultsError.message}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-6">
              {filteredResults.map(result => {
                const domain = (() => {
                  try {
                    return new URL(result.url).hostname;
                  } catch (e) {
                    return '';
                  }
                })();
                
                const fileType = result.url.split('.').pop() || '';
                
                return (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="text-lg font-medium text-blue-600 mb-1">
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {result.title}
                      </a>
                    </h3>
                    <div className="text-sm text-gray-500 mb-2 flex items-center">
                      <span 
                        className="text-xs cursor-pointer hover:underline mr-2"
                        onClick={() => toggleDomainFilter(domain)}
                      >
                        {domain}
                      </span>
                      {fileType && (
                        <span 
                          className="text-xs bg-gray-100 px-1 rounded cursor-pointer hover:bg-gray-200"
                          onClick={() => toggleFileTypeFilter(fileType)}
                        >
                          .{fileType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.snippet}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <div>
                        {result.metadata.processedAt && 
                          `Processed: ${new Date(result.metadata.processedAt).toLocaleString()}`
                        }
                      </div>
                      <div>
                        {result.metadata.duplicateCount > 0 && 
                          `${result.metadata.duplicateCount} duplicate(s)`
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {results && results.length > 0
                  ? 'No results match your filters'
                  : 'No processed results found. Try processing the raw results first.'}
              </p>
            </div>
          )}
          
          {/* Filter sidebar */}
          {(uniqueDomains.length > 0 || uniqueFileTypes.length > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {uniqueDomains.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Domain</h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {uniqueDomains.map(domain => (
                        <label key={domain} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={filters.domains.includes(domain)}
                            onChange={() => toggleDomainFilter(domain)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">{domain}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {uniqueFileTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by File Type</h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {uniqueFileTypes.map(fileType => (
                        <label key={fileType} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={filters.fileTypes.includes(fileType)}
                            onChange={() => toggleFileTypeFilter(fileType)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">.{fileType}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 