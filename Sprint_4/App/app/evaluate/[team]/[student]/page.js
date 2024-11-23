'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AnimatedBackground from '@/app/components/home/AnimatedBackground'
import NavBar from '@/app/components/home/Navbar'
import Footer from '@/app/components/home/Footer'

import {
  Star,
  Loader2,
  User,
  Users,
  Clock,
  PieChart,
} from 'lucide-react'
import PropTypes from 'prop-types'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'



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

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  hoverRating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  setHoverRating: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
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
      const response = await fetch('/api/teams/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      })
      const result = await response.json()

      if (result.success) {
        setSubmissionStatus('success')
        setIsDisabled(true)
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

  return (
    <>
      <AnimatedBackground />
      <NavBar role={session?.user?.role || 'student'} />

      <div className="relative container mx-auto px-6 py-16 z-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Evaluate Student</CardTitle>
            <CardDescription>
              Evaluate your team member, {student} on the following areas:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Conceptual Contribution */}
              <div className="mb-6">
                <label
                  htmlFor="conceptual"
                  className="block text-sm font-medium text-gray-700"
                >
                  Conceptual Contribution
                </label>
                <StarRating
                  rating={ratingConceptual}
                  hoverRating={hoverRatingConceptual}
                  setRating={setRatingConceptual}
                  setHoverRating={setHoverRatingConceptual}
                  isDisabled={isDisabled}
                />
                <Textarea
                  id="conceptual"
                  placeholder="Comments on conceptual contribution..."
                  value={commentConceptual}
                  onChange={(e) => setCommentConceptual(e.target.value)}
                  disabled={isDisabled}
                  className="mt-2"
                />
                {errors.ratingConceptual && (
                  <Alert variant="destructive">
                    <AlertTitle>Missing rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for conceptual contribution.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Practical Contribution */}
              <div className="mb-6">
                <label
                  htmlFor="practical"
                  className="block text-sm font-medium text-gray-700"
                >
                  Practical Contribution
                </label>
                <StarRating
                  rating={ratingPractical}
                  hoverRating={hoverRatingPractical}
                  setRating={setRatingPractical}
                  setHoverRating={setHoverRatingPractical}
                  isDisabled={isDisabled}
                />
                <Textarea
                  id="practical"
                  placeholder="Comments on practical contribution..."
                  value={commentPractical}
                  onChange={(e) => setCommentPractical(e.target.value)}
                  disabled={isDisabled}
                  className="mt-2"
                />
                {errors.ratingPractical && (
                  <Alert variant="destructive">
                    <AlertTitle>Missing rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for practical contribution.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Work Ethic */}
              <div className="mb-6">
                <label
                  htmlFor="workEthic"
                  className="block text-sm font-medium text-gray-700"
                >
                  Work Ethic
                </label>
                <StarRating
                  rating={ratingWorkEthic}
                  hoverRating={hoverRatingWorkEthic}
                  setRating={setRatingWorkEthic}
                  setHoverRating={setHoverRatingWorkEthic}
                  isDisabled={isDisabled}
                />
                <Textarea
                  id="workEthic"
                  placeholder="Comments on work ethic..."
                  value={commentWorkEthic}
                  onChange={(e) => setCommentWorkEthic(e.target.value)}
                  disabled={isDisabled}
                  className="mt-2"
                />
                {errors.ratingWorkEthic && (
                  <Alert variant="destructive">
                    <AlertTitle>Missing rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for work ethic.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isDisabled || loading}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit'}
                </Button>

                {submissionStatus === 'success' && (
                  <Alert variant="success" className="mt-4">
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your evaluation has been submitted successfully.
                    </AlertDescription>
                  </Alert>
                )}
                {submissionStatus === 'error' && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                      Something went wrong. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer/>
    </>
  )
}

EvaluateStudent.propTypes = {
  params: PropTypes.shape({
    team: PropTypes.string.isRequired,
    student: PropTypes.string.isRequired,
  }).isRequired,
}
