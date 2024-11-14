'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import {
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Users,
  Clock,
  PieChart,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

// AnimatedSphere Component
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

// AnimatedBackground Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <AnimatedSphere />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/70 via-blue-50/70 to-indigo-50/70" />
    </div>
  )
}

// NavBar Component
const NavBar = ({ role }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-gray-200/20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-gray-800">
          PeerAssess
        </Link>
        <div className="flex items-center space-x-4">
          {role === 'instructor' && (
            <div className="flex space-x-2">
              <Link href="/create_time">
                <Button
                  variant="outline"
                  className="flex items-center bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Office Hours
                </Button>
              </Link>
              <Link href="/create_poll">
                <Button
                  variant="outline"
                  className="flex items-center bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white"
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Polls
                </Button>
              </Link>
              <Link href="/create_teams">
                <Button
                  variant="outline"
                  className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Team
                </Button>
              </Link>
            </div>
          )}
          <Button
            variant="ghost"
            className="text-gray-800 flex items-center"
            onClick={() => signOut()}
          >
            <User className="mr-2 h-5 w-5 text-gray-800" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-lg py-8">
      <div className="container mx-auto px-6 text-center text-gray-800">
        <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
      </div>
    </footer>
  )
}

// StarRating Component
const StarRating = ({ rating, hoverRating, setRating, setHoverRating, isDisabled }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: isDisabled ? 1 : 1.1 }}
          whileTap={{ scale: isDisabled ? 1 : 0.9 }}
        >
          <Star
            className={`cursor-pointer text-4xl transition-colors duration-200 ${
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => !isDisabled && setRating(star)}
            onMouseEnter={() => !isDisabled && setHoverRating(star)}
            onMouseLeave={() => !isDisabled && setHoverRating(0)}
          />
        </motion.div>
      ))}
    </div>
  )
}

// EvaluateStudent Component
export default function EvaluateStudent({ params }) {
  const { team, student } = params
  const { data: session, status } = useSession()
  const router = useRouter()

  const [ratingConceptual, setRatingConceptual] = useState(0)
  const [hoverRatingConceptual, setHoverRatingConceptual] = useState(0)
  const [commentConceptual, setCommentConceptual] = useState('')

  const [ratingPractical, setRatingPractical] = useState(0)
  const [hoverRatingPractical, setHoverRatingPractical] = useState(0)
  const [commentPractical, setCommentPractical] = useState('')

  const [ratingWorkEthic, setRatingWorkEthic] = useState(0)
  const [hoverRatingWorkEthic, setHoverRatingWorkEthic] = useState(0)
  const [commentWorkEthic, setCommentWorkEthic] = useState('')

  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExistingRating()
    } else if (status === 'unauthenticated') {
      router.push('/unauthorized')
    }
  }, [session, status])

  const fetchExistingRating = async () => {
    try {
      const response = await fetch('/api/teams/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evaluator: session?.user?.username,
          team,
          student,
        }),
      })

      const result = await response.json()

      if (result.rating) {
        const { ratings, comments } = result.rating
        setRatingConceptual(ratings.conceptualContribution || 0)
        setCommentConceptual(comments.conceptualContribution || '')

        setRatingPractical(ratings.practicalContribution || 0)
        setCommentPractical(comments.practicalContribution || '')

        setRatingWorkEthic(ratings.workEthic || 0)
        setCommentWorkEthic(comments.workEthic || '')

        setIsDisabled(true)
      }
    } catch (error) {
      console.error('Error fetching existing rating:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (ratingConceptual === 0)
      newErrors.ratingConceptual = 'Please provide a rating.'
    if (ratingPractical === 0)
      newErrors.ratingPractical = 'Please provide a rating.'
    if (ratingWorkEthic === 0)
      newErrors.ratingWorkEthic = 'Please provide a rating.'

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setSubmissionStatus('error')
      return
    }

    setLoading(true)

    const evaluationData = {
      evaluator: session?.user?.username,
      team,
      student,
      ratings: {
        conceptualContribution: ratingConceptual,
        practicalContribution: ratingPractical,
        workEthic: ratingWorkEthic,
      },
      comments: {
        conceptualContribution: commentConceptual,
        practicalContribution: commentPractical,
        workEthic: commentWorkEthic,
      },
    }

    try {
      const response = await fetch('/api/teams/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmissionStatus('success')
        resetForm()
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setSubmissionStatus('error')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      setSubmissionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRatingConceptual(0)
    setCommentConceptual('')
    setRatingPractical(0)
    setCommentPractical('')
    setRatingWorkEthic(0)
    setCommentWorkEthic('')
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
        <NavBar role="guest" />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-center mt-8">
            You are not signed in.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  // Main Content
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
                <Star className="h-8 w-8 text-yellow-500" />
                <span>Evaluate Student</span>
              </CardTitle>
              <CardDescription className="text-center">
                Evaluating{' '}
                <span className="font-semibold text-blue-600">{student}</span> in
                Team{' '}
                <Badge variant="outline" className="ml-1">
                  {team}
                </Badge>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Conceptual Contribution */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-lg font-medium mb-2">
                    Conceptual Contribution
                  </label>
                  <div className="flex items-center space-x-4">
                    <StarRating
                      rating={ratingConceptual}
                      hoverRating={hoverRatingConceptual}
                      setRating={setRatingConceptual}
                      setHoverRating={setHoverRatingConceptual}
                      isDisabled={isDisabled}
                    />
                    {errors.ratingConceptual && (
                      <p className="text-red-500 text-sm">
                        {errors.ratingConceptual}
                      </p>
                    )}
                  </div>
                  <Textarea
                    placeholder="Comments on conceptual contribution..."
                    value={commentConceptual}
                    onChange={(e) => setCommentConceptual(e.target.value)}
                    disabled={isDisabled}
                    className="mt-2"
                  />
                </motion.div>

                {/* Practical Contribution */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium mb-2">
                    Practical Contribution
                  </label>
                  <div className="flex items-center space-x-4">
                    <StarRating
                      rating={ratingPractical}
                      hoverRating={hoverRatingPractical}
                      setRating={setRatingPractical}
                      setHoverRating={setHoverRatingPractical}
                      isDisabled={isDisabled}
                    />
                    {errors.ratingPractical && (
                      <p className="text-red-500 text-sm">
                        {errors.ratingPractical}
                      </p>
                    )}
                  </div>
                  <Textarea
                    placeholder="Comments on practical contribution..."
                    value={commentPractical}
                    onChange={(e) => setCommentPractical(e.target.value)}
                    disabled={isDisabled}
                    className="mt-2"
                  />
                </motion.div>

                {/* Work Ethic */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-lg font-medium mb-2">
                    Work Ethic
                  </label>
                  <div className="flex items-center space-x-4">
                    <StarRating
                      rating={ratingWorkEthic}
                      hoverRating={hoverRatingWorkEthic}
                      setRating={setRatingWorkEthic}
                      setHoverRating={setHoverRatingWorkEthic}
                      isDisabled={isDisabled}
                    />
                    {errors.ratingWorkEthic && (
                      <p className="text-red-500 text-sm">
                        {errors.ratingWorkEthic}
                      </p>
                    )}
                  </div>
                  <Textarea
                    placeholder="Comments on work ethic..."
                    value={commentWorkEthic}
                    onChange={(e) => setCommentWorkEthic(e.target.value)}
                    disabled={isDisabled}
                    className="mt-2"
                  />
                </motion.div>

                {isDisabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Note</AlertTitle>
                      <AlertDescription>
                        You have already submitted an evaluation for this
                        student.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {!isDisabled && (
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
                      {loading ? 'Submitting...' : 'Submit Evaluation'}
                    </Button>
                  </motion.div>
                )}

                <AnimatePresence>
                  {submissionStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      {submissionStatus === 'success' ? (
                        <div className="flex items-center justify-center text-green-500">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <p>Evaluation submitted successfully!</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-red-500">
                          <XCircle className="mr-2 h-5 w-5" />
                          <p>Error submitting evaluation.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
