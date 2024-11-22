import React from 'react';
import PropTypes from 'prop-types';
import SortableTable from './SortableTable';
import { Badge } from '@/components/ui/badge';

const TeamSummaryTable = ({ summaryTable, sortConfig, sortTable, onStudentClick }) => {
  const columns = [
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'firstName', label: 'First Name', sortable: true },
    { key: 'cooperation', label: 'Cooperation', sortable: true },
    { key: 'conceptual', label: 'Conceptual Contribution', sortable: true },
    { key: 'practical', label: 'Practical Contribution', sortable: true },
    { key: 'workEthic', label: 'Work Ethic', sortable: true },
    {
      key: 'average',
      label: 'Average',
      sortable: true,
render: (row) => {
  const badgeVariant = row.average >= 4
    ? 'success'
    : row.average >= 3
    ? 'warning'
    : 'destructive';

  return (
    <Badge variant={badgeVariant}>
      {row.average}
    </Badge>
  );
},



    { key: 'peersResponded', label: 'Peers Responded', sortable: true },
  ];

  return (
    <SortableTable
      data={summaryTable}
      columns={columns}
      sortConfig={sortConfig}
      onSort={sortTable}
      onRowClick={(row) => onStudentClick(row.studentId)}
    />
  );
};

TeamSummaryTable.propTypes = {
  summaryTable: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortConfig: PropTypes.object.isRequired,
  sortTable: PropTypes.func.isRequired,
  onStudentClick: PropTypes.func.isRequired,
};

export default TeamSummaryTable;
