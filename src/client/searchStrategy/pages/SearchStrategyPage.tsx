import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getSearchSessions } from 'wasp/client/operations';
import { Link } from 'react-router-dom';

export function SearchStrategyPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  
  const { data: sessions, isLoading, error, refetch } = useQuery(getSearchSessions);
  
  if (isLoading) return <div className="p-4">Loading search sessions...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  
  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return;
    
    try {
      // This would be replaced with the actual createSearchSession action
      // await createSearchSession({ name: newSessionName });
      setNewSessionName('');
      setIsCreating(false);
      refetch();
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search Strategy</h1>
      
      <div className="mb-6">
        {!isCreating ? (
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsCreating(true)}
          >
            Create New Session
          </button>
        ) : (
          <div className="flex flex-col space-y-2 max-w-md">
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Session name"
              className="border p-2 rounded"
            />
            <div className="flex space-x-2">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleCreateSession}
              >
                Save
              </button>
              <button 
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setIsCreating(false);
                  setNewSessionName('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions?.length === 0 && (
          <p className="col-span-full text-gray-500">No search sessions found. Create your first one!</p>
        )}
        
        {sessions?.map(session => (
          <div key={session.id} className="border rounded p-4 hover:shadow-md">
            <h3 className="text-xl font-semibold">{session.name}</h3>
            {session.description && (
              <p className="text-gray-600 mt-2">{session.description}</p>
            )}
            <div className="mt-4 flex space-x-2">
              <Link 
                to={`/search-execution/${session.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Execute
              </Link>
              <Link 
                to={`/results/${session.id}`}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
              >
                Results
              </Link>
              <Link 
                to={`/review/${session.id}`}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 