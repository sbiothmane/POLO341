import React from 'react';
import PropTypes from 'prop-types';
import SortableTable from './SortableTable';
import { Badge } from '@/components/ui/badge';

const StudentRatingsTable = ({ studentRatings, sortConfig, sortTable, onRowClick }) => {
  const calculateAverage = (ratings) => {
    const average =
      (ratings.cooperation +
        ratings.conceptual +
        ratings.practical +
        ratings.workEthic) /
      4
  return parseFloat(average.toFixed(2));
  };

    const getBadgeVariant = (average) => {
    if (average >= 4) return 'success';
    if (average >= 3) return 'warning';
    return 'destructive';
  };

  const data = studentRatings.map((rating, index) => ({
    id: `${rating.evaluator}-${index}`,
    ...rating,
    average: calculateAverage(rating.ratings),
  }));

  const columns = [
    { key: 'evaluator', label: 'Evaluator', sortable: true },
    {
      key: 'cooperation',
      label: 'Cooperation',
      sortable: true,
      render: (row) => row.ratings.cooperation,
    },
    {
      key: 'conceptual',
      label: 'Conceptual',
      sortable: true,
      render: (row) => row.ratings.conceptual,
    },
    {
      key: 'practical',
      label: 'Practical',
      sortable: true,
      render: (row) => row.ratings.practical,
    },
    {
      key: 'workEthic',
      label: 'Work Ethic',
      sortable: true,
      render: (row) => row.ratings.workEthic,
    },
    {
      key: 'average',
      label: 'Average',
      sortable: true,
      render: (row) => {
       const badgeVariant = getBadgeVariant(row.average);
        return (
          <Badge variant={badgeVariant}>
            {row.average}
          </Badge>
        );
      },
  ];

  return (
    <SortableTable
      data={data}
      columns={columns}
      sortConfig={sortConfig}
      onSort={sortTable}
      onRowClick={(row) => onRowClick(row.comments)}
    />
  );
};

StudentRatingsTable.propTypes = {
  studentRatings: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortConfig: PropTypes.object.isRequired,
  sortTable: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default StudentRatingsTable;
