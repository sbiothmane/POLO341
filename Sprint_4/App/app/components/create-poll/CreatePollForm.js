'use client'

import PropTypes from 'prop-types'; // Import PropTypes
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle, ChevronRight, Loader2, Minus, Plus, PieChart } from 'lucide-react'

function CreatePollForm({ session }) {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [choices, setChoices] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [questionCharCount, setQuestionCharCount] = useState(0)
  const [choiceCharCounts, setChoiceCharCounts] = useState([0, 0])

  const maxQuestionLength = 200
  const maxChoiceLength = 100

  useEffect(() => {
    setQuestionCharCount(question.length)
  }, [question])

  useEffect(() => {
    setChoiceCharCounts(choices.map((choice) => choice.length))
  }, [choices])

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices]
    newChoices[index] = value
    setChoices(newChoices)
  }

  const addChoice = () => {
    setChoices([...choices, ''])
    setChoiceCharCounts([...choiceCharCounts, 0])
  }

  const removeChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index)
    setChoices(newChoices)
    const newCharCounts = choiceCharCounts.filter((_, i) => i !== index)
    setChoiceCharCounts(newCharCounts)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)

    const pollData = {
      question,
      choices: choices.filter((choice) => choice.trim() !== ''),
      instructor: session.user.username,
    }

    if (pollData.choices.length < 2) {
      setStatusMessage({
        type: 'error',
        message: 'Please provide at least two choices.',
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create poll')
      }

      router.push(`/polls/${session.user.username}`)
    } catch (error) {
      console.error('Error creating poll:', error)
      setStatusMessage({
        type: 'error',
        message: error.message || 'Failed to create poll.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <div className="bg-white/80 backdrop-blur-lg border-none shadow-lg rounded-lg p-6">
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
              <label htmlFor="question" className="block text-lg font-medium mb-2">
                Question
              </label>
              <Input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                placeholder="Enter your question..."
                maxLength={maxQuestionLength}
                className="w-full p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <div className="text-right text-sm text-gray-500">
                {questionCharCount}/{maxQuestionLength}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
            <label className="block text-lg font-medium" htmlFor="choices">
            Choices
            </label>
              <AnimatePresence>
                {choices.map((choice, index) => (
                  <motion.div
                    key={choice + index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <Badge className="bg-blue-500">{index + 1}</Badge>
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleChoiceChange(index, e.target.value)
                        }
                        required
                        placeholder={`Choice ${index + 1}`}
                        maxLength={maxChoiceLength}
                        className="w-full p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <div className="text-right text-sm text-gray-500">
                        {choiceCharCounts[index]}/{maxChoiceLength}
                      </div>
                    </div>
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

            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-center mb-4 p-2 rounded ${
                  statusMessage.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {statusMessage.type === 'error' ? (
                  <AlertCircle className="inline-block mr-2" />
                ) : (
                  <CheckCircle className="inline-block mr-2" />
                )}
                {statusMessage.message}
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
      </div>
    </motion.div>
  )
}

CreatePollForm.propTypes = {
  session: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreatePollForm;
