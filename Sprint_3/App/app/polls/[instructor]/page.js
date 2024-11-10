// app/polls/[instructor]/page.js
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

export default function PollsPage({ params }) {
  const { instructor } = params;
  const { data: session } = useSession();
  const router = useRouter();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Determine if the user is the instructor
  const isInstructor = session?.user?.role === 'instructor' && session.user.username === instructor;

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const pollsCollection = collection(db, 'polls');
        const q = query(pollsCollection, where('instructor', '==', instructor));
        const querySnapshot = await getDocs(q);

        const fetchedPolls = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (fetchedPolls.length > 0) {
          const poll = fetchedPolls[0];
          setHasVoted(poll.voters?.includes(session.user.username));
          setShowResults(isInstructor || poll.voters?.includes(session.user.username));
        }

        setPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [instructor, session, isInstructor]);

  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const handleVoteSubmit = async (pollId) => {
    if (isInstructor) {
      alert("Instructors cannot vote on their own polls.");
      return;
    }

    if (selectedChoice === null) {
      alert("Please select an option to vote.");
      return;
    }

    try {
      const pollRef = doc(db, 'polls', pollId);
      const poll = polls.find((p) => p.id === pollId);

      // Update the vote count for the selected choice
      const updatedChoices = poll.choices.map((choice, index) => 
        index === selectedChoice ? { ...choice, votes: choice.votes + 1 } : choice
      );

      // Update the poll document with the new vote count and add the voter
      await updateDoc(pollRef, {
        choices: updatedChoices,
        voters: arrayUnion(session.user.username),
      });

      setPolls(polls.map((p) => (p.id === pollId ? { ...p, choices: updatedChoices, voters: [...(poll.voters || []), session.user.username] } : p)));
      setShowResults(true);
      setHasVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleEndPoll = async () => {
    if (!confirm("Are you sure you want to end this poll?")) return;

    try {
      const response = await fetch('/api/polls/end', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructor }),
      });

      if (!response.ok) {
        throw new Error('Failed to end poll');
      }

      alert('Poll ended successfully. You can create a new poll now.');
      router.push('/create_poll');
    } catch (error) {
      console.error('Error ending poll:', error);
      alert('Failed to end the poll. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
        Polls by {instructor}
      </h1>

      {loading ? (
        <p className="text-lg text-gray-600">Loading polls...</p>
      ) : (
        <div className="space-y-8 w-full max-w-lg">
          {polls.length > 0 ? (
            polls.map((poll) => {
              const totalVotes = poll.choices.reduce((acc, choice) => acc + choice.votes, 0);

              return (
                <div key={poll.id} className="p-6 bg-white rounded-lg shadow-md border">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {poll.question}
                  </h2>
                  <div className="space-y-3">
                    {poll.choices.map((choice, index) => {
                      const percentage = calculatePercentage(choice.votes, totalVotes);

                      return (
                        <div key={index} className="w-full">
                          <div
                            className={`flex justify-between items-center mb-1 ${
                              showResults || hasVoted ? '' : 'cursor-pointer hover:bg-gray-100 rounded-md p-2'
                            }`}
                            onClick={() => !showResults && !hasVoted && !isInstructor && setSelectedChoice(index)}
                          >
                            <span
                              className={`text-gray-700 ${
                                selectedChoice === index && !showResults && !hasVoted && !isInstructor ? 'font-bold text-blue-600' : ''
                              }`}
                            >
                              {choice.text}
                            </span>
                            {showResults && (
                              <span className="text-gray-600">
                                {percentage}% ({choice.votes} votes)
                              </span>
                            )}
                          </div>
                          {showResults && (
                            <div className="w-full bg-gray-300 rounded-full h-4">
                              <div
                                style={{ width: `${percentage}%` }}
                                className={`h-full rounded-full ${
                                  percentage > 0 ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {!showResults && !hasVoted && !isInstructor && (
                    <button
                      onClick={() => handleVoteSubmit(poll.id)}
                      className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Submit Vote
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-lg text-gray-600 text-center">No polls available for this instructor.</p>
          )}
          {isInstructor && (
            <button
              onClick={handleEndPoll}
              className="mt-4 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              End Poll
            </button>
          )}
        </div>
      )}
    </div>
  );
}
