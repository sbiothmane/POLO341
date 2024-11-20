// components/polls/PollCard.js
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Vote } from 'lucide-react'

export default function PollCard({
  poll,
  isInstructor,
  hasVoted,
  handleVoteSubmit,
  selectedChoice,
  setSelectedChoice,
  showResults,
}) {
  const totalVotes = poll.choices.reduce((acc, choice) => acc + choice.votes, 0)

  const calculatePercentage = (votes, totalVotes) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/20 backdrop-blur-lg border-none shadow-lg mb-6">
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
          {totalVotes > 0 && (
            <CardDescription>
              Total votes: {totalVotes}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {poll.choices.map((choice, index) => {
            const percentage = calculatePercentage(choice.votes, totalVotes)

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`rounded-lg p-4 transition-all ${
                    !showResults && !hasVoted && !isInstructor
                      ? 'cursor-pointer hover:bg-blue-50'
                      : ''
                  } ${
                    selectedChoice === index
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white/20'
                  }`}
                  onClick={() =>
                    !showResults &&
                    !hasVoted &&
                    !isInstructor &&
                    setSelectedChoice(index)
                  }
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {choice.text}
                    </span>
                    {showResults && (
                      <Badge variant="secondary">
                        {percentage}% ({choice.votes})
                      </Badge>
                    )}
                  </div>
                  {showResults && (
                    <motion.div
                      className="h-2 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {!showResults && !hasVoted && !isInstructor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => handleVoteSubmit(poll.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={selectedChoice === null}
              >
                <Vote className="mr-2 h-4 w-4" />
                Submit Vote
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
