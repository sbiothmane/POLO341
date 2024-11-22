import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SortableTable = ({ data, columns, sortConfig, onSort, onRowClick }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key} className="text-center">
              {column.sortable ? (
                <Button
                  variant="ghost"
                  onClick={() => onSort(column.key)}
                  className="font-bold text-indigo-700 hover:text-indigo-900"
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    sortConfig.direction === 'ascending' ? (
                      <ChevronUp className="inline ml-1" />
                    ) : (
                      <ChevronDown className="inline ml-1" />
                    )
                  )}
                </Button>
              ) : (
                <span>{column.label}</span>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {data.length > 0 ? (
            data.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-indigo-50 transition-colors"
                >
                {columns.map((column) => (
                    <TableCell key={column.key} className="text-center">
                       <button
                           type="button"
                            className="w-full h-full bg-transparent border-none text-left cursor-pointer"
                             onClick={() => onRowClick && onRowClick(row)}
                            onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                     onRowClick?.(row);
                  }
                }}
              >
        {column.render ? column.render(row) : row[column.key]}
                     </button>
                  </TableCell>
                ))}
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
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

SortableTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
};

export default SortableTable;
