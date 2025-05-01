import React from 'react';
import { useAuth, logout } from 'wasp/client/auth';

export function ProfilePage() {
  const { data: user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium">Username:</span> {user?.username}
          </div>
          {user?.email && (
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
          )}
          <div>
            <span className="font-medium">Account created:</span>{' '}
            {new Date(user?.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 