// ReserveOfficeHourDialog.js

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import PropTypes from 'prop-types'

export default function ReserveOfficeHourDialog({
  selectedSlot,
  setSelectedSlot,
  handleReservation,
  isReserving,
}) {
  const [studentName, setStudentName] = useState('')

  return (
    <Dialog
      open={!!selectedSlot}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedSlot(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Office Hour</DialogTitle>
          <DialogDescription>
            Enter the student's name to reserve this slot.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Student's name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="mt-2"
        />
        <DialogFooter>
          <Button
            onClick={() => {
              handleReservation(selectedSlot, studentName)
              setStudentName('')
            }}
            disabled={isReserving || !studentName}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isReserving ? 'Reserving...' : 'Reserve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

ReserveOfficeHourDialog.propTypes = {
  selectedSlot: PropTypes.object,
  setSelectedSlot: PropTypes.func.isRequired,
  handleReservation: PropTypes.func.isRequired,
  isReserving: PropTypes.bool.isRequired,
}