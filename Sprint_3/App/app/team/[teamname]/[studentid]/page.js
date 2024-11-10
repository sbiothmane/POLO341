'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaBookOpen } from 'react-icons/fa';
import NavBar from '../../../components/NavBar';

const StudentDetailPage = () => {
    const { teamname, studentid } = useParams();
    const [baseRatingsTable, setBaseRatingsTable] = useState([]);
    const [studentRatings, setStudentRatings] = useState([]);
    const [selectedEvaluatorComments, setSelectedEvaluatorComments] = useState(null);

    useEffect(() => {
        if (!teamname) return;

        const fetchRatings = async () => {
            try {
                const response = await fetch('/api/teams/getTeamRatings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamName: teamname }),
                });

                const result = await response.json();
                if (response.ok) {
                    console.log("Fetched ratings:", result.ratings);
                    setBaseRatingsTable(result.ratings);
                    filterStudentRatings(result.ratings);
                } else {
                    console.error('Error fetching team ratings:', result.message);
                }
            } catch (error) {
                console.error('Error fetching team ratings:', error);
            }
        };

        const filterStudentRatings = (ratings) => {
            // Filter ratings to include only those related to the selected student
            const studentData = ratings.filter((rating) => rating.studentId === studentid);
            setStudentRatings(studentData);
        };

        fetchRatings();
    }, [teamname, studentid]);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white shadow rounded-lg p-6 mb-10">
                    <div className="flex items-center mb-6">
                        <FaBookOpen className="text-blue-400 mr-4" size={28} />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Detailed View in {teamname}: {studentid}
                        </h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-4 px-6 text-center">Evaluator</th>
                                    <th className="py-4 px-6 text-center">Cooperation</th>
                                    <th className="py-4 px-6 text-center">Conceptual</th>
                                    <th className="py-4 px-6 text-center">Practical</th>
                                    <th className="py-4 px-6 text-center">Work Ethic</th>
                                    <th className="py-4 px-6 text-center">Average Across All</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentRatings.length > 0 ? (
                                    studentRatings.map((rating, index) => (
                                        <tr
                                            key={index}
                                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-100 transition duration-150 cursor-pointer`}
                                            onClick={() => setSelectedEvaluatorComments(rating.comments)}
                                        >
                                            <td className="py-4 px-6 text-center font-medium text-gray-700">{rating.evaluator}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{rating.ratings.cooperation}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{rating.ratings.conceptual}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{rating.ratings.practical}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{rating.ratings.workEthic}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">
                                                {(
                                                    (rating.ratings.cooperation +
                                                        rating.ratings.conceptual +
                                                        rating.ratings.practical +
                                                        rating.ratings.workEthic) / 4
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 px-6 text-center text-gray-600">No ratings available for this student.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Display selected evaluator's comments */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-500 mb-4">Comments:</h3>
                    {selectedEvaluatorComments ? (
                        selectedEvaluatorComments.map((comment, index) => (
                            <p key={index} className="mb-2 text-gray-700">
                                <strong>{comment.type}:</strong> {comment.comment}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-600">Click an Evaluator to see their Comments!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;
