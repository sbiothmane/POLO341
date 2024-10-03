import { FaChalkboardTeacher, FaUser } from 'react-icons/fa';

export default function Team({ team, instructor }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <FaChalkboardTeacher className="mr-2 text-blue-500" />
          {team.team}
        </h1>
        <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-lg">
          Instructor: {instructor}
        </span>
      </div>
      <div>
        <ul className="text-gray-600 flex space-x-4">
          {team.students.map((student) => (
            <li key={student} className="flex items-center space-x-2">
              <FaUser className="text-gray-500" />
              <span className="text-sm">{student}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
