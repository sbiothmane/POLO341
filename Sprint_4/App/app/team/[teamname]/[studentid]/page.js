'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Users, User, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import NavBar from '@/app/components/home/NavBar';
import Footer from '@/app/components/home/Footer';

const AnimatedSphere = () => {
  return (
    <Sphere args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#4F46E5"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <AnimatedSphere />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-purple-50/70 to-pink-50/70" />
    </div>
  );
};

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
          console.log('Fetched ratings:', result.ratings);
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

  const calculateAverage = (ratings) => {
    return (
      (ratings.cooperation +
        ratings.conceptual +
        ratings.practical +
        ratings.workEthic) /
      4
    ).toFixed(2);
  };

  if (!isInstructor) {
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
            <Card className="bg-white/80 backdrop-blur-lg border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-600">
                  <AlertTriangle size={24} />
                  <p className="text-lg font-semibold">
                    You do not have permission to view this page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {['Evaluator', 'Cooperation', 'Conceptual', 'Practical', 'Work Ethic', 'Average'].map(
                        (header) => (
                          <TableHead key={header} className="text-center">
                            <Button
                              variant="ghost"
                              onClick={() =>
                                sortTable(header.toLowerCase().replace(/\s+/g, ''))
                              }
                              className="font-bold text-indigo-700 hover:text-indigo-900"
                            >
                              {header}
                              {sortConfig.key === header.toLowerCase().replace(/\s+/g, '') && (
                                sortConfig.direction === 'ascending' ? (
                                  <ChevronUp className="inline ml-1" />
                                ) : (
                                  <ChevronDown className="inline ml-1" />
                                )
                              )}
                            </Button>
                          </TableHead>
                        )
                      )}
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
                              onClick={() => setSelectedEvaluatorComments(rating.comments)}
                            >
                              <TableCell className="text-center">{rating.evaluator}</TableCell>
                              <TableCell className="text-center">
                                {rating.ratings.cooperation}
                              </TableCell>
                              <TableCell className="text-center">
                                {rating.ratings.conceptual}
                              </TableCell>
                              <TableCell className="text-center">
                                {rating.ratings.practical}
                              </TableCell>
                              <TableCell className="text-center">
                                {rating.ratings.workEthic}
                              </TableCell>
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
            </CardContent>
          </Card>

          {/* Evaluator Comments */}
          <AnimatePresence>
            {selectedEvaluatorComments && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Background Overlay */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setSelectedEvaluatorComments(null)}
                ></div>

                {/* Modal Content */}
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 relative z-10 w-full max-w-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-indigo-600">
                      Evaluator's Comments
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedEvaluatorComments(null)}
                    >
                      <X size={24} className="text-gray-600" />
                    </Button>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {selectedEvaluatorComments.map((comment, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <p className="text-gray-700">
                          <strong className="text-indigo-600">{comment.type}:</strong>{' '}
                          {comment.comment}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="solid"
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setSelectedEvaluatorComments(null)}
                  >
                    Close
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDetailPage;
