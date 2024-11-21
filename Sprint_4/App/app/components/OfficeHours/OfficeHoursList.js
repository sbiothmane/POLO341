'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { format, isSameDay } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import OfficeHourSlot from './OfficeHourSlot'

export default function OfficeHoursList({
  selectedDate,
  officeHours,
  handleDeleteOfficeHour,
  setSelectedSlot,
  setStudentName,
  filteredOfficeHours,
}) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full md:w-1/2 p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <CalendarIcon className="mr-2" />
        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
      </h2>
      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        <AnimatePresence>
          {filteredOfficeHours.length > 0 ? (
            filteredOfficeHours.map((slot) => (
              <OfficeHourSlot
                key={slot.id}
                slot={slot}
                handleDeleteOfficeHour={handleDeleteOfficeHour}
                setSelectedSlot={setSelectedSlot}
                setStudentName={setStudentName}
              />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center py-4"
            >
              No office hours scheduled for this day.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
