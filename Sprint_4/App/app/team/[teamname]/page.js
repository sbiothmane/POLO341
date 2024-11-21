'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '@/app/components/home/Navbar';
import Footer from '@/app/components/home/Footer';
import AnimatedBackground from '@/app/components/home/AnimatedBackground';
import PermissionDenied from '@/app/components/Teams/PermissionDenied';
import TeamSummaryTable from '@/app/components/Teams/TeamSummaryTable';

const TeamPage = () => {
  const router = useRouter();
  const [summaryTable, setSummaryTable] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { teamname: teamName } = useParams();
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
          createSummaryTable(result.ratings);
        } else {
          console.error('Error fetching team ratings:', result.message);
        }
      } catch (error) {
        console.error('Error fetching team ratings:', error);
      }
    };

    const createSummaryTable = (ratings) => {
      const summaryData = {};

      ratings.forEach((rating) => {
        const { studentId, lastName, firstName, ratings: studentRatings } = rating;

        if (!summaryData[studentId]) {
          summaryData[studentId] = {
            studentId,
            lastName,
            firstName,
            cooperationTotal: 0,
            conceptualTotal: 0,
            practicalTotal: 0,
            workEthicTotal: 0,
            peersResponded: 0,
          };
        }

        summaryData[studentId].cooperationTotal += studentRatings.cooperation;
        summaryData[studentId].conceptualTotal += studentRatings.conceptual;
        summaryData[studentId].practicalTotal += studentRatings.practical;
        summaryData[studentId].workEthicTotal += studentRatings.workEthic;
        summaryData[studentId].peersResponded += 1;
      });

      const summaryArray = Object.values(summaryData).map((student) => ({
        studentId: student.studentId,
        lastName: student.lastName,
        firstName: student.firstName,
        cooperation: (student.cooperationTotal / student.peersResponded).toFixed(2),
        conceptual: (student.conceptualTotal / student.peersResponded).toFixed(2),
        practical: (student.practicalTotal / student.peersResponded).toFixed(2),
        workEthic: (student.workEthicTotal / student.peersResponded).toFixed(2),
        average: (
          (student.cooperationTotal +
            student.conceptualTotal +
            student.practicalTotal +
            student.workEthicTotal) /
          (4 * student.peersResponded)
        ).toFixed(2),
        peersResponded: student.peersResponded,
      }));

      setSummaryTable(summaryArray);
    };

    fetchRatings();
  }, [teamName, isInstructor]);

  const handleStudentClick = (studentId) => {
    router.push(`/team/${teamName}/${studentId}`);
  };

  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...summaryTable].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setSummaryTable(sortedData);
  };

  if (!isInstructor) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-pink-50">
        <NavBar />
        <AnimatedBackground />
        <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
          <PermissionDenied message="You do not have permission to view the ratings." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-pink-50">
      <NavBar />
      <AnimatedBackground />
      <main className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg mb-10">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Users className="text-indigo-500" size={32} />
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    Team Rating Summary
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">{teamName}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TeamSummaryTable
                summaryTable={summaryTable}
                sortConfig={sortConfig}
                sortTable={sortTable}
                onStudentClick={handleStudentClick}
              />
            </CardContent>
          </Card>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 text-indigo-600">
                  <User size={24} />
                  <p className="text-lg font-semibold">
                    Click a student to see their detailed ratings!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
