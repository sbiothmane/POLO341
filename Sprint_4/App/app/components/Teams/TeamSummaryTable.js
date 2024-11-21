import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TeamSummaryTable = ({ summaryTable, sortConfig, sortTable, onStudentClick }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {[
            { key: 'studentId', label: 'Student ID' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'firstName', label: 'First Name' },
            { key: 'cooperation', label: 'Cooperation' },
            { key: 'conceptual', label: 'Conceptual Contribution' },
            { key: 'practical', label: 'Practical Contribution' },
            { key: 'workEthic', label: 'Work Ethic' },
            { key: 'average', label: 'Average' },
            { key: 'peersResponded', label: 'Peers Responded' },
          ].map((header) => (
            <TableHead key={header.key} className="text-center">
              <Button
                variant="ghost"
                onClick={() => sortTable(header.key)}
                className="font-bold text-indigo-700 hover:text-indigo-900"
              >
                {header.label}
                {sortConfig.key === header.key && (
                  sortConfig.direction === 'ascending' ? (
                    <ChevronUp className="inline ml-1" />
                  ) : (
                    <ChevronDown className="inline ml-1" />
                  )
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
                onClick={() => onStudentClick(student.studentId)}
              >
                <TableCell className="text-center">{student.studentId}</TableCell>
                <TableCell className="text-center">{student.lastName}</TableCell>
                <TableCell className="text-center">{student.firstName}</TableCell>
                <TableCell className="text-center">{student.cooperation}</TableCell>
                <TableCell className="text-center">{student.conceptual}</TableCell>
                <TableCell className="text-center">{student.practical}</TableCell>
                <TableCell className="text-center">{student.workEthic}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      student.average >= 4
                        ? 'success'
                        : student.average >= 3
                        ? 'warning'
                        : 'destructive'
                    }
                  >
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
);

export default TeamSummaryTable;
