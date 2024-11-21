'use client'

import PropTypes from 'prop-types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function StudentTable({ students, onStudentClick, selectedStudents, searchTerm, onSearchTermChange }) {
  return (
    <div className="w-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          className="pl-10 w-full"
          placeholder="Search Students"
          value={searchTerm}
          onChange={onSearchTermChange}
        />
      </div>
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
    </div>
  )
}

// Prop Types Validation
StudentTable.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStudentClick: PropTypes.func.isRequired,
  selectedStudents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
}
