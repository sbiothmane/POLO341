'use client';
import React from 'react';  // Import React
export default function Loading() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading...</h2>
          <p className="text-gray-600 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }
  
