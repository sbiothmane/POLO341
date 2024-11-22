// pages/polls/[instructor].js or app/polls/[instructor]/page.js
'use client'

import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Navbar from '@/app/components/home/Navbar'
import Footer from '@/app/components/home/Footer'
import AnimatedBackground from '@/app/components/home/AnimatedBackground'
import PollsList from '@/app/components/polls/PollsList'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Loader2, XCircle } from 'lucide-react'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore'

PollsPage.propTypes = {
  params: PropTypes.shape({
    instructor: PropTypes.string.isRequired,
  }).isRequired,
};

export default function PollsPage({ params }) {
  const { instructor } = params
  const { data: session, status } = useSession()
  const router = useRouter()

  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const isInstructor =
    session?.user?.role === 'instructor' && session.user.username === instructor

  useEffect(() => {
    if (status === 'authenticated') {
      const unsubscribe = fetchPolls()
      return () => unsubscribe && unsubscribe()
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [instructor, session, isInstructor, status, router])

  const fetchPolls = () => {
    const pollsCollection = collection(db, 'polls')
    const q = query(pollsCollection, where('instructor', '==', instructor))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      } else {
        setShowResults(false)
        setHasVoted(false)
      }

      setPolls(fetchedPolls)
      setLoading(false)
    })

    return unsubscribe
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

      setSelectedChoice(null)
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

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 container mx-auto px-6 py-24 flex-grow">
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

          <PollsList
            polls={polls}
            isInstructor={isInstructor}
            hasVoted={hasVoted}
            handleVoteSubmit={handleVoteSubmit}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            showResults={showResults}
          />

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
      <Footer />
    </div>
  )
}
