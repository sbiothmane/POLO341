'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TeamCard from './TeamCard'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Loader2 } from 'lucide-react'
import PropTypes from 'prop-types'

export default function TeamBox({ instructor, student }) {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Construct query parameters
        const queryParams = new URLSearchParams()
        if (instructor) queryParams.append('instructor', instructor)
        if (student) queryParams.append('student', student)

        const url = `/api/teams/teamsInfo?${queryParams.toString()}`

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) throw new Error('Failed to fetch team data')

        const data = await response.json()
        setTeams(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [instructor, student])

  // Determine messages based on props
  const noTeamsMessage = instructor
    ? 'You have not created any teams yet.'
    : student
    ? 'You are not part of any teams yet.'
    : 'No teams available at the moment.'

  const headingText = instructor || student ? 'My Teams' : 'All Teams'

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>
  }

  if (teams.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-lg border-none">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Users className="h-12 w-12 text-blue-800 mb-4" />
          <p className="text-lg font-medium text-center">{noTeamsMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-black">
        {headingText}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <TeamCard
            key={team.id || team._id}
            team={team}
            instructor={team.instructor}
            role={student ? 'student' : 'instructor'}
          />
        ))}
      </div>
    </motion.div>
  )
}

TeamBox.propTypes = {
  instructor: PropTypes.string,
  student: PropTypes.string,
}
