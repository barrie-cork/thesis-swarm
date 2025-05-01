import React from 'react';
import { MainLayout } from '../../shared/components/MainLayout';
import { Link } from 'react-router-dom';
import { ResultsHeader } from '../components/ResultsHeader';
import { ResultProcessingSection } from '../components/ResultProcessingSection';
import { FilterControls } from '../components/FilterControls';
import { ResultsList } from '../components/ResultsList';
import { useResultsProcessing } from '../hooks/useResultsProcessing';
import { useResultsFiltering } from '../hooks/useResultsFiltering';

export function ResultsManagerPage() {
  const {
    sessionId,
    session,
    results,
    isLoadingSession,
    isLoadingResults,
    sessionError,
    resultsError,
    isProcessing,
    processingError,
    processResults
  } = useResultsProcessing();

  const {
    filters,
    setFilters,
    filteredResults,
    uniqueDomains,
    uniqueFileTypes,
    handleSearchChange,
    handleSortChange,
    toggleDomainFilter,
    toggleFileTypeFilter
  } = useResultsFiltering(results);

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
        <ResultsHeader session={session} sessionId={sessionId} />

        <ResultProcessingSection 
          onProcessResults={processResults}
          isProcessing={isProcessing}
          processingError={processingError}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Processed Results</h2>
          
          <FilterControls
            filters={filters}
            handleSearchChange={handleSearchChange}
            handleSortChange={handleSortChange}
            toggleDomainFilter={toggleDomainFilter}
            toggleFileTypeFilter={toggleFileTypeFilter}
            uniqueDomains={uniqueDomains}
            uniqueFileTypes={uniqueFileTypes}
            setFilters={setFilters}
          />
          
          <ResultsList
            filteredResults={filteredResults}
            isLoadingResults={isLoadingResults}
            resultsError={resultsError}
            toggleDomainFilter={toggleDomainFilter}
            toggleFileTypeFilter={toggleFileTypeFilter}
          />
        </div>
      </div>
    </MainLayout>
  );
} 