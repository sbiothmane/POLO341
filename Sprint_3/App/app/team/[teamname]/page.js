'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';

const TeamPage = ({ teamName }) => {
    const [teamRatings, setTeamRatings] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await fetch('/api/teams/getTeamRatings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ teamName }),
                });

                const result = await response.json();
                console.log('API Response:', result); // Debug statement
                if (response.ok) {
                    console.log('Fetched ratings:', result.ratings); // Debug statement
                    setTeamRatings(result.ratings);
                } else {
                    console.error('Error fetching team ratings:', result.message);
                }
            } catch (error) {
                console.error('Error fetching team ratings:', error);
            }
        };

        fetchRatings();
    }, [teamName]);

    useEffect(() => {
        console.log('Team Ratings State:', teamRatings); // Debug statement
    }, [teamRatings]);

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const averageScore = (student) => {
        const { cooperation, conceptual, practical, workEthic } = student.ratings;
        return ((cooperation + conceptual + practical + workEthic) / 4).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-8 text-center">Team Ratings: {teamName}</h1>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 border">Student ID</th>
                            <th className="py-2 border">Last Name</th>
                            <th className="py-2 border">First Name</th>
                            <th className="py-2 border">Cooperation</th>
                            <th className="py-2 border">Conceptual Contribution</th>
                            <th className="py-2 border">Practical Contribution</th>
                            <th className="py-2 border">Work Ethic</th>
                            <th className="py-2 border">Average</th>
                            <th className="py-2 border">Peers Who Responded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamRatings.length > 0 ? (
                            teamRatings.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleStudentClick(student)}>
                                    <td className="py-2 border">{student.id}</td>
                                    <td className="py-2 border">{student.name.split(' ')[1]}</td>
                                    <td className="py-2 border">{student.name.split(' ')[0]}</td>
                                    <td className="py-2 border">{student.ratings.cooperation}</td>
                                    <td className="py-2 border">{student.ratings.conceptual}</td>
                                    <td className="py-2 border">{student.ratings.practical}</td>
                                    <td className="py-2 border">{student.ratings.workEthic}</td>
                                    <td className="py-2 border">{averageScore(student)}</td>
                                    <td className="py-2 border">{student.peersResponded}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="py-2 border text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Detailed View */}
                {selectedStudent && (
                    <div className="mt-10 p-6 bg-white shadow-xl rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Detailed View for {selectedStudent.name}</h2>
                        <table className="min-w-full bg-white border border-gray-300 mb-6">
                            <thead>
                                <tr>
                                    <th className="py-2 border">Member</th>
                                    <th className="py-2 border">Cooperation</th>
                                    <th className="py-2 border">Conceptual</th>
                                    <th className="py-2 border">Practical</th>
                                    <th className="py-2 border">Work Ethic</th>
                                    <th className="py-2 border">Average Across All</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamRatings.map((s) => (
                                    <tr key={s.id}>
                                        <td className="py-2 border">{s.name}</td>
                                        <td className="py-2 border">{s.ratings.cooperation}</td>
                                        <td className="py-2 border">{s.ratings.conceptual}</td>
                                        <td className="py-2 border">{s.ratings.practical}</td>
                                        <td className="py-2 border">{s.ratings.workEthic}</td>
                                        <td className="py-2 border">{averageScore(s)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h3 className="text-lg font-semibold mb-2">Comments:</h3>
                        {selectedStudent.comments.map((comment, index) => (
                            <div key={index} className="mb-2">
                                <strong>{comment.peer} comment:</strong> {comment.comment || 'No comment provided.'}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamPage;
