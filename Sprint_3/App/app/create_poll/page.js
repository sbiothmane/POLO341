// app/create_poll/page.js
"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePollPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [hasActivePoll, setHasActivePoll] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'instructor') {
      checkActivePoll();
    } else if (status === 'authenticated') {
      // Redirect if not an instructor
      router.push('/unauthorized');
    }
  }, [status, session, router]);

  const checkActivePoll = async () => {
    try {
      const response = await fetch(`/api/polls/check?instructor=${session.user.username}`);
      const data = await response.json();

      if (data.activePoll) {
        setHasActivePoll(true);
        router.push(`/polls/${session.user.username}`); // Redirect to the poll results page if there's an active poll
      }
    } catch (error) {
      console.error('Error checking active poll:', error);
    }
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, '']);
  };

  const removeChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pollData = {
      question,
      choices: choices.filter((choice) => choice.trim() !== ''),
      instructor: session.user.username,
    };

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error('Failed to create poll');
      }

      router.push(`/polls/${session.user.username}`);
    } catch (error) {
      console.error('Error creating poll:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Create a Poll</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="Enter your poll question here..."
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all text-black"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">Choices</label>
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  required
                  placeholder={`Choice ${index + 1}`}
                  className="flex-grow p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all text-black"
                />
                {choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChoice}
              className="text-blue-500 hover:text-blue-700 underline transition-colors"
            >
              + Add Another Choice
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
        </form>
      </div>
    </div>
  );
}
