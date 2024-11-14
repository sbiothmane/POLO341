'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const StudentPoll = ({ instructorUsername }) => {
  const { data: session, status } = useSession();
  const [pollData, setPollData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  const username = session?.user?.username;

  useEffect(() => {
    const fetchPollData = async () => {
      setLoading(true);
      try {
        if (status === 'authenticated' && instructorUsername && username) {
          const pollRef = doc(db, 'polls', instructorUsername, 'question', 'questionData');
          const pollSnapshot = await getDoc(pollRef);

          if (pollSnapshot.exists()) {
            const poll = pollSnapshot.data();
            console.log('Fetched Poll Data:', poll); // Debug log for fetched poll data
            setPollData(poll);

            // Check if the student has already answered the poll
            const studentAnswered = poll.answers.some((answer) =>
              answer.studentAnswers?.includes(username) // Check if student's username is in any of the answer's studentAnswers
            );
            console.log('Has answered:', studentAnswered); // Debug log for checking answer status
            setHasAnswered(studentAnswered);
          } else {
            setPollData(null);
          }
        } else {
          setPollData(null);
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();

  }, [status, instructorUsername, username]);

  // Clear instructor's username from localStorage on logout
  useEffect(() => {
    if (status === 'unauthenticated') {
      localStorage.removeItem('instructorUsername');
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAnswer) {
      alert('Please select an answer.');
      return;
    }

    try {
      const pollRef = doc(db, 'polls', instructorUsername, 'question', 'questionData');
      
      // Find the index of the selected answer
      const answerIndex = pollData.answers.findIndex(
        (answer) => answer.answerText === selectedAnswer
      );

      if (answerIndex !== -1) {
        const answerPath = `answers.${answerIndex}.studentAnswers`;

        // Update the poll by adding the student's username to the selected answer's studentAnswers array
        await updateDoc(pollRef, {
          [answerPath]: arrayUnion(username),
        });

        alert('Your response has been recorded!');
        setHasAnswered(true);  // Set as answered so we don't show the poll again
      } else {
        alert('Invalid answer selection.');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return <p className="text-center">Loading poll...</p>;
  }

  if (!pollData) {
    return <p className="text-center text-gray-500">No poll available for this instructor.</p>;
  }

  if (hasAnswered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-green-500 mb-6">
            You have already answered this poll.
          </h1>
          <h2 className="text-xl text-center font-semibold mb-4">{pollData.questionText}</h2>
          <ul className="space-y-2">
            {Array.isArray(pollData.answers) &&
              pollData.answers.map((answer, index) => (
                <li key={index} className="flex justify-between text-gray-700">
                  <span>{answer.answerText}</span>
                  <span>{answer.studentAnswers?.includes(username) ? '✓' : ''}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold text-center text-gray-800 mb-4">
          {pollData.questionText}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 space-y-2">
            {Array.isArray(pollData.answers) &&
              pollData.answers.map((answer, index) => (
                <div key={index}>
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="radio"
                      name="pollAnswer"
                      value={answer.answerText}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="mr-2"
                      required
                    />
                    {answer.answerText}
                  </label>
                </div>
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-1 px-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentPoll;
