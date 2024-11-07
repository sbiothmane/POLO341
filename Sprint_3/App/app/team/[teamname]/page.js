'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use this to get dynamic route parameters in App Router
import { FaUsers, FaBookOpen } from 'react-icons/fa';
import NavBar from '../../components/NavBar';

const TeamPage = () => {
    const [teamRatings, setTeamRatings] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { teamname: teamName } = useParams(); // Extract teamname directly from dynamic route

    useEffect(() => {
        if (!teamName) return;

        const fetchRatings = async () => {
            try {
                const response = await fetch('/api/teams/getTeamRatings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ teamName }), // Passes teamName in request body as expected
                });

                const result = await response.json();
                if (response.ok) {
                    setTeamRatings(result.ratings); // Set fetched data to state
                } else {
                    console.error('Error fetching team ratings:', result.message);
                }
            } catch (error) {
                console.error('Error fetching team ratings:', error);
            }
        };

        fetchRatings();
    }, [teamName]);

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const averageScore = (student) => {
        const { cooperation, conceptual, practical, workEthic } = student.ratings;
        return ((cooperation + conceptual + practical + workEthic) / 4).toFixed(2);
    };

    const splitName = (fullName) => {
        let firstName = 'Unknown';
        let lastName = 'Unknown';

        if (fullName) {
            const nameParts = fullName.split(' ');
            if (nameParts.length > 1) {
                firstName = nameParts[0];
                lastName = nameParts.slice(1).join(' ');
            } else {
                // If no space found, try splitting by capital letter
                const match = fullName.match(/([A-Z][a-z]+)([A-Z][a-z]+)/);
                if (match) {
                    firstName = match[1];
                    lastName = match[2];
                } else {
                    firstName = fullName;
                }
            }
        }

        return { firstName, lastName };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            {/* Main Content */}
            <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 mb-10">
                    <div className="flex items-center mb-6">
                        <FaUsers className="text-blue-400 mr-4" size={28} />
                        <h1 className="text-3xl font-bold text-gray-800">Team Ratings: {teamName}</h1>
                    </div>
                    
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Student ID</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Last Name</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">First Name</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Cooperation</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Conceptual Contribution</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Practical Contribution</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Work Ethic</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Average</th>
                                <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Peers Who Responded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamRatings.length > 0 ? (
                                teamRatings.map((student, index) => {
                                    const { firstName, lastName } = splitName(student.ratedStudent);
                                    const rowColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
                                    return (
                                        <tr
                                            key={student.id}
                                            className={`${rowColor} hover:bg-blue-100 transition duration-150 cursor-pointer`}
                                            onClick={() => handleStudentClick(student)}
                                        >
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.studentId}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{lastName}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{firstName}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.ratings.cooperation}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.ratings.conceptual}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.ratings.practical}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.ratings.workEthic}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{averageScore(student)}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{student.peersResponded}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="py-4 px-6 text-center text-gray-600">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Detailed View */}
                {selectedStudent && (
                    <div className="bg-white shadow rounded-lg p-6 mt-10">
                        <div className="flex items-center mb-6">
                            <FaBookOpen className="text-blue-400 mr-4" size={28} />
                            {/* Update to show the selected student's name */}
                            <h2 className="text-3xl font-semibold text-gray-800">
                                Detailed View for {splitName(selectedStudent.ratedStudent).firstName} {splitName(selectedStudent.ratedStudent).lastName}
                            </h2>
                        </div>
                        <table className="min-w-full bg-white border border-blue-300 mb-6 rounded-lg">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Member</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Cooperation</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Conceptual</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Practical</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Work Ethic</th>
                                    <th className="py-4 px-6 border-b-2 border-blue-300 text-center">Average Across All</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamRatings.map((s, index) => {
                                    const rowColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
                                    return (
                                        <tr key={s.id} className={`${rowColor}`}>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{s.name}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{s.ratings.cooperation}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{s.ratings.conceptual}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{s.ratings.practical}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{s.ratings.workEthic}</td>
                                            <td className="py-4 px-6 border-b border-blue-200 text-black text-center">{averageScore(s)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold mb-4 text-blue-500">Comments:</h3>
                        {Array.isArray(selectedStudent.comments) && selectedStudent.comments.length > 0 ? (
                            selectedStudent.comments.map((comment, index) => (
                                <div key={index} className="mb-4 text-black">
                                    <strong className="text-blue-400">{comment.peer} comment:</strong> {comment.comment || 'No comment provided.'}
                                </div>
                            ))
                        ) : (
                            <div className="mb-4 text-black">No comments available.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TeamPage;
