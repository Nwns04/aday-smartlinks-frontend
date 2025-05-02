
import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-lg text-gray-700">
        Sorry, you must be a Spotify-verified artist to register on this platform.
      </p>
      <Link to="/" className="mt-6 px-4 py-2 bg-black text-white rounded-lg">
        Go Back Home
      </Link>
    </div>
  );
}
