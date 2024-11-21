'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { format, parse, addMinutes, isSameDay } from 'date-fns'
import { toast, Toaster } from 'sonner'

import AnimatedBackground from '@/app/components/home/AnimatedBackground'
import Navbar from '@/app/components/home/Navbar'

import CalendarComponent from '@/app/components/OfficeHours/CalendarComponent'
import OfficeHoursList from '@/app/components/OfficeHours/OfficeHoursList'
import CreateOfficeHoursDialog from '@/app/components/OfficeHours/CreateOfficeHoursDialog'
import ReserveOfficeHourDialog from '@/app/components/OfficeHours/ReserveOfficeHourDialog'
import Footer from '@/app/components/home/Footer'

export default function OfficeHoursCalendar() {
  const { data: session, status } = useSession()
  const [officeHours, setOfficeHours] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isCreating, setIsCreating] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
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

  const handleCreateOfficeHours = async (startTime, endTime, interval) => {
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

  const handleReservation = async (slot, studentName) => {
    if (!slot || !studentName) return
    setIsReserving(true)
    try {
      const response = await fetch('/api/office_index_update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slot.id,
          reserved: true,
          reservedBy: studentName,
        }),
      })
      if (!response.ok) throw new Error('Failed to update office hour')
      toast.success('Office hour reserved successfully')
      fetchOfficeHours()
      setSelectedSlot(null)
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
      <p className="text-red-500 text-center mt-8">You are not signed in.</p>
    )
  }

  return (
    <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 bg-white/30 flex flex-col">
      <AnimatedBackground />
      <Navbar role={session?.user?.role} />
      <main className="pt-24 relative z-10 flex-grow flex flex-col">
        <section className="flex-grow py-10">
          <div className="container mx-auto flex justify-center">
            <CalendarComponent
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              officeHours={officeHours}
              openCreateDialog={() => setIsCreateDialogOpen(true)}
            />
          </div>
        </section>
      </main>

      <CreateOfficeHoursDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        handleCreateOfficeHours={handleCreateOfficeHours}
        isCreating={isCreating}
      />

      <ReserveOfficeHourDialog
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        handleReservation={handleReservation}
        isReserving={isReserving}
      />

      <Footer />
      <Toaster />
    </div>
  )
}
