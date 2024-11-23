// OfficeHourSlot.js

'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CheckCircle, Clock, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropTypes from 'prop-types'

export default function OfficeHourSlot({
  slot,
  handleDeleteOfficeHour,
  setSelectedSlot,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg shadow-md bg-white/80 backdrop-blur-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 ${
        slot.reserved ? 'border-red-500' : 'border-green-500'
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
              {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')}
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
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDeleteOfficeHour(slot.id)}
            className="rounded-full hover:bg-red-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

OfficeHourSlot.propTypes = {
  slot: PropTypes.object.isRequired,
  handleDeleteOfficeHour: PropTypes.func.isRequired,
  setSelectedSlot: PropTypes.func.isRequired,
}