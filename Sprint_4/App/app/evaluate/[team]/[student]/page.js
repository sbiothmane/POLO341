// pages/evaluate/[team]/[student].js

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AnimatedBackground from '@/app/components/home/AnimatedBackground';
import NavBar from '@/app/components/home/Navbar';

NavBar.propTypes = {
  role: PropTypes.string.isRequired,
};

// StarRating Component
const StarRating = ({
  rating,
  hoverRating,
  setRating,
  setHoverRating,
  isDisabled,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: isDisabled ? 1 : 1.2 }}
          whileTap={{ scale: isDisabled ? 1 : 0.9 }}
          onClick={() => !isDisabled && setRating(star)}
          onMouseEnter={() => !isDisabled && setHoverRating(star)}
          onMouseLeave={() => !isDisabled && setHoverRating(0)}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill={(hoverRating || rating) >= star ? '#FFD700' : 'none'}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={(hoverRating || rating) >= star ? '#FFD700' : '#E5E7EB'} // Changed to lighter gray
            className="w-10 h-10 cursor-pointer transition-colors duration-300"
            animate={{
              rotate: (hoverRating || rating) >= star ? [0, -10, 10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951a1 1 0 00.95.69h4.161c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.951c.3.921-.755 1.688-1.538 1.118l-3.37-2.447a1 1 0 00-1.175 0l-3.37 2.447c-.783.57-1.838-.197-1.538-1.118l1.287-3.951a1 1 0 00-.364-1.118L2.663 9.378c-.783-.57-.38-1.81.588-1.81h4.161a1 1 0 00.95-.69l1.286-3.951z"
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  hoverRating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  setHoverRating: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

// EvaluateStudent Component
export default function EvaluateStudent({ params }) {
  const { team, student } = params;
  const { data: session, status } = useSession();
  const router = useRouter();

  // State variables for ratings and comments
  const [ratingConceptual, setRatingConceptual] = useState(0);
  const [hoverRatingConceptual, setHoverRatingConceptual] = useState(0);
  const [commentConceptual, setCommentConceptual] = useState('');

  const [ratingPractical, setRatingPractical] = useState(0);
  const [hoverRatingPractical, setHoverRatingPractical] = useState(0);
  const [commentPractical, setCommentPractical] = useState('');

  const [ratingWorkEthic, setRatingWorkEthic] = useState(0);
  const [hoverRatingWorkEthic, setHoverRatingWorkEthic] = useState(0);
  const [commentWorkEthic, setCommentWorkEthic] = useState('');

  const [ratingCooperation, setRatingCooperation] = useState(0);
  const [hoverRatingCooperation, setHoverRatingCooperation] = useState(0);
  const [commentCooperation, setCommentCooperation] = useState('');

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchExistingRating();
    } else if (status === 'unauthenticated') {
      router.push('/unauthorized');
    }
  }, [session, status]);

  const fetchExistingRating = async () => {
    try {
      const response = await fetch(
        `/api/teams/rating?evaluator=${session?.user?.username}&team=${team}&student=${student}`
      );

      const result = await response.json();

      if (result.rating) {
        const { ratings, comments } = result.rating;
        setRatingConceptual(ratings.conceptualContribution || 0);
        setCommentConceptual(comments.conceptualContribution || '');

        setRatingPractical(ratings.practicalContribution || 0);
        setCommentPractical(comments.practicalContribution || '');

        setRatingWorkEthic(ratings.workEthic || 0);
        setCommentWorkEthic(comments.workEthic || '');

        setRatingCooperation(ratings.cooperation || 0);
        setCommentCooperation(comments.cooperation || '');

        setIsDisabled(true);
      }
    } catch (error) {
      console.error('Error fetching existing rating:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (ratingConceptual === 0)
      newErrors.ratingConceptual = 'Please provide a rating.';
    if (ratingPractical === 0)
      newErrors.ratingPractical = 'Please provide a rating.';
    if (ratingWorkEthic === 0)
      newErrors.ratingWorkEthic = 'Please provide a rating.';
    if (ratingCooperation === 0)
      newErrors.ratingCooperation = 'Please provide a rating.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSubmissionStatus('error');
      return;
    }

    setLoading(true);

    const evaluationData = {
      evaluator: session?.user?.username,
      team,
      student,
      ratings: {
        conceptualContribution: ratingConceptual,
        practicalContribution: ratingPractical,
        workEthic: ratingWorkEthic,
        cooperation: ratingCooperation,
      },
      comments: {
        conceptualContribution: commentConceptual,
        practicalContribution: commentPractical,
        workEthic: commentWorkEthic,
        cooperation: commentCooperation,
      },
    };

    try {
      const response = await fetch('/api/teams/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      });
      const result = await response.json();

      if (result.success) {
        setSubmissionStatus('success');
        setIsDisabled(true);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <NavBar role={session?.user?.role || 'student'} />

      <div className="relative container mx-auto px-6 py-16 z-10">
        <Card className="max-w-3xl mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-white mb-2">
              Evaluate Team Member
            </CardTitle>
            <CardDescription className="text-xl text-gray-200">
              Provide your evaluation for{' '}
              <span className="text-yellow-300">{student}</span> in the following
              areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Conceptual Contribution */}
              <div className="mb-10">
                <label
                  htmlFor="conceptual"
                  className="block text-2xl font-semibold text-white mb-4"
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
                  placeholder="Share your thoughts..."
                  value={commentConceptual}
                  onChange={(e) => setCommentConceptual(e.target.value)}
                  disabled={isDisabled}
                  className="mt-4 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:bg-opacity-20 transition duration-300"
                />
                {errors.ratingConceptual && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Missing Rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for conceptual contribution.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Practical Contribution */}
              <div className="mb-10">
                <label
                  htmlFor="practical"
                  className="block text-2xl font-semibold text-white mb-4"
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
                  placeholder="Share your thoughts..."
                  value={commentPractical}
                  onChange={(e) => setCommentPractical(e.target.value)}
                  disabled={isDisabled}
                  className="mt-4 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:bg-opacity-20 transition duration-300"
                />
                {errors.ratingPractical && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Missing Rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for practical contribution.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Work Ethic */}
              <div className="mb-10">
                <label
                  htmlFor="workEthic"
                  className="block text-2xl font-semibold text-white mb-4"
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
                  placeholder="Share your thoughts..."
                  value={commentWorkEthic}
                  onChange={(e) => setCommentWorkEthic(e.target.value)}
                  disabled={isDisabled}
                  className="mt-4 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:bg-opacity-20 transition duration-300"
                />
                {errors.ratingWorkEthic && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Missing Rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for work ethic.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Cooperation */}
              <div className="mb-10">
                <label
                  htmlFor="cooperation"
                  className="block text-2xl font-semibold text-white mb-4"
                >
                  Cooperation
                </label>
                <StarRating
                  rating={ratingCooperation}
                  hoverRating={hoverRatingCooperation}
                  setRating={setRatingCooperation}
                  setHoverRating={setHoverRatingCooperation}
                  isDisabled={isDisabled}
                />
                <Textarea
                  id="cooperation"
                  placeholder="Share your thoughts..."
                  value={commentCooperation}
                  onChange={(e) => setCommentCooperation(e.target.value)}
                  disabled={isDisabled}
                  className="mt-4 bg-white bg-opacity-10 text-white placeholder-gray-300 focus:bg-opacity-20 transition duration-300"
                />
                {errors.ratingCooperation && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Missing Rating</AlertTitle>
                    <AlertDescription>
                      Please provide a rating for cooperation.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mt-12">
                <Button
                  type="submit"
                  className="w-full py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={isDisabled || loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-6 w-6 mx-auto text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  ) : (
                    'Submit Evaluation'
                  )}
                </Button>

                {submissionStatus === 'success' && (
                  <Alert variant="success" className="mt-6 bg-green-500 bg-opacity-20">
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your evaluation has been submitted successfully.
                    </AlertDescription>
                  </Alert>
                )}
                {submissionStatus === 'error' && (
                  <Alert variant="destructive" className="mt-6 bg-red-500 bg-opacity-20">
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
    </>
  );
}

EvaluateStudent.propTypes = {
  params: PropTypes.shape({
    team: PropTypes.string.isRequired,
    student: PropTypes.string.isRequired,
  }).isRequired,
};