'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '../../../components/NavBar';
import Loading from '../../../components/Loading'; // Assuming you have a Loading component

const StudentDetailPage = () => {
    const { teamname, studentid } = useParams();
    const [studentRatings, setStudentRatings] = useState([]);
    const [selectedEvaluatorComments, setSelectedEvaluatorComments] = useState(null);

    useEffect(() => {
        // Fetch or filter data based on teamname and studentid once they are available
        if (teamname && studentid) {
            // Replace this with your actual data fetching logic
            
        }
    }, [teamname, studentid]);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Detailed View for Student {studentid} in Team: {teamname}</h1>
                
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
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-100 transition duration-150`}
                                    onClick={() => setSelectedEvaluatorComments(rating.comments)}
                                >
                                    <td className="py-4 px-6 text-center">{rating.evaluator}</td>
                                    <td className="py-4 px-6 text-center">{rating.ratings.cooperation}</td>
                                    <td className="py-4 px-6 text-center">{rating.ratings.conceptual}</td>
                                    <td className="py-4 px-6 text-center">{rating.ratings.practical}</td>
                                    <td className="py-4 px-6 text-center">{rating.ratings.workEthic}</td>
                                    <td className="py-4 px-6 text-center">{((rating.ratings.cooperation + rating.ratings.conceptual + rating.ratings.practical + rating.ratings.workEthic) / 4).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Display selected evaluator's comments */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-blue-500 mb-4">Comments:</h3>
                    {selectedEvaluatorComments ? (
                        Object.entries(selectedEvaluatorComments).map(([field, comment]) => (
                            <p key={field} className="mb-2 text-gray-700">
                                <strong>{field}:</strong> {comment}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-600">No comments available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;

