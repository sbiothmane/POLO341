'use client';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // CSV parser
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

// StudentTable component
const StudentTable = ({ students, onStudentClick, selectedStudents }) => {
  return (
    <div className="overflow-y-auto max-h-[400px] w-full">
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
  const [teamName, setTeamName] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false); 
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch default students from Firestore on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students/students'); // Update to the actual API route
        if (!response.ok) throw new Error("Failed to fetch students");
        
        const data = await response.json();
        setStudents(data); // Set students fetched from Firestore
      } catch (error) {
        console.error('Error fetching students:', error);
        setStatusMessage({ type: 'error', message: 'Failed to fetch students' });
      }
    };
    fetchStudents();
  }, []); // Empty array to run only on mount

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const formattedData = results.data.map((item) => ({
            username: item.username,
            name: item.fullname, // Assuming 'fullname' is used in CSV
            id: item.id,
          }));
          setStudents(formattedData);
          setIsFileUploaded(true); 
        },
        header: true, 
        skipEmptyLines: true, 
      });
    }
  };

  const handleStudentClick = (student) => {
    if (clickedStudents.some(s => s.id === student.id)) {
      setClickedStudents(clickedStudents.filter(s => s.id !== student.id)); 
    } else if (clickedStudents.length < 6) {
      setClickedStudents([...clickedStudents, student]);
    }
  };

  const handleCreateTeam = async () => {
    try {
      // Prepare the selected students' data
      const selectedStudentUsernames = clickedStudents.map(student => student.username);
      
      // Create the team object with instructor username, team name, and students
      const teamData = {
        instructor: session?.user?.username || 'defaultUser', // Assuming the session holds the instructor's username
        teamName,
        students: selectedStudentUsernames,
      };

      console.log("Sending team data:", teamData);

      // Send the selected students' data to the backend using POST
      const response = await fetch('/api/students/teamcreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData), // Send the team object
      });

      const result = await response.json();
      if (!response.ok) {
         // Get the response from the backend
        let message = result.message || 'Failed to create team';
        throw new Error(message);
      }

      setStatusMessage({ type: 'success', message: 'Team created successfully!' }); // Show success message

      // Redirect to the dashboard and force a page reload after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard'; // Redirect and refresh the dashboard
      }, 2000);
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message || 'Failed to create the team.' });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col space-y-8 w-full max-w-5xl">
        {/* File Upload Section */}
        <div className="w-full">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Import Student CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-md text-black"
          />
        </div>

        <div className="flex space-x-8 w-full">
          {/* Conditionally render Student Table after CSV upload */}
          {students.length > 0 && (
            <div className="w-3/5">
              <h2 className="text-xl font-bold text-center mb-4 text-gray-800">All Students</h2>
              <input
                type="text"
                className="w-full mb-4 px-4 py-2 border rounded-lg shadow-md text-black"
                placeholder="Search Students here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                className="w-full mb-4 px-4 py-2 border rounded-lg shadow-md text-black"
                placeholder="Write Team Name..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <StudentTable students={students.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))} onStudentClick={handleStudentClick} selectedStudents={clickedStudents} />
            </div>
          )}

          {/* Right Side: Clicked Students */}
          <div className="w-2/5">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Clicked Students</h2>
            
            {statusMessage && (
              <div className={`text-center mb-4 ${statusMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {statusMessage.message}
              </div>
            )}

            {(clickedStudents.length > 1 && teamName !== "") ? (
              <button
                onClick={handleCreateTeam}
                className="w-full mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              >
                Create Team
              </button>
            ) : (
              <p className="text-center text-gray-600">
                {clickedStudents.length < 2 && teamName === "" ? 
                  "Not enough students chosen and team name not written." :
                  (clickedStudents.length < 2 ? "Not enough students chosen." : "Team name not written.")
                }
              </p>
            )}
            {clickedStudents.length > 0 ? (
              <StudentTable students={clickedStudents} onStudentClick={handleStudentClick} selectedStudents={clickedStudents} />
            ) : (
              <p className="text-center text-gray-600">No students clicked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
