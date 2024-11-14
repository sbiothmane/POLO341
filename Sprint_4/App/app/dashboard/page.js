'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Users,
  Clock,
  PieChart,
  Loader2,
} from 'lucide-react'

import NavBar from '@/app/components/NavBar' // Import the NavBar component
import Footer from '@/app/components//Footer' // Import the Footer component

// AnimatedSphere Component
const AnimatedSphere = () => {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(t / 4) / 2
      meshRef.current.rotation.y = Math.sin(t / 4) / 2
      meshRef.current.rotation.z = Math.sin(t / 1.5) / 2
      meshRef.current.position.x = Math.sin(t / 1) / 2
      meshRef.current.position.y = Math.cos(t / 1) / 2
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#FFFFFF"
        distort={0.5}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  )
}

// AnimatedBackground Component
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

// TeamCard Component
const TeamCard = ({ team, instructor, role }) => {
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

// TeamBox Component
const TeamBox = ({ instructor, student }) => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        let url = '/api/teams/teamsInfo'
        if (instructor) {
          url += `?instructor=${instructor}`
        } else if (student) {
          url += `?student=${student}`
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) throw new Error('Failed to fetch team data')

        const data = await response.json()
        setTeams(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchTeams()
  }, [instructor, student])

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
          <p className="text-lg font-medium text-center">
            {instructor
              ? 'You have not created any teams yet.'
              : student
              ? 'You are not part of any teams yet.'
              : 'No teams available at the moment.'}
          </p>
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
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-800">
        {instructor ? 'My Teams' : student ? 'My Teams' : 'All Teams'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team, index) => (
          <TeamCard
            key={index}
            team={team}
            instructor={team.instructor}
            role={student ? 'student' : 'instructor'}
          />
        ))}
      </div>
    </motion.div>
  )
}

// UserProfile Component
export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <NavBar role="guest" />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-center mt-8">You are not signed in.</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (session) {
    const { id, name, role, username } = session.user

    return (
      <div className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <NavBar role={role} />
        <main className="flex-grow pt-24 relative z-10">
          <section className="py-20">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/80 backdrop-blur-lg border-none mb-10">
                  <CardHeader>
                    <CardTitle className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                      Welcome, {name}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <span>
                          <User className="inline mr-1 h-5 w-5 text-blue-500" /> ID: {id}
                        </span>
                        <Badge className="bg-blue-500 text-white capitalize">
                          {role}
                        </Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-white/10 backdrop-blur-lg">
            <div className="container mx-auto px-6">
              {role === 'instructor' ? (
                <>
                  <TeamBox instructor={username} />
                  <div className="mt-10">
                    <TeamBox />
                  </div>
                </>
              ) : (
                <TeamBox student={username} />
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <NavBar role="guest" />
      <main className="flex-grow flex items-center justify-center">
        <p className="text-red-500 text-center mt-8">No user data found.</p>
      </main>
      <Footer />
    </div>
  )
}
