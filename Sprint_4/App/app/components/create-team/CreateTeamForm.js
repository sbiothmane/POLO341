// components/create-team/CreateTeamForm.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { User, Upload, CheckCircle, XCircle } from 'lucide-react'
import StudentTable from './StudentTable'

export default function CreateTeamForm({ session }) {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [clickedStudents, setClickedStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [teamName, setTeamName] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [isTeamNameValid, setIsTeamNameValid] = useState(true)

  const teamNameRegex = /^[a-zA-Z0-9-_]+$/

  useEffect(() => {
    if (teamName === '' || teamNameRegex.test(teamName)) {
      setIsTeamNameValid(true)
    } else {
      setIsTeamNameValid(false)
    }
  }, [teamName])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students/students')
        if (!response.ok) throw new Error('Failed to fetch students')

        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error('Error fetching students:', error)
        setStatusMessage({ type: 'error', message: 'Failed to fetch students' })
      }
    }
    fetchStudents()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const formattedData = results.data.map((item) => ({
            username: item.username,
            name: item.fullname,
            id: item.id,
          }))
          setStudents(formattedData)
          setIsFileUploaded(true)
        },
        header: true,
        skipEmptyLines: true,
      })
    }
  }

  const handleStudentClick = (student) => {
    if (clickedStudents.some((s) => s.id === student.id)) {
      setClickedStudents(clickedStudents.filter((s) => s.id !== student.id))
    } else if (clickedStudents.length < 6) {
      setClickedStudents([...clickedStudents, student])
    }
  }

  const handleCreateTeam = async () => {
    try {
      const selectedStudentUsernames = clickedStudents.map((student) => student.username)

      const teamData = {
        instructor: session?.user?.username || 'defaultUser',
        teamName,
        students: selectedStudentUsernames,
      }

      const response = await fetch('/api/students/teamcreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      })

      const result = await response.json()
      if (!response.ok) {
        let message = result.message || 'Failed to create team'
        throw new Error(message)
      }

      setStatusMessage({ type: 'success', message: 'Team created successfully!' })

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message || 'Failed to create the team.' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-lg border-none mb-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-800">
            Create a Team
          </CardTitle>
          <CardDescription>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>
                <User className="inline mr-1 h-5 w-5 text-blue-500" /> Instructor: {session.user.name}
              </span>
              <Badge className="bg-blue-500 text-white capitalize">
                {session.user.role}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8 w-full">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
                Import Student CSV
              </h2>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV file only</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 w-full">
              {students.length > 0 && (
                <motion.div
                  className="w-full lg:w-3/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
                    All Students
                  </h2>
                  <div className="flex space-x-4 mb-4">
                    <Input
                      type="text"
                      className={`flex-grow ${
                        isTeamNameValid ? '' : 'border-red-500'
                      }`}
                      placeholder="Team Name (URL-safe)"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  {!isTeamNameValid && (
                    <p className="text-red-500 text-sm mb-4">
                      Team name contains invalid characters. Use only letters, numbers, dashes (-), and underscores (_).
                    </p>
                  )}
                  <StudentTable
                    students={students.filter((student) =>
                      student.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )}
                    onStudentClick={handleStudentClick}
                    selectedStudents={clickedStudents}
                    searchTerm={searchTerm}
                    onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>
              )}

              <motion.div
                className="w-full lg:w-2/5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
                  Selected Students
                </h2>

                <AnimatePresence>
                  {statusMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-center mb-4 p-2 rounded ${
                        statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {statusMessage.type === 'error' ? (
                        <XCircle className="inline-block mr-2" />
                      ) : (
                        <CheckCircle className="inline-block mr-2" />
                      )}
                      {statusMessage.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {clickedStudents.length > 1 && teamName !== '' && isTeamNameValid ? (
                  <Button
                    onClick={handleCreateTeam}
                    className="w-full mb-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Create Team
                  </Button>
                ) : (
                  <p className="text-center text-gray-600 mb-4">
                    {clickedStudents.length < 2 && teamName === ''
                      ? 'Select at least 2 students and provide a team name.'
                      : clickedStudents.length < 2
                      ? 'Select at least 2 students.'
                      : 'Provide a valid team name.'}
                  </p>
                )}
                {clickedStudents.length > 0 ? (
                  <StudentTable
                    students={clickedStudents}
                    onStudentClick={handleStudentClick}
                    selectedStudents={clickedStudents}
                    searchTerm=""
                    onSearchTermChange={() => {}}
                  />
                ) : (
                  <p className="text-center text-gray-600">
                    No students selected yet.
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
