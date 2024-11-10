'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaUsers, FaBookOpen } from 'react-icons/fa';
import NavBar from '../../../components/NavBar';
import Loading from '../../../components/Loading'; // Assuming you have a Loading component

const StudentDetailPage = () => {
    const { teamname, studentid } = useParams();
    const [studentRatings, setStudentRatings] = useState([]);
    const [selectedEvaluatorComments, setSelectedEvaluatorComments] = useState(null);

    useEffect(() => {
        if (teamname && studentid) {
            const mockData = [
                {
                    evaluator: "Evaluator 1",
                    ratings: {
                        cooperation: 4,
                        conceptual: 3,
                        practical: 5,
                        workEthic: 4,
                    },
                    comments: {
                        cooperation: "Good teamwork",
                        conceptual: "Understands concepts well",
                        practical: "Great hands-on skills",
                        workEthic: "Very dedicated",
                    },
                },
                {
                    evaluator: "Evaluator 2",
                    ratings: {
                        cooperation: 5,
                        conceptual: 4,
                        practical: 4,
                        workEthic: 5,
                    },
                    comments: {
                        cooperation: "Excellent collaborator",
                        conceptual: "Strong grasp of concepts",
                        practical: "Good practical work",
                        workEthic: "Reliable and diligent",
                    },
                },
                {
                    evaluator: "Evaluator 3",
                    ratings: {
                        cooperation: 3,
                        conceptual: 4,
                        practical: 3,
                        workEthic: 4,
                    },
                    comments: {
                        cooperation: "Works well with others",
                        conceptual: "Good understanding",
                        practical: "Solid practical skills",
                        workEthic: "Consistent and hardworking",
                    },
                },
            ];

            setStudentRatings(mockData);
        }
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
                                {studentRatings.map((rating, index) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Display selected evaluator's comments */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-500 mb-4">Comments:</h3>
                    {selectedEvaluatorComments ? (
                        Object.entries(selectedEvaluatorComments).map(([field, comment]) => (
                            <p key={field} className="mb-2 text-gray-700">
                                <strong>{field}:</strong> {comment}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-600">Click an evaluator to see their comments</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;
