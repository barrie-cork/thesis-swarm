import React from 'react';
import { ProcessedResult } from 'wasp/entities';
import { FilterState } from '../types';

interface ResultsListProps {
  filteredResults: ProcessedResult[];
  isLoadingResults: boolean;
  resultsError: Error | null;
  toggleDomainFilter: (domain: string) => void;
  toggleFileTypeFilter: (fileType: string) => void;
}

export function ResultsList({ 
  filteredResults,
  isLoadingResults, 
  resultsError,
  toggleDomainFilter,
  toggleFileTypeFilter
}: ResultsListProps) {
  if (isLoadingResults) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (resultsError) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Error loading results: {resultsError.message}
      </div>
    );
  }

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No results match your filters or no processed results found.
        </p>
      </div>
    );
  }

  return (
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
  );
} 