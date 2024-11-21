'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, PieChart, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TeamCard({ team, instructor, role }) {
  const [isHovered, setIsHovered] = useState(false)

  const displayedStudents = isHovered
    ? team.students
    : team.students.slice(0, 3)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg transition-all duration-300 transform hover:scale-105">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Link
              href={`/team/${team.name}`}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Users className="inline mr-2 h-6 w-6 text-blue-800" />
              {team.name}
            </Link>
            <Badge className="bg-blue-500 text-white">{instructor}</Badge>
          </CardTitle>
          {role === 'student' && (
            <CardDescription>
              <div className="flex space-x-2 mt-2">
                <Link href={`/polls/${instructor}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <PieChart className="mr-1 h-4 w-4 text-blue-500" />
                    Polls
                  </Button>
                </Link>
                <Link href={`/OfficeHours/${instructor}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-blue-500" />
                    Office Hours
                  </Button>
                </Link>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {displayedStudents.map((student) => (
                  <Link
                    key={student}
                    href={
                      role === 'student'
                        ? `/evaluate/${team.name}/${student}`
                        : '#'
                    }
                    className={`flex items-center p-2 rounded-md ${
                      role === 'student'
                        ? 'hover:bg-blue-50 transition-colors cursor-pointer'
                        : 'opacity-50 cursor-default'
                    }`}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{student[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">{student}</span>
                  </Link>
                ))}
              </div>
              {team.students.length > 3 && !isHovered && (
                <div className="mt-2 text-center text-sm text-gray-500">
                  +{team.students.length - 3} more
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent> 
      </Card>
    </motion.div>
  )
}

// PropTypes validation
TeamCard.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    students: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  instructor: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['student', 'instructor']).isRequired,
}
