'use client';

import './signup.css';
import React, { useState, useEffect } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null); // Track username availability
  const [checkingUsername, setCheckingUsername] = useState(false); // Track checking state
  const [isTyping, setIsTyping] = useState(false); // Track if user is still typing

  // Debounced username check to avoid spamming API calls
  useEffect(() => {
    if (username) {
      setIsTyping(true); // User is still typing
      const delayDebounceFn = setTimeout(() => {
        setIsTyping(false); // User has stopped typing
        checkUsername();
      }, 500); // 1-second delay

      return () => clearTimeout(delayDebounceFn); // Clear timeout if username is updated quickly
    }
  }, [username]);

  const checkUsername = async () => {
    setCheckingUsername(true); // Show "Checking availability..."
    setUsernameAvailable(null); // Reset availability during the check

    try {
      const response = await fetch('/api/auth/userCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      setUsernameAvailable(result.available); // Set availability based on response
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setTimeout(() => {
        setCheckingUsername(false); // Hide checking indicator after 1 second
      }, 1000); // Ensures "Checking availability..." is shown for 1 second
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure username check has finished before allowing form submission
    if (checkingUsername) {
      setMessage('Checking availability, please wait...');
      return;
    }

    // Prevent submission if username is unavailable
    if (usernameAvailable === false) {
      setMessage('Username is already taken. Please choose another.');
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
        setMessage(result.message); // Display success message
        alert(result.message);

        // Reset form
        setUsername('');
        setPassword('');
        setRole('student');
        setId('');
        setName('');
      } else {
        const error = await response.json();
        setMessage(error.message); // Display error message
        alert(error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {/* Username Field */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username and debounce check
          required
        />
        <br />
        {/* Username availability checking */}
        {checkingUsername && <p>Checking availability...</p>}
        {!checkingUsername && usernameAvailable === false && (
          <p style={{ color: 'red' }}>Username is taken</p>
        )}
        {!checkingUsername && usernameAvailable === true && (
          <p style={{ color: 'green' }}>Username is valid</p>
        )}
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Student ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <label htmlFor="role">Select Role:</label> &nbsp;
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <br /><br />

        {/* Sign Up Button: Disable if username is taken */}
        <button 
          type="submit" 
          disabled={usernameAvailable === false || checkingUsername} // Disable button during checking or if username is unavailable
          style={{
            opacity: usernameAvailable === false || checkingUsername ? 0.5 : 1, // Make button semi-transparent if username is taken
            cursor: usernameAvailable === false || checkingUsername ? 'not-allowed' : 'pointer', // Change cursor to not-allowed if disabled
          }}
        >
          Sign up
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Signup;
