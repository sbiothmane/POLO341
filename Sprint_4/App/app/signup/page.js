'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react' // Imported useSession and signOut
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function Signup() {
  const { data: session, status } = useSession() // Use useSession to get session data
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [availability, setAvailability] = useState({
    usernameAvailable: null,
    idAvailable: null,
  })
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Redirect authenticated users to /dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Debounced check for username and ID availability
  useEffect(() => {
    if (username || id) {
      setIsTyping(true)
      const delayDebounceFn = setTimeout(() => {
        setIsTyping(false)
        checkAvailability()
      }, 500)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [username, id])

  const checkAvailability = async () => {
    setCheckingAvailability(true)
    setAvailability({ usernameAvailable: null, idAvailable: null })

    try {
      const response = await fetch('/api/auth/userCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, id }),
      })

      const result = await response.json()
      setAvailability({
        usernameAvailable: result.usernameAvailable,
        idAvailable: result.idAvailable,
      })
    } catch (error) {
      console.error('Error checking availability:', error)
    } finally {
      // Optional: Remove the artificial delay if not needed
      setTimeout(() => {
        setCheckingAvailability(false)
      }, 1000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (checkingAvailability) {
      setMessage('Checking availability, please wait...')
      return
    }

    if (
      availability.usernameAvailable === false ||
      availability.idAvailable === false
    ) {
      setMessage('Username or ID is already taken. Please choose another.')
      return
    }

    const data = {
      username,
      password,
      role,
      id,
      name,
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage(result.message)

        // Optionally, automatically log in the user after signup
        await signIn('credentials', {
          redirect: false,
          username,
          password,
        })

        // Redirect to dashboard after successful signup
        router.push('/dashboard')
      } else {
        const error = await response.json()
        setMessage(error.message)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('An unexpected error occurred.')
    }
  }

  // Handle validation for username and ID
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value
    const isValid = /^[a-zA-Z0-9_-]{0,20}$/.test(newUsername)
    if (isValid) setUsername(newUsername)
  }

  const handleIdChange = (e) => {
    const newId = e.target.value
    if (/^\d{0,8}$/.test(newId)) setId(newId)
  }

  // If the authentication status is loading, show a loader
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            PeerAssess
          </Link>
          <div className="space-x-4">
            {/* Show Login and Sign Up buttons only if not authenticated */}
            {status !== 'authenticated' && (
              <>
                <Button variant="ghost" asChild className="text-gray-800">
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-full"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-24 relative z-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
        </div>
        <motion.div
          className="bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-2 relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength="5"
                  maxLength="20"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {checkingAvailability && username && (
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                  )}
                  {!checkingAvailability && availability.usernameAvailable && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {!checkingAvailability &&
                    availability.usernameAvailable === false && (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                </div>
              </div>
            </div>

            {/* Student ID Field */}
            <div className="relative">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <div className="mt-2 relative">
                <input
                  id="id"
                  type="text"
                  placeholder="Enter your Student ID"
                  value={id}
                  onChange={handleIdChange}
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="\d{8}"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {checkingAvailability && id && (
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                  )}
                  {!checkingAvailability && availability.idAvailable && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {!checkingAvailability && availability.idAvailable === false && (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>
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
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={
                availability.usernameAvailable === false ||
                availability.idAvailable === false ||
                checkingAvailability
              }
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center justify-center ${
                availability.usernameAvailable === false ||
                availability.idAvailable === false ||
                checkingAvailability
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {checkingAvailability ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="ml-2 h-4 w-4" />
              )}
              Sign Up
            </Button>
            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-lg py-8">
        <div className="container mx-auto px-6 text-center text-gray-800">
          <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Signup
