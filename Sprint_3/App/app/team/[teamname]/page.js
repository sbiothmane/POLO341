'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation'
import NavBar from '../../components/NavBar';

export default function TeamRatings({params}) {

    const {team, student} = params;
    const { data: session } = useSession();
    const router = useRouter(); // Initialize the router

    //state variables
    const [teamData, setTeamData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    

    //fetch data when page loads
    useEffect(() => {    
        if(session){
            fetchData();
        }
       
    }, [session]);

        const fetchData = async () => {
            try {
                // Fetch team information
                const teamResponse = await fetch('/api/teams/rating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        evaluator: session?.user?.username, // Replace with session/user context if needed
                        team: team, // Replace with the actual team ID
                    }),
                });

                const teamResult = await teamResponse.json();
                const teamName = teamResult.teamName;
                const studentIds = teamResult.studentIds; // Assume teamResponse provides an array of student IDs

                // Fetch ratings for each student
                const students = await Promise.all(
                    studentIds.map(async (studentId) => {
                        const studentResponse = await fetch('/api/teams/rating', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                evaluator: session?.user?.username, // Replace with session/user context if needed
                                team: 'polo-36165', // Replace with the actual team ID
                                student: studentId,
                            }),
                        });

                        const studentResult = await studentResponse.json();
                        const student = studentResult.student;
                        const ratings = studentResult.ratings;

                        return {
                            id: student.id,
                            lastName: student.lastName,
                            firstName: student.firstName,
                            cooperation: ratings.cooperation,
                            conceptual: ratings.conceptualContribution,
                            practical: ratings.practicalContribution,
                            workEthic: ratings.workEthic,
                            peersResponded: ratings.peersResponded,
                            comments: ratings.comments.map((comment) => ({
                                peer: comment.peer,
                                comment: comment.comment || 'No comment provided.',
                            })),
                        };
                    })
                );

                setTeamData({ teamName, students });
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };


    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const averageScore = (student) => {
        const total = Number(student.cooperation) + Number(student.conceptual) + Number(student.practical) + Number(student.workEthic);
        return (total / 4).toFixed(2);
    };

    if (!teamData) {
        return <div>Loading...</div>;
    }

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
