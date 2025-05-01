import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';

export function HomePage() {
  const { data: user, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Thesis Grey
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-3xl">
            A specialized search application designed to facilitate the discovery and management of grey literature for clinical guideline development.
          </p>
          {!isLoading && !user ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border border-white text-white rounded-md font-semibold hover:bg-blue-600 text-center"
              >
                Log In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/search-strategy"
                className="px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🔍"
              title="Search Strategy Building"
              description="Create and manage comprehensive search strategies with PICO framework support for systematic reviews."
            />
            <FeatureCard 
              icon="⚡"
              title="Automated Search Execution"
              description="Execute searches across multiple sources with automated result aggregation and deduplication."
            />
            <FeatureCard 
              icon="📋"
              title="PRISMA-Compliant Workflow"
              description="Follow standardized PRISMA guidelines with integrated tools for review and documentation."
            />
          </div>
        </div>
      </div>
      
      {/* Workflow Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Streamlined Workflow</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <WorkflowStep 
              number="1"
              title="Build Strategy"
              description="Define your search strategy using structured frameworks like PICO."
            />
            <WorkflowStep 
              number="2"
              title="Execute Search"
              description="Run searches across multiple sources with a single click."
            />
            <WorkflowStep 
              number="3"
              title="Process Results"
              description="Automatically process, normalize, and deduplicate search results."
            />
            <WorkflowStep 
              number="4"
              title="Review & Report"
              description="Tag, annotate, and generate PRISMA-compliant reports."
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 px-4 bg-blue-500 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your literature reviews?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join researchers who are saving time and improving their systematic reviews.
          </p>
          {!isLoading && !user ? (
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100"
            >
              Get Started Now
            </Link>
          ) : (
            <Link
              to="/search-strategy"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function WorkflowStep({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 