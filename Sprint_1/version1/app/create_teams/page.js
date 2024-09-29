'use client';
import React, { useState, useEffect } from 'react';

import path from 'path';

// StudentTable component
const StudentTable = ({ students, onStudentClick, selectedStudents }) => {
  return (
    <div className="overflow-y-auto max-h-[400px]">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Name</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {students.map((student, index) => (
            <tr
              key={index}
              onClick={() => onStudentClick(student)}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">{student.id}</td>
              <td className={`py-3 px-6 text-left ${selectedStudents.some(s => s.id === student.id) ? 'text-red-500' : ''}`}>
                {student.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [students, setStudents] = useState([]);
  const [clickedStudents, setClickedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudentsData = async () => {
    try {
      const response = await fetch('/api/students/students'); // Fetch from the API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const studentsData = await response.json(); // Parse the JSON response
      setStudents(studentsData); // Set the students state
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };

  useEffect(() => {
    fetchStudentsData(); // Fetch students data on component mount
  }, []);

  // Filter students based on the search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentClick = (student) => {
    // Limit the selected students to 6 and toggle their selection
    if (clickedStudents.some(s => s.id === student.id)) {
      setClickedStudents(clickedStudents.filter(s => s.id !== student.id)); // Remove if already clicked
    } else if (clickedStudents.length < 6) {
      setClickedStudents([...clickedStudents, student]); // Add if less than 6
    }
  };

  const handleCreateTeam = () => {
    // Placeholder for create team logic
    alert('Team created with selected students!');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex space-x-8 w-full max-w-5xl">
        {/* Left Side: All Students */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">All Students</h2>
          <input
            type="text"
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-md"
            placeholder="Search student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <StudentTable students={filteredStudents} onStudentClick={handleStudentClick} selectedStudents={clickedStudents} />
        </div>

        {/* Right Side: Clicked Students */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Clicked Students</h2>
          <button
            onClick={handleCreateTeam}
            className="w-full mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            Create Team
          </button>
          {clickedStudents.length > 0 ? (
            <StudentTable students={clickedStudents} onStudentClick={handleStudentClick} selectedStudents={clickedStudents} />
          ) : (
            <p className="text-center text-gray-600">No students clicked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;