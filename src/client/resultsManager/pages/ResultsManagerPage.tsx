import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getRawResults, getProcessedResults } from 'wasp/client/operations';
import { processSessionResults } from 'wasp/client/operations';

export function ResultsManagerPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [viewProcessed, setViewProcessed] = useState(false);
  
  const rawResultsQuery = useQuery(getRawResults, { sessionId: sessionId! });
  const processedResultsQuery = useQuery(getProcessedResults, { 
    sessionId: sessionId!,
    includeTagged: true
  });
  
  if (!sessionId) {
    return <div className="p-4 text-red-500">Session ID is required</div>;
  }
  
  if (rawResultsQuery.isLoading || processedResultsQuery.isLoading) {
    return <div className="p-4">Loading results...</div>;
  }
  
  if (rawResultsQuery.error || processedResultsQuery.error) {
    return (
      <div className="p-4 text-red-500">
        Error: {rawResultsQuery.error?.message || processedResultsQuery.error?.message}
      </div>
    );
  }
  
  const rawResults = rawResultsQuery.data || [];
  const processedResults = processedResultsQuery.data || [];
  const unprocessedCount = rawResults.filter(r => !r.processedResult).length;
  
  const handleProcessResults = async () => {
    if (unprocessedCount === 0) {
      alert('No new results to process');
      return;
    }
    
    try {
      setIsProcessing(true);
      setProcessingResult(null);
      
      const result = await processSessionResults({ sessionId });
      setProcessingResult(result);
      
      // Refresh the queries
      rawResultsQuery.refetch();
      processedResultsQuery.refetch();
    } catch (error) {
      console.error('Failed to process results:', error);
      alert(`Failed to process results: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Results Manager</h1>
      
      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Results Overview</h2>
            <p className="text-gray-600">
              {rawResults.length} raw results ({unprocessedCount} unprocessed) 
              • {processedResults.length} processed results
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setViewProcessed(!viewProcessed)}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              View {viewProcessed ? 'Raw' : 'Processed'} Results
            </button>
            
            <button
              onClick={handleProcessResults}
              disabled={isProcessing || unprocessedCount === 0}
              className={`px-4 py-2 rounded text-white ${
                unprocessedCount === 0 || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isProcessing ? 'Processing...' : `Process ${unprocessedCount} Results`}
            </button>
          </div>
        </div>
        
        {processingResult && (
          <div className="bg-green-50 border border-green-200 p-3 rounded mb-4">
            <p className="text-green-800">{processingResult.message}</p>
          </div>
        )}
      </div>
      
      {viewProcessed ? (
        <ProcessedResultsList results={processedResults} />
      ) : (
        <RawResultsList results={rawResults} />
      )}
    </div>
  );
}

function RawResultsList({ results }) {
  if (results.length === 0) {
    return <div className="text-gray-500">No raw results found.</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Raw Search Results</h2>
      
      <div className="grid gap-4">
        {results.map(result => (
          <div 
            key={result.id}
            className={`border rounded p-4 ${
              result.processedResult ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <h3 className="text-lg font-medium mb-1">
              <a 
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {result.title}
              </a>
              {result.processedResult && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Processed
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{result.url}</p>
            {result.snippet && <p className="text-sm mb-2">{result.snippet}</p>}
            <div className="text-xs text-gray-500">
              <span>Query: "{result.searchQuery.query}"</span>
              <span className="ml-3">Rank: {result.rank}</span>
              <span className="ml-3">Source: {result.searchEngine}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessedResultsList({ results }) {
  if (results.length === 0) {
    return <div className="text-gray-500">No processed results found.</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Processed Results</h2>
      
      <div className="grid gap-4">
        {results.map(result => (
          <div 
            key={result.id}
            className="border rounded p-4 bg-white"
          >
            <h3 className="text-lg font-medium mb-1">
              <a 
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {result.title}
              </a>
              {result.reviewTags.length > 0 && (
                <div className="inline-flex ml-2 gap-1">
                  {result.reviewTags.map(tag => (
                    <span 
                      key={tag.id}
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: `${tag.tag.color}20`,
                        color: tag.tag.color
                      }}
                    >
                      {tag.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{result.url}</p>
            {result.snippet && <p className="text-sm mb-2">{result.snippet}</p>}
            <div className="text-xs text-gray-500">
              <span>Domain: {result.metadata.domain}</span>
              <span className="ml-3">Type: {result.metadata.fileType}</span>
              <span className="ml-3">Source: {result.rawSearchResult.searchEngine}</span>
            </div>
            
            {result.notes.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs font-medium text-gray-700">Notes:</p>
                {result.notes.map(note => (
                  <p key={note.id} className="text-xs mt-1 text-gray-600">
                    {note.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 