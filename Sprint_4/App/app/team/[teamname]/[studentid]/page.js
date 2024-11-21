'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '@/app/components/home/Navbar';
import Footer from '@/app/components/home/Footer';
import AnimatedBackground from '@/app/components/home/AnimatedBackground';
import PermissionDenied from '@/app/components/Teams/PermissionDenied';
import StudentRatingsTable from '@/app/components/Teams/StudentRatingsTable';
import CommentsModal from '@/app/components/Teams/CommentsModal';

const StudentDetailPage = () => {
  const { teamname: teamName, studentid: studentId } = useParams();
  const [studentRatings, setStudentRatings] = useState([]);
  const [selectedEvaluatorComments, setSelectedEvaluatorComments] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { data: session } = useSession();

  const isInstructor = session?.user?.role === 'instructor';

  useEffect(() => {
    if (!teamName || !isInstructor) return;

    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/teams/getTeamRatings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamName }),
        });

        const result = await response.json();
        if (response.ok) {
          filterStudentRatings(result.ratings);
        } else {
          console.error('Error fetching team ratings:', result.message);
        }
      } catch (error) {
        console.error('Error fetching team ratings:', error);
      }
    };

    const filterStudentRatings = (ratings) => {
      const studentData = ratings.filter((rating) => rating.studentId === studentId);
      setStudentRatings(studentData);
    };

    fetchRatings();
  }, [teamName, studentId, isInstructor]);

  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...studentRatings].sort((a, b) => {
      let aValue, bValue;

      if (key === 'average') {
        aValue = calculateAverage(a.ratings);
        bValue = calculateAverage(b.ratings);
      } else if (key === 'evaluator') {
        aValue = a[key].toLowerCase();
        bValue = b[key].toLowerCase();
      } else {
        aValue = a.ratings[key];
        bValue = b.ratings[key];
      }

      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setStudentRatings(sortedData);
  };

  const calculateAverage = (ratings) => (
    (
      (ratings.cooperation +
        ratings.conceptual +
        ratings.practical +
        ratings.workEthic) /
      4
    ).toFixed(2)
  );

  if (!isInstructor) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-pink-50">
        <NavBar />
        <AnimatedBackground />
        <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
          <PermissionDenied message="You do not have permission to view this page." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-pink-50">
      <NavBar />
      <AnimatedBackground />
      <main className="flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Card */}
          <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg mb-10">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <User className="text-indigo-500" size={32} />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    Detailed Ratings for Student {studentId}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Team: {teamName}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Ratings Table */}
              <StudentRatingsTable
                studentRatings={studentRatings}
                sortConfig={sortConfig}
                sortTable={sortTable}
                onRowClick={setSelectedEvaluatorComments}
              />
            </CardContent>
          </Card>

          {/* Evaluator Comments */}
          <CommentsModal
            comments={selectedEvaluatorComments}
            onClose={() => setSelectedEvaluatorComments(null)}
          />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDetailPage;
