'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import {
  PieChart,
  Loader2,
  Vote,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
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
import { db } from '../../../lib/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'

const AnimatedSphere = () => {
  return (
    <Sphere args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#FFFFFF"
        attach="material"
        distort={0.5}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <AnimatedSphere />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-purple-50/70 to-indigo-50/70" />
    </div>
  )
}

export default function PollsPage({ params }) {
  const { instructor } = params
  const { data: session } = useSession()
  const router = useRouter()

  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const isInstructor =
    session?.user?.role === 'instructor' && session.user.username === instructor

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const pollsCollection = collection(db, 'polls')
        const q = query(pollsCollection, where('instructor', '==', instructor))
        const querySnapshot = await getDocs(q)

        const fetchedPolls = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        if (fetchedPolls.length > 0) {
          const poll = fetchedPolls[0]
          setHasVoted(poll.voters?.includes(session.user.username))
          setShowResults(
            isInstructor || poll.voters?.includes(session.user.username)
          )
        }

        setPolls(fetchedPolls)
      } catch (error) {
        console.error('Error fetching polls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [instructor, session, isInstructor])

  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
  }

  const handleVoteSubmit = async (pollId) => {
    if (isInstructor) {
      alert('Instructors cannot vote on their own polls.')
      return
    }

    if (selectedChoice === null) {
      alert('Please select an option to vote.')
      return
    }

    try {
      const pollRef = doc(db, 'polls', pollId)
      const poll = polls.find((p) => p.id === pollId)

      const updatedChoices = poll.choices.map((choice, index) =>
        index === selectedChoice
          ? { ...choice, votes: choice.votes + 1 }
          : choice
      )

      await updateDoc(pollRef, {
        choices: updatedChoices,
        voters: arrayUnion(session.user.username),
      })

      setPolls(
        polls.map((p) =>
          p.id === pollId
            ? {
                ...p,
                choices: updatedChoices,
                voters: [...(poll.voters || []), session.user.username],
              }
            : p
        )
      )
      setShowResults(true)
      setHasVoted(true)
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert('Failed to submit vote. Please try again.')
    }
  }

  const handleEndPoll = async () => {
    if (!confirm('Are you sure you want to end this poll?')) return

    try {
      const response = await fetch('/api/polls/end', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructor }),
      })

      if (!response.ok) {
        throw new Error('Failed to end poll')
      }

      alert('Poll ended successfully. You can create a new poll now.')
      router.push('/create_poll')
    } catch (error) {
      console.error('Error ending poll:', error)
      alert('Failed to end the poll. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <main className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/30 backdrop-blur-lg border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2 text-4xl">
                <PieChart className="h-8 w-8 text-blue-500" />
                <span>Poll Results</span>
              </CardTitle>
              <CardDescription className="text-center">
                <Badge className="bg-blue-500">
                  Instructor: {instructor}
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>

          <AnimatePresence mode="wait">
            {polls.length > 0 ? (
              polls.map((poll) => {
                const totalVotes = poll.choices.reduce(
                  (acc, choice) => acc + choice.votes,
                  0
                )

                return (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/20 backdrop-blur-lg border-none shadow-lg mb-6">
                      <CardHeader>
                        <CardTitle>{poll.question}</CardTitle>
                        {totalVotes > 0 && (
                          <CardDescription>
                            Total votes: {totalVotes}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {poll.choices.map((choice, index) => {
                          const percentage = calculatePercentage(
                            choice.votes,
                            totalVotes
                          )

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div
                                className={`rounded-lg p-4 transition-all ${
                                  !showResults && !hasVoted && !isInstructor
                                    ? 'cursor-pointer hover:bg-blue-50'
                                    : ''
                                } ${
                                  selectedChoice === index
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-white/20'
                                }`}
                                onClick={() =>
                                  !showResults &&
                                  !hasVoted &&
                                  !isInstructor &&
                                  setSelectedChoice(index)
                                }
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">
                                    {choice.text}
                                  </span>
                                  {showResults && (
                                    <Badge variant="secondary">
                                      {percentage}% ({choice.votes})
                                    </Badge>
                                  )}
                                </div>
                                {showResults && (
                                  <motion.div
                                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                  >
                                    <motion.div
                                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ duration: 0.5, delay: 0.4 }}
                                    />
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )
                        })}

                        {!showResults && !hasVoted && !isInstructor && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Button
                              onClick={() => handleVoteSubmit(poll.id)}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                              disabled={selectedChoice === null}
                            >
                              <Vote className="mr-2 h-4 w-4" />
                              Submit Vote
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-none shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
                    <p className="text-lg text-gray-600 text-center">
                      No polls available for this instructor.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isInstructor && polls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={handleEndPoll}
                variant="destructive"
                className="w-full mt-4"
              >
                <XCircle className="mr-2 h-4 w-4" />
                End Poll
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}