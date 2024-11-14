'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { User, Users, Clock, PieChart, Loader2, Upload, Search, CheckCircle, XCircle } from 'lucide-react'

const AnimatedSphere = () => {
  return (
    <Sphere args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#FFFFFF"
        attach="material"
        distort={0.5}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <AnimatedSphere />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-purple-50/70 to-pink-50/70" />
    </div>
  )
}

const NavBar = ({ role }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-gray-200/20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-gray-800">
          PeerAssess
        </Link>
        <div className="flex items-center space-x-4">
          {role === 'instructor' && (
            <div className="flex space-x-2">
              <Link href="/create_time">
                <Button
                  variant="outline"
                  className="flex items-center bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Office Hours
                </Button>
              </Link>
              <Link href="/create_poll">
                <Button
                  variant="outline"
                  className="flex items-center bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white"
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Polls
                </Button>
              </Link>
              <Link href="/create_teams">
                <Button
                  variant="outline"
                  className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Team
                </Button>
              </Link>
            </div>
          )}
          <Button
            variant="ghost"
            className="text-gray-800 flex items-center"
            onClick={() => signOut()}
          >
            <User className="mr-2 h-5 w-5 text-gray-800" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

const StudentTable = ({ students, onStudentClick, selectedStudents }) => {
  return (
    <div className="overflow-y-auto max-h-[400px] w-full rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id}
              onClick={() => onStudentClick(student)}
              className={`cursor-pointer transition-colors ${
                selectedStudents.some((s) => s.id === student.id)
                  ? 'bg-blue-50 hover:bg-blue-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell
                className={
                  selectedStudents.some((s) => s.id === student.id)
                    ? 'text-blue-600 font-semibold'
                    : ''
                }
              >
                {student.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function CreateTeamPage() {
  const { data: session, status } = useSession()
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

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <p className="text-red-500 text-center mt-8">You are not signed in.</p>
    )
  }

  if (session && session.user.role === 'instructor') {
    return (
      <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <AnimatedBackground />
        <NavBar role={session.user.role} />
        <main className="pt-24 relative z-10">
          <section className="py-20">
            <div className="container mx-auto px-6">
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
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                              <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  type="text"
                                  className="pl-10 w-full"
                                  placeholder="Search Students"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                              </div>
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
            </div>
          </section>
        </main>

        <footer className="bg-white/10 backdrop-blur-lg py-8">
          <div className="container mx-auto px-6 text-center text-gray-800">
            <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <p className="text-red-500 text-center mt-8">
      You are not authorized to access this page.
    </p>
  )
}