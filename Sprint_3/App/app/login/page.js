'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react' // Imported useSession
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react' // Imported Loader2 for loading state

export default function Login() {
  const { data: session, status } = useSession() // Use useSession to get session data
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // State for form submission loading

  useEffect(() => {
    if (status === 'authenticated') {
      // If the user is authenticated, redirect to /dashboard
      router.push('/dashboard')
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) // Start loading

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

    if (res.ok) {
      // Redirect to dashboard if sign-in is successful
      router.push('/dashboard')
    } else {
      setError('Invalid credentials')
    }
    setLoading(false) // Stop loading
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
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            PeerAssess
          </Link>
          <div className="space-x-4">
            {/* Show Login link only if not authenticated */}
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
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center justify-center"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
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
