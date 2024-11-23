'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'
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
import {
  Loader2,
  Plus,
  Minus,
  AlertCircle,
  ChevronRight,
  PieChart,
} from 'lucide-react'
import AnimatedBackground from '../components/home/AnimatedBackground'
import NavBar from '../components/home/Navbar'
import Footer from '../components/home/Footer'

export default function CreatePollPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState([
    { id: uuidv4(), value: '' },
    { id: uuidv4(), value: '' },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'instructor') {
      checkActivePoll()
    } else if (status === 'authenticated') {
      router.push('/unauthorized')
    }
  }, [status, session, router])

  const checkActivePoll = async () => {
    try {
      const response = await fetch(
        `/api/polls/check?instructor=${session.user.username}`
      )
      const data = await response.json()

      if (data.activePoll) {
        router.push(`/polls/${session.user.username}`)
      }
    } catch (error) {
      console.error('Error checking active poll:', error)
    }
  }

  const updateChoice = (id, value) => {
    setChoices((prev) =>
      prev.map((choice) => (choice.id === id ? { ...choice, value } : choice))
    )
  }

  const addChoice = () =>
    setChoices((prev) => [...prev, { id: uuidv4(), value: '' }])

  const removeChoice = (id) =>
    setChoices((prev) => prev.filter((choice) => choice.id !== id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const pollData = {
      question,
      choices: choices
        .map((choice) => choice.value)
        .filter((value) => value.trim() !== ''),
      instructor: session.user.username,
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      })

      if (!response.ok) throw new Error('Failed to create poll')

      router.push(`/polls/${session.user.username}`)
    } catch (error) {
      console.error('Error creating poll:', error)
      // Optionally, you can display an error message to the user here
    } finally {
      setLoading(false)
    }
  }

  const renderUnauthorized = (message) => (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <NavBar role={session?.user?.role || 'guest'} />
      <main className="flex-grow flex items-center justify-center">
        <p className="text-red-500 text-center mt-8">{message}</p>
      </main>
      <Footer />
    </div>
  )

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === 'unauthenticated')
    return renderUnauthorized('You are not signed in.')
  if (status === 'authenticated' && session.user.role !== 'instructor') {
    return renderUnauthorized('You are not authorized to access this page.')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <NavBar role={session.user.role} />

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
                <InputField
                  label="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question..."
                />

                <ChoicesField
                  choices={choices}
                  onUpdate={updateChoice}
                  onAdd={addChoice}
                  onRemove={removeChoice}
                />

                {choices.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      You can create only one active poll at a time.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Poll...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Create Poll
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

// Reusable Input Field Component
const InputField = ({ label, value, onChange, placeholder }) => {
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <label htmlFor={inputId} className="block text-lg font-medium mb-2">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </motion.div>
  )
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
}

// Reusable Choices Field Component
const ChoicesField = ({ choices, onUpdate, onAdd, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-4"
  >
    <label className="block text-lg font-medium mb-2">Choices</label>
    <AnimatePresence>
      {choices.map((choiceObj, index) => {
        const inputId = `choice-${choiceObj.id}`
        return (
          <motion.div
            key={choiceObj.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <Badge className="bg-blue-500">{index + 1}</Badge>
            <label htmlFor={inputId} className="sr-only">
              Choice {index + 1}
            </label>
            <input
              id={inputId}
              type="text"
              value={choiceObj.value}
              onChange={(e) => onUpdate(choiceObj.id, e.target.value)}
              required
              placeholder={`Choice ${index + 1}`}
              className="flex-1 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {choices.length > 2 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemove(choiceObj.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        )
      })}
    </AnimatePresence>
    <Button type="button" onClick={onAdd} variant="outline" className="w-full">
      <Plus className="mr-2 h-4 w-4" />
      Add Choice
    </Button>
  </motion.div>
)

ChoicesField.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}
