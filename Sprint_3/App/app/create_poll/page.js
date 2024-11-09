'use client';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

const PollForm = () => {
  const { data: session, status } = useSession();
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [pollExists, setPollExists] = useState(false);
  const [pollStats, setPollStats] = useState(null);

  const username = session?.user?.username;

  useEffect(() => {
    if (!username) return;
  
    const fetchPollData = async () => {
      try {
        const pollRef = doc(db, 'polls', username, 'question', 'questionData');
        const pollDoc = await getDoc(pollRef);
  
        if (pollDoc.exists()) {
          setPollExists(true);
          setPollStats(pollDoc.data());
        } else {
          setPollExists(false);
          setPollStats(null);
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
      }
    };
  
    fetchPollData();
  }, [username]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || answers.some((a) => !a.trim())) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const pollRef = doc(db, 'polls', username, 'question', 'questionData');
      await setDoc(pollRef, {
        questionText,
        answers: answers.map((answer) => ({
          answerText: answer,
          studentAnswers: [],
        })),
      });

      alert('Poll created successfully!');
      setPollExists(true);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Error creating poll. Try again later.');
    }
  };

  const calculateStats = () => {
    if (!pollStats || !Array.isArray(pollStats.answers)) return [];
  
    const totalResponses = pollStats.answers.reduce(
      (sum, ans) => sum + (Array.isArray(ans.studentAnswers) ? ans.studentAnswers.length : 0),
      0
    );
  
    return pollStats.answers.map((answer) => {
      const responseCount = Array.isArray(answer.studentAnswers) ? answer.studentAnswers.length : 0;
      const percentage = totalResponses ? ((responseCount / totalResponses) * 100).toFixed(2) : 0;
      return { answerText: answer.answerText, percentage: `${percentage}%` };
    });
  };

  const handleDeletePoll = async () => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;

    try {
      const pollRef = doc(db, 'polls', username, 'question', 'questionData');
      await deleteDoc(pollRef);

      const parentPollRef = doc(db, 'polls', username);
      await deleteDoc(parentPollRef);

      alert('Poll deleted successfully!');
      setPollExists(false);
      setPollStats(null);
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete the poll. Try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {pollExists ? 'Poll Stats' : 'Create a Question'}
        </h1>

        {pollExists && pollStats ? (
          <>
          <p className="text-xl text-black font-semibold mb-4">{pollStats.questionText}</p>
          <ul className="mb-6">
            {calculateStats().map((stat, index) => (
              <li key={index} className="flex justify-between text-black  items-center mb-2">
                <span>{stat.answerText}</span>
                <span>{stat.percentage}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleDeletePoll}
            className="w-full py-2 px-4 bg-red-600 text-black rounded-md hover:bg-red-700 transition duration-200"
          >
            Delete Poll
          </button>
        </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-gray-700 font-medium">
                Question Text
              </label>
              <input
                type="text"
                id="question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-3 text-black mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              {answers.map((answer, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={`answer${index}`} className="block text-gray-700 font-medium">
                    Answer Option {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`answer${index}`}
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full p-3 text-black mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create Poll
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PollForm;
