'use client';

import { useState } from 'react';
import NavBar from '../../components/NavBar';

const teamData = {
    teamName: 'Invincibles',
    students: [
        {
            id: '402XXXXX',
            lastName: 'Doe',
            firstName: 'John',
            cooperation: 6.4,
            conceptual: 6.4,
            practical: 6.8,
            workEthic: 6.6,
            peersResponded: 5,
            comments: [
                { peer: 'Student 2', comment: 'Great team player!' },
                { peer: 'Student 3', comment: '' },
            ],
        },
        {
            id: '402XXXXX2',
            lastName: 'Smith',
            firstName: 'Jane',
            cooperation: 4.2,
            conceptual: 5.1,
            practical: 3.8,
            workEthic: 4.5,
            peersResponded: 4,
            comments: [
                { peer: 'Student 1', comment: 'Needs to improve communication.' },
                { peer: 'Student 3', comment: '' },
            ],
        },
        // Add more students as needed
    ],
};

export default function TeamRatings() {
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const averageScore = (student) => {
        const total = student.cooperation + student.conceptual + student.practical + student.workEthic;
        return (total / 4).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-8 text-center">Team Ratings: {teamData.teamName}</h1>
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
                        {teamData.students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleStudentClick(student)}>
                                <td className="py-2 border">{student.id}</td>
                                <td className="py-2 border">{student.lastName}</td>
                                <td className="py-2 border">{student.firstName}</td>
                                <td className="py-2 border">{student.cooperation}</td>
                                <td className="py-2 border">{student.conceptual}</td>
                                <td className="py-2 border">{student.practical}</td>
                                <td className="py-2 border">{student.workEthic}</td>
                                <td className="py-2 border">{averageScore(student)}</td>
                                <td className="py-2 border">{student.peersResponded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Detailed View */}
                {selectedStudent && (
                    <div className="mt-10 p-6 bg-white shadow-xl rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Detailed View for {selectedStudent.firstName} {selectedStudent.lastName}</h2>
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
                                {teamData.students.map((s) => (
                                    <tr key={s.id}>
                                        <td className="py-2 border">{s.firstName} {s.lastName}</td>
                                        <td className="py-2 border">{s.cooperation}</td>
                                        <td className="py-2 border">{s.conceptual}</td>
                                        <td className="py-2 border">{s.practical}</td>
                                        <td className="py-2 border">{s.workEthic}</td>
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
}
