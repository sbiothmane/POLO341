"use client";
import React from "react";

import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation'
import NavBar from '../../../components/NavBar';

export default function EvaluateStudent({ params }) {
    const { team, student } = params;
    const { data: session } = useSession();
    const router = useRouter(); // Initialize the router

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

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [existingRating, setExistingRating] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDisabled, setIsDisabled] = useState(false); // To disable form fields if rating exists

    // Fetch the existing rating when the page loads
    useEffect(() => {
        if (session) {
            fetchExistingRating();
        }
    }, [session]);

    const fetchExistingRating = async () => {
        try {
            const response = await fetch('/api/teams/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    evaluator: session?.user?.username, // Current user
                    team,
                    student,
                }),
            });

            const result = await response.json();

            if (result.rating) {
                // Pre-populate the form with the existing rating
                const { ratings, comments } = result.rating;
                setRatingConceptual(ratings.conceptualContribution || 0);
                setCommentConceptual(comments.conceptualContribution || '');

                setRatingPractical(ratings.practicalContribution || 0);
                setCommentPractical(comments.practicalContribution || '');

                setRatingWorkEthic(ratings.workEthic || 0);
                setCommentWorkEthic(comments.workEthic || '');

                setExistingRating(result.rating); // Save the existing rating
                setIsDisabled(true); // Disable the form if the rating already exists
            }
        } catch (error) {
            console.error('Error fetching existing rating:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logic
        const newErrors = {};
        if (ratingConceptual === 0) newErrors.ratingConceptual = 'Please provide a rating.';
        if (ratingPractical === 0) newErrors.ratingPractical = 'Please provide a rating.';
        if (ratingWorkEthic === 0) newErrors.ratingWorkEthic = 'Please provide a rating.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSubmissionStatus('error');
            return;
        }

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
        };

        try {
            const response = await fetch('/api/teams/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluationData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmissionStatus('success');
                resetForm();
                router.push('/dashboard'); // Redirect to dashboard after successful submission
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            setSubmissionStatus('error');
        }
    };

    const resetForm = () => {
        setRatingConceptual(0);
        setCommentConceptual('');
        setRatingPractical(0);
        setCommentPractical('');
        setRatingWorkEthic(0);
        setCommentWorkEthic('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="flex items-center justify-center p-6">
                <div className="bg-white shadow-xl rounded-lg p-8 max-w-2xl w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Evaluate <span className="text-blue-500">{student}</span> from Team{' '}
                        <span className="text-blue-500">{team}</span>
                    </h1>

                    <form onSubmit={handleSubmit}>
                        {/* Conceptual Contribution */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    Conceptual Contribution
                                </h2>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={`conceptual-${star}`}
                                            className={`cursor-pointer text-3xl transition-colors duration-200 ${(hoverRatingConceptual || ratingConceptual) >= star
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                            onClick={() => !isDisabled && setRatingConceptual(star)}
                                            onMouseEnter={() => !isDisabled && setHoverRatingConceptual(star)}
                                            onMouseLeave={() => !isDisabled && setHoverRatingConceptual(0)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {errors.ratingConceptual && (
                                <p className="text-red-500 text-sm mb-2">{errors.ratingConceptual}</p>
                            )}
                            <textarea
                                id="commentConceptual"
                                rows="3"
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Comments on conceptual contribution..."
                                value={commentConceptual}
                                onChange={(e) => setCommentConceptual(e.target.value)}
                                disabled={isDisabled} // Disable the textarea if the rating exists
                                style={{ color: 'black' }} // Ensure the text is black
                            />
                        </div>

                        {/* Practical Contribution */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    Practical Contribution
                                </h2>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={`practical-${star}`}
                                            className={`cursor-pointer text-3xl transition-colors duration-200 ${(hoverRatingPractical || ratingPractical) >= star
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                            onClick={() => !isDisabled && setRatingPractical(star)}
                                            onMouseEnter={() => !isDisabled && setHoverRatingPractical(star)}
                                            onMouseLeave={() => !isDisabled && setHoverRatingPractical(0)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {errors.ratingPractical && (
                                <p className="text-red-500 text-sm mb-2">{errors.ratingPractical}</p>
                            )}
                            <textarea
                                id="commentPractical"
                                rows="3"
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Comments on practical contribution..."
                                value={commentPractical}
                                onChange={(e) => setCommentPractical(e.target.value)}
                                disabled={isDisabled} // Disable the textarea if the rating exists
                                style={{ color: 'black' }} // Ensure the text is black
                            />
                        </div>

                        {/* Work Ethic */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-semibold text-gray-700">Work Ethic</h2>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={`workethic-${star}`}
                                            className={`cursor-pointer text-3xl transition-colors duration-200 ${(hoverRatingWorkEthic || ratingWorkEthic) >= star
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                            onClick={() => !isDisabled && setRatingWorkEthic(star)}
                                            onMouseEnter={() => !isDisabled && setHoverRatingWorkEthic(star)}
                                            onMouseLeave={() => !isDisabled && setHoverRatingWorkEthic(0)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {errors.ratingWorkEthic && (
                                <p className="text-red-500 text-sm mb-2">{errors.ratingWorkEthic}</p>
                            )}
                            <textarea
                                id="commentWorkEthic"
                                rows="3"
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Comments on work ethic..."
                                value={commentWorkEthic}
                                onChange={(e) => setCommentWorkEthic(e.target.value)}
                                disabled={isDisabled} // Disable the textarea if the rating exists
                                style={{ color: 'black' }} // Ensure the text is black
                            />
                        </div>

                        {/* Submit Button */}
                        {!isDisabled && (
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 rounded-md hover:from-blue-600 hover:to-indigo-600 transition-colors duration-300"
                            >
                                Submit Evaluation
                            </button>
                        )}
                    </form>

                    {/* Submission Status */}
                    {submissionStatus === 'success' && (
                        <p className="text-green-500 text-center mt-6 text-lg">
                            Evaluation submitted successfully!
                        </p>
                    )}
                    {submissionStatus === 'error' && (
                        <p className="text-red-500 text-center mt-6 text-lg">
                            Error submitting evaluation.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
