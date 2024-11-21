'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react' // Ensure signOut is imported
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import {
  User,
  Users,
  Clock,
  PieChart,
  Loader2,
  Plus,
  Minus,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import AnimatedBackground from '../components/home/AnimatedBackground'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'


// CreatePollPage Component
export default function CreatePollPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [hasActivePoll, setHasActivePoll] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role === 'instructor') {
        checkActivePoll()
      } else {
        router.push('/unauthorized')
      }
    }
  }, [status, session, router])

  const checkActivePoll = async () => {
    try {
      const response = await fetch(
        `/api/polls/check?instructor=${session.user.username}`
      )
      const data = await response.json()

      if (data.activePoll) {
        setHasActivePoll(true)
        router.push(`/polls/${session.user.username}`)
      }
    } catch (error) {
      console.error('Error checking active poll:', error)
    }
  }

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices]
    newChoices[index] = value
    setChoices(newChoices)
  }

  const addChoice = () => {
    setChoices([...choices, ''])
  }

  const removeChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index)
    setChoices(newChoices)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const pollData = {
      question,
      choices: choices.filter((choice) => choice.trim() !== ''),
      instructor: session.user.username,
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      })

      if (!response.ok) {
        throw new Error('Failed to create poll')
      }

      router.push(`/polls/${session.user.username}`)
    } catch (error) {
      console.error('Error creating poll:', error)
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  // Unauthorized or Unauthenticated States
  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <NavBar role="guest" /> {/* Pass a default role or handle accordingly */}
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-center mt-8">You are not signed in.</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (status === 'authenticated' && session.user.role !== 'instructor') {
    return (
      <div className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <NavBar role={session.user.role} />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-center mt-8">
            You are not authorized to access this page.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  // Main Content for Authenticated Instructors without Active Polls
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <NavBar role={session.user.role} /> {/* NavBar at the top */}

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/30 backdrop-blur-lg border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2 text-4xl">
                <PieChart className="h-8 w-8 text-blue-500" />
                <span>Create Poll</span>
              </CardTitle>
              <CardDescription className="text-center">
                Create an interactive poll for your students
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-lg font-medium mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    placeholder="Enter your question..."
                    className="w-full p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium">Choices</label>
                  <AnimatePresence>
                    {choices.map((choice, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2"
                      >
                        <Badge className="bg-blue-500">{index + 1}</Badge>
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) =>
                            handleChoiceChange(index, e.target.value)
                          }
                          required
                          placeholder={`Choice ${index + 1}`}
                          className="flex-1 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        {choices.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeChoice(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button
                    type="button"
                    onClick={addChoice}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Choice
                  </Button>
                </motion.div>

                {choices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        You can create only one active poll at a time.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Creating Poll...' : 'Create Poll'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer /> {/* Footer at the bottom */}
    </div>
  )
}