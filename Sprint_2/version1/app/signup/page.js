'use client';

import React, { useState, useEffect } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState({
    usernameAvailable: null,
    idAvailable: null,
  });
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Debounced check for username and ID availability
  useEffect(() => {
    if (username || id) {
      setIsTyping(true);
      const delayDebounceFn = setTimeout(() => {
        setIsTyping(false);
        checkAvailability();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [username, id]);

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    setAvailability({ usernameAvailable: null, idAvailable: null });

    try {
      const response = await fetch('/api/auth/userCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, id }),
      });

      const result = await response.json();
      setAvailability({
        usernameAvailable: result.usernameAvailable,
        idAvailable: result.idAvailable,
      });
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setTimeout(() => {
        setCheckingAvailability(false);
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure availability check has finished
    if (checkingAvailability) {
      setMessage('Checking availability, please wait...');
      return;
    }

    // Prevent submission if username or ID is unavailable
    if (
      availability.usernameAvailable === false ||
      availability.idAvailable === false
    ) {
      setMessage('Username or ID is already taken. Please choose another.');
      return;
    }

    const data = {
      username,
      password,
      role,
      id,
      name,
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);

        // Reset form
        setUsername('');
        setPassword('');
        setRole('student');
        setId('');
        setName('');
        setAvailability({
          usernameAvailable: null,
          idAvailable: null,
        });
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105 hover:shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {/* Username availability checking */}
            {checkingAvailability && <p className="text-sm text-blue-500 mt-2">Checking availability...</p>}
            {!checkingAvailability && availability.usernameAvailable === false && (
              <p className="text-sm text-red-500 mt-2">Username is taken</p>
            )}
            {!checkingAvailability && availability.usernameAvailable === true && (
              <p className="text-sm text-green-500 mt-2">Username is available</p>
            )}
          </div>

          {/* Student ID Field */}
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              id="id"
              type="text"
              placeholder="Enter your Student ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {/* ID availability checking */}
            {checkingAvailability && <p className="text-sm text-blue-500 mt-2">Checking availability...</p>}
            {!checkingAvailability && availability.idAvailable === false && (
              <p className="text-sm text-red-500 mt-2">ID is taken</p>
            )}
            {!checkingAvailability && availability.idAvailable === true && (
              <p className="text-sm text-green-500 mt-2">ID is available</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Full Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={
              availability.usernameAvailable === false ||
              availability.idAvailable === false ||
              checkingAvailability
            }
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              availability.usernameAvailable === false ||
              availability.idAvailable === false ||
              checkingAvailability
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Sign up
          </button>
          {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
