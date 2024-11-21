import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

const StudentRatingsTable = ({ studentRatings, sortConfig, sortTable, onRowClick }) => {
  const calculateAverage = (ratings) => (
    (
      (ratings.cooperation + ratings.conceptual + ratings.practical + ratings.workEthic) /
      4
    ).toFixed(2)
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: 'evaluator', label: 'Evaluator' },
              { key: 'cooperation', label: 'Cooperation' },
              { key: 'conceptual', label: 'Conceptual' },
              { key: 'practical', label: 'Practical' },
              { key: 'workEthic', label: 'Work Ethic' },
              { key: 'average', label: 'Average' },
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
            {studentRatings.length > 0 ? (
              studentRatings.map((rating, index) => {
                const average = calculateAverage(rating.ratings);

                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                    onClick={() => onRowClick(rating.comments)}
                  >
                    <TableCell className="text-center">{rating.evaluator}</TableCell>
                    <TableCell className="text-center">{rating.ratings.cooperation}</TableCell>
                    <TableCell className="text-center">{rating.ratings.conceptual}</TableCell>
                    <TableCell className="text-center">{rating.ratings.practical}</TableCell>
                    <TableCell className="text-center">{rating.ratings.workEthic}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          average >= 4
                            ? 'success'
                            : average >= 3
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {average}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    No ratings available for this student.
                  </motion.div>
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentRatingsTable;
