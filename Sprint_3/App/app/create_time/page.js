'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast, Toaster } from 'sonner'
import { format, parse, addMinutes, isSameDay } from 'date-fns'
import {
  User,
  Clock,
  Trash2,
  UserPlus,
  Calendar as CalendarIcon,
  CheckCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-lg border-b border-gray-200/20">
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Polls
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />
    </>
  )
}

const OfficeHoursCalendar = () => {
  const { data: session, status } = useSession()
  const [officeHours, setOfficeHours] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [interval, setInterval] = useState('30')
  const [isCreating, setIsCreating] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOfficeHours()
    }
  }, [status])

  const fetchOfficeHours = async () => {
    try {
      const response = await fetch('/api/office_index')
      if (!response.ok) throw new Error('Failed to fetch office hours')
      const data = await response.json()
      const updatedData = data.map((item) => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      }))
      setOfficeHours(updatedData)
    } catch (error) {
      console.error('Error fetching office hours:', error)
      toast.error('Failed to fetch office hours')
    }
  }

  const handleCreateOfficeHours = async () => {
    if (!selectedDate) return
    setIsCreating(true)
    const slots = generateTimeSlots(
      selectedDate,
      startTime,
      endTime,
      parseInt(interval)
    )
    try {
      const response = await fetch('/api/office_index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots, username: session?.user?.username }),
      })
      if (!response.ok) throw new Error('Failed to create office hours')
      toast.success('Office hours created successfully')
      fetchOfficeHours()
    } catch (error) {
      console.error('Error creating office hours:', error)
      toast.error('Failed to create office hours')
    } finally {
      setIsCreating(false)
    }
  }

  const generateTimeSlots = (date, start, end, intervalMinutes) => {
    const slots = []
    let currentTime = parse(start, 'HH:mm', date)
    const endTime = parse(end, 'HH:mm', date)

    while (currentTime < endTime) {
      const startSlot = new Date(currentTime)
      const endSlot = addMinutes(startSlot, intervalMinutes)
      slots.push({
        id: `${startSlot.toISOString()}-${endSlot.toISOString()}`,
        start: startSlot,
        end: endSlot,
        reserved: false,
        reservedBy: null,
      })
      currentTime = endSlot
    }

    return slots
  }

  const handleDeleteOfficeHour = async (id) => {
    try {
      const response = await fetch('/api/office_index_delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) throw new Error('Failed to delete office hour')
      toast.success('Office hour deleted successfully')
      setOfficeHours((prevSlots) => prevSlots.filter((slot) => slot.id !== id))
    } catch (error) {
      console.error('Error deleting office hour:', error)
      toast.error('Failed to delete the office hour')
    }
  }

  const handleReservation = async () => {
    if (!selectedSlot || !studentName) return
    setIsReserving(true)
    try {
      const response = await fetch('/api/office_index_update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSlot.id,
          reserved: true,
          reservedBy: studentName,
        }),
      })
      if (!response.ok) throw new Error('Failed to update office hour')
      toast.success('Office hour reserved successfully')
      fetchOfficeHours()
      setSelectedSlot(null)
      setStudentName('')
    } catch (error) {
      console.error('Error updating office hour:', error)
      toast.error('Failed to update the office hour')
    } finally {
      setIsReserving(false)
    }
  }

  const filteredOfficeHours = selectedDate
    ? officeHours.filter((slot) => isSameDay(slot.start, selectedDate))
    : []

  if (status === 'unauthenticated') {
    return (
      <p className="text-red-500 text-center mt-8">
        You are not signed in.
      </p>
    )
  }

  return (
    <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 bg-white/30">
      <AnimatedBackground />
      <NavBar role={session?.user?.role} />
      <main className="pt-24 relative z-10">
        <section className="py-10">
          <div className="container mx-auto ">
            <div className="flex flex-col md:flex-row bg-white/30">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className=" h-full p-6 flex flex-col items-center"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow bg-white p-3 w-full h-full bg-white/30"
                  modifiers={{
                    hasOfficeHours: officeHours.map((slot) => slot.start),
                  }}
                  modifiersClassNames={{
                    hasOfficeHours: 'bg-blue-200 text-blue-800',
                  }}
                />
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Create Office Hours
                </Button>
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="md:w-1/2 p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <CalendarIcon className="mr-2" />
                  {selectedDate
                    ? format(selectedDate, 'MMMM d, yyyy')
                    : 'Select a date'}
                </h2>
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {filteredOfficeHours.map((slot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-lg shadow-md bg-white/80 backdrop-blur-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 ${
                          slot.reserved
                            ? 'border-red-500'
                            : 'border-green-500'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {slot.reserved ? (
                              <CheckCircle className="text-red-500 mr-2 h-6 w-6 animate-pulse" />
                            ) : (
                              <Clock className="text-green-500 mr-2 h-6 w-6 animate-spin-slow" />
                            )}
                            <div>
                              <p className="text-lg font-medium">
                                {format(slot.start, 'h:mm a')} -{' '}
                                {format(slot.end, 'h:mm a')}
                              </p>
                              {slot.reserved && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Reserved by: {slot.reservedBy}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!slot.reserved && (
                              <Dialog
                                onOpenChange={(open) => {
                                  if (!open) {
                                    setSelectedSlot(null)
                                    setStudentName('')
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full hover:bg-green-200"
                                    onClick={() => {
                                      setSelectedSlot(slot)
                                    }}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Reserve Office Hour
                                    </DialogTitle>
                                    <DialogDescription>
                                      Enter the student's name to reserve this
                                      slot.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Input
                                    placeholder="Student's name"
                                    value={studentName}
                                    onChange={(e) =>
                                      setStudentName(e.target.value)
                                    }
                                    className="mt-2"
                                  />
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        handleReservation()
                                        setSelectedSlot(null)
                                      }}
                                      disabled={isReserving}
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                      {isReserving
                                        ? 'Reserving...'
                                        : 'Reserve'}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleDeleteOfficeHour(slot.id)
                              }
                              className="rounded-full hover:bg-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredOfficeHours.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 text-center py-4"
                    >
                      No office hours scheduled for this day.
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Create Office Hours Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Office Hours</DialogTitle>
            <DialogDescription>
              Set the time range and interval for the selected date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="startTime" className="text-gray-700">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endTime" className="text-gray-700">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="interval" className="text-gray-700">
                Interval
              </Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger id="interval" className="mt-1">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                handleCreateOfficeHours()
                setIsCreateDialogOpen(false)
              }}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              {isCreating ? 'Creating...' : 'Create Office Hours'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="bg-white/30 backdrop-blur-lg py-8 mt-auto w-full fixed bottom-0">
        <div className="container mx-auto px-6 text-center text-gray-800">
          <p>&copy; 2024 Peer Assessment System. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

export default OfficeHoursCalendar


