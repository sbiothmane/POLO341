'use client'

import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

export default function CalendarComponent({
  selectedDate,
  setSelectedDate,
  officeHours,
  openCreateDialog,
}) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-full p-6 flex flex-col items-center w-full md:w-1/2"
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
        onClick={openCreateDialog}
        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Create Office Hours
      </Button>
    </motion.div>
  )
}

CalendarComponent.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  setSelectedDate: PropTypes.func.isRequired,
  officeHours: PropTypes.arrayOf(PropTypes.object).isRequired,
  openCreateDialog: PropTypes.func.isRequired,
}
