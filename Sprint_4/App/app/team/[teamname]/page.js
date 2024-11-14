'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Users, User, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import NavBar from '../../components/NavBar'
import Footer from '@/app/components/Footer'

const AnimatedSphere = () => {
  return (
    <Sphere args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#4F46E5"
        attach="material"
        distort={0.3}
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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-purple-50/70 to-pink-50/70" />
    </div>
  )
}

const TeamPage = () => {
  const router = useRouter()
  const [baseRatingsTable, setBaseRatingsTable] = useState([])
  const [summaryTable, setSummaryTable] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const { teamname: teamName } = useParams()
  const { data: session } = useSession()

  const isInstructor = session?.user?.role === 'instructor'

  useEffect(() => {
    if (!teamName || !isInstructor) return

    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/teams/getTeamRatings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamName }),
        })

        const result = await response.json()
        if (response.ok) {
          console.log("Fetched ratings:", result.ratings)
          setBaseRatingsTable(result.ratings)
          createSummaryTable(result.ratings)
        } else {
          console.error('Error fetching team ratings:', result.message)
        }
      } catch (error) {
        console.error('Error fetching team ratings:', error)
      }
    }

    fetchRatings()
  }, [teamName, isInstructor])

  const handleStudentClick = (studentId) => {
    router.push(`/team/${teamName}/${studentId}`)
  }

  const createSummaryTable = (ratings) => {
    const summaryData = {}

    ratings.forEach((rating) => {
      const { studentId, lastName, firstName, ratings } = rating

      if (!summaryData[studentId]) {
        summaryData[studentId] = {
          studentId,
          lastName,
          firstName,
          cooperationTotal: 0,
          conceptualTotal: 0,
          practicalTotal: 0,
          workEthicTotal: 0,
          peersResponded: 0,
        }
      }

      summaryData[studentId].cooperationTotal += ratings.cooperation
      summaryData[studentId].conceptualTotal += ratings.conceptual
      summaryData[studentId].practicalTotal += ratings.practical
      summaryData[studentId].workEthicTotal += ratings.workEthic
      summaryData[studentId].peersResponded += 1
    })

    const summaryArray = Object.values(summaryData).map((student) => ({
      studentId: student.studentId,
      lastName: student.lastName,
      firstName: student.firstName,
      cooperation: (student.cooperationTotal / student.peersResponded).toFixed(2),
      conceptual: (student.conceptualTotal / student.peersResponded).toFixed(2),
      practical: (student.practicalTotal / student.peersResponded).toFixed(2),
      workEthic: (student.workEthicTotal / student.peersResponded).toFixed(2),
      average: (
        (student.cooperationTotal + student.conceptualTotal + student.practicalTotal + student.workEthicTotal) / (4 * student.peersResponded)
      ).toFixed(2),
      peersResponded: student.peersResponded,
    }))

    setSummaryTable(summaryArray)
  }

  const sortTable = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedData = [...summaryTable].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
      return 0
    })

    setSummaryTable(sortedData)
  }

  if (!isInstructor) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-pink-50">
        <NavBar />
        <AnimatedBackground />
        <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-600">
                  <AlertTriangle size={24} />
                  <p className="text-lg font-semibold">You do not have permission to view the ratings.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-pink-50">
      <NavBar />
      <AnimatedBackground />
      <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg mb-10">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Users className="text-indigo-500" size={32} />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">Team Rating Summary</CardTitle>
                  <CardDescription className="text-lg text-gray-600">{teamName}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Student ID', 'Last Name', 'First Name', 'Cooperation', 'Conceptual Contribution', 'Practical Contribution', 'Work Ethic', 'Average', 'Peers Who Responded'].map((header) => (
                        <TableHead key={header} className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => sortTable(header.toLowerCase().replace(/\s+/g, ''))}
                            className="font-bold text-indigo-700 hover:text-indigo-900"
                          >
                            {header}
                            {sortConfig.key === header.toLowerCase().replace(/\s+/g, '') && (
                              sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                            )}
                          </Button>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {summaryTable.length > 0 ? (
                        summaryTable.map((student, index) => (
                          <motion.tr
                            key={student.studentId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-indigo-50 transition-colors cursor-pointer"
                            onClick={() => handleStudentClick(student.studentId)}
                          >
                            <TableCell className="text-center">{student.studentId}</TableCell>
                            <TableCell className="text-center">{student.lastName}</TableCell>
                            <TableCell className="text-center">{student.firstName}</TableCell>
                            <TableCell className="text-center">{student.cooperation}</TableCell>
                            <TableCell className="text-center">{student.conceptual}</TableCell>
                            <TableCell className="text-center">{student.practical}</TableCell>
                            <TableCell className="text-center">{student.workEthic}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={student.average >= 4 ? "success" : student.average >= 3 ? "warning" : "destructive"}>
                                {student.average}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{student.peersResponded}</TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              No data available
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 text-indigo-600">
                  <User size={24} />
                  <p className="text-lg font-semibold">Click a Student to see their Detailed Ratings!</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default TeamPage
