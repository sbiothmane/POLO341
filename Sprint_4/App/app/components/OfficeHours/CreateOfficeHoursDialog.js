'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PropTypes from 'prop-types'

export default function CreateOfficeHoursDialog({
  isOpen,
  setIsOpen,
  handleCreateOfficeHours,
  isCreating,
}) {
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [interval, setInterval] = useState('30')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              handleCreateOfficeHours(startTime, endTime, interval)
              setIsOpen(false)
            }}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isCreating ? 'Creating...' : 'Create Office Hours'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

CreateOfficeHoursDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleCreateOfficeHours: PropTypes.func.isRequired,
  isCreating: PropTypes.bool.isRequired,
}
