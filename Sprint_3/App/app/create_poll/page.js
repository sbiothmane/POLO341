
'use client';
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase'; // Adjust the path based on your project structure
import { collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const PollForm = () => {
    const { data: session, status } = useSession();

    if (status === 'unauthenticated') {
        return <p className="text-red-500 text-center mt-8">You are not signed in.</p>;
    }

    let usernames;
    if (session) {
        const username = session.user.username;
        usernames = username;
    }
    let username = usernames;

  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [pollExists, setPollExists] = useState(false);

  // Check if the instructor already has a poll
  useEffect(() => {
    const checkPollExists = async () => {
      const pollRef = doc(db, 'polls', username);
      const pollDoc = await getDoc(pollRef);
      if (pollDoc.exists()) {
        setPollExists(true);
      } else {
        setPollExists(false);
      }
    };

    checkPollExists();
  }, [username]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionText.trim() || answers.some(a => !a.trim())) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Check if poll already exists
      if (pollExists) {
        alert('You already have a question created.');
        return;
      }

      // Create the main poll document for this instructor
      const pollRef = doc(collection(db, 'polls'), username);
      await setDoc(pollRef, { createdBy: username });

      // Create the question document with 4 answers
      const questionRef = doc(pollRef, 'question', 'questionData');
      await setDoc(questionRef, {
        questionText,
        instructorUsername: username,
        answers: answers.map(answer => ({
          answerText: answer,
          studentAnswers: [] // Array to hold students who selected this answer
        }))
      });

      alert('Question created successfully!');
      setQuestionText("");
      setAnswers(["", "", "", ""]);
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Error creating question. Try again later.');
    }
  };

  const handleDeletePoll = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your question?');
    if (confirmDelete) {
      try {
        // Delete the poll document and its question
        const pollRef = doc(db, 'polls', username);
        await deleteDoc(pollRef);

        alert('Question deleted successfully!');
        setPollExists(false); // Reset the state to allow poll creation again if needed
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question. Try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create a Question</h1>

        {pollExists ? (
          <div className="text-center">
            <h2 className="text-xl text-red-500 mb-4">You already have a question created!</h2>
            <button
              onClick={handleDeletePoll}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Delete Question
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-gray-700 font-medium">Question Text</label>
              <input
                type="text"
                id="question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full text-black p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              {answers.map((answer, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={`answer${index}`} className="block text-gray-700 font-medium">Answer Option {index + 1}</label>
                  <input
                    type="text"
                    id={`answer${index}`}
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full p-3 text-black mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4  bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create Question
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PollForm;