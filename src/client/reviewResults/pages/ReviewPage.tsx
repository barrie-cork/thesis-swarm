import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getReviewTags, getResultsWithTags } from 'wasp/client/operations';
import { createReviewTag, assignTag, createNote } from 'wasp/client/operations';

export function ReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [untaggedOnly, setUntaggedOnly] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6'); // Default blue
  const [newNoteContent, setNewNoteContent] = useState('');
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  
  // Fetch tags
  const tagsQuery = useQuery(getReviewTags, { sessionId: sessionId! });
  
  // Fetch results with tags
  const resultsQuery = useQuery(getResultsWithTags, {
    sessionId: sessionId!,
    tagId: selectedTagId,
    untaggedOnly,
    page: currentPage,
    limit: 10
  });
  
  if (!sessionId) {
    return <div className="p-4 text-red-500">Session ID is required</div>;
  }
  
  if (tagsQuery.isLoading || resultsQuery.isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  
  if (tagsQuery.error || resultsQuery.error) {
    return (
      <div className="p-4 text-red-500">
        Error: {tagsQuery.error?.message || resultsQuery.error?.message}
      </div>
    );
  }
  
  const tags = tagsQuery.data || [];
  const { results = [], pagination = { totalCount: 0, totalPages: 1, currentPage: 1 } } = resultsQuery.data || {};
  
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      alert('Tag name is required');
      return;
    }
    
    try {
      await createReviewTag({
        sessionId: sessionId!,
        name: newTagName,
        color: newTagColor
      });
      
      setNewTagName('');
      setIsCreatingTag(false);
      tagsQuery.refetch();
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert(`Failed to create tag: ${error.message}`);
    }
  };
  
  const handleAssignTag = async (resultId: string, tagId: string) => {
    try {
      await assignTag({ resultId, tagId });
      resultsQuery.refetch();
    } catch (error) {
      console.error('Failed to assign tag:', error);
      alert(`Failed to assign tag: ${error.message}`);
    }
  };
  
  const handleRemoveTag = async (resultId: string, tagId: string) => {
    try {
      await assignTag({ resultId, tagId, remove: true });
      resultsQuery.refetch();
    } catch (error) {
      console.error('Failed to remove tag:', error);
      alert(`Failed to remove tag: ${error.message}`);
    }
  };
  
  const handleAddNote = async (resultId: string) => {
    if (!newNoteContent.trim()) {
      alert('Note content is required');
      return;
    }
    
    try {
      await createNote({ resultId, content: newNoteContent });
      setNewNoteContent('');
      setActiveResultId(null);
      resultsQuery.refetch();
    } catch (error) {
      console.error('Failed to add note:', error);
      alert(`Failed to add note: ${error.message}`);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Review Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tags Panel */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tags</h2>
            <button
              onClick={() => setIsCreatingTag(!isCreatingTag)}
              className="text-blue-500 hover:text-blue-700"
            >
              {isCreatingTag ? 'Cancel' : '+ Add Tag'}
            </button>
          </div>
          
          {isCreatingTag && (
            <div className="mb-4 p-3 border rounded">
              <div className="mb-2">
                <label className="block text-sm text-gray-700 mb-1">Tag Name</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter tag name"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </div>
              <button
                onClick={handleCreateTag}
                className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                Create Tag
              </button>
            </div>
          )}
          
          <div className="space-y-2">
            <button
              onClick={() => {
                setSelectedTagId(null);
                setUntaggedOnly(false);
              }}
              className={`w-full text-left px-3 py-2 rounded ${
                !selectedTagId && !untaggedOnly ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => {
                setSelectedTagId(null);
                setUntaggedOnly(true);
              }}
              className={`w-full text-left px-3 py-2 rounded ${
                untaggedOnly ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              Untagged Results
            </button>
            
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTagId(tag.id);
                  setUntaggedOnly(false);
                }}
                className={`w-full text-left px-3 py-2 rounded flex items-center ${
                  selectedTagId === tag.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                <span 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tag.color }}
                ></span>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="md:col-span-3 bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">
            {untaggedOnly ? 'Untagged Results' : 
              selectedTagId ? `Results Tagged with ${tags.find(t => t.id === selectedTagId)?.name}` : 
              'All Results'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pagination.totalCount} results)
            </span>
          </h2>
          
          {results.length === 0 ? (
            <div className="text-gray-500 py-8 text-center">
              No results found matching the current filters.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(result => (
                <div key={result.id} className="border rounded p-4">
                  <h3 className="text-lg font-medium mb-1">
                    <a 
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {result.title}
                    </a>
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">{result.url}</p>
                  
                  {result.snippet && (
                    <p className="text-sm mb-3">{result.snippet}</p>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.reviewTags.map(tagAssignment => (
                      <span 
                        key={tagAssignment.id}
                        className="inline-flex items-center px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: `${tagAssignment.tag.color}20`,
                          color: tagAssignment.tag.color
                        }}
                      >
                        {tagAssignment.tag.name}
                        <button
                          onClick={() => handleRemoveTag(result.id, tagAssignment.tag.id)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  {/* Tag Selector */}
                  <div className="flex items-center space-x-2 mb-3">
                    <label className="text-sm text-gray-700">Add tag:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignTag(result.id, e.target.value);
                          e.target.value = ''; // Reset after selection
                        }
                      }}
                      value=""
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select tag...</option>
                      {tags
                        .filter(tag => !result.reviewTags.some(rt => rt.tagId === tag.id))
                        .map(tag => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  {/* Notes */}
                  {result.notes.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
                      <div className="space-y-1">
                        {result.notes.map(note => (
                          <p key={note.id} className="text-sm text-gray-600 pl-3 border-l-2 border-gray-300">
                            {note.content}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add Note Button/Form */}
                  {activeResultId === result.id ? (
                    <div className="mt-3 border-t pt-3">
                      <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Type your note here..."
                        rows={3}
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => {
                            setActiveResultId(null);
                            setNewNoteContent('');
                          }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddNote(result.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveResultId(result.id)}
                      className="text-blue-500 text-sm hover:text-blue-700"
                    >
                      + Add Note
                    </button>
                  )}
                </div>
              ))}
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => (
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - currentPage) <= 1
                      ))
                      .map((page, i, arr) => {
                        // Add ellipsis if there are gaps
                        if (i > 0 && page > arr[i - 1] + 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <span className="px-3 py-1">...</span>
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded ${
                                  currentPage === page 
                                    ? 'bg-blue-500 text-white' 
                                    : 'hover:bg-blue-50'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page 
                                ? 'bg-blue-500 text-white' 
                                : 'hover:bg-blue-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === pagination.totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 