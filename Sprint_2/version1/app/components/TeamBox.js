'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Team from './Team';
import Loading from './Loading';

export default function TeamBox({ instructor }) {
  const { data: session } = useSession();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log(instructor);  
        const url = instructor 
          ? `/api/teams/teamsInfo?instructor=${instructor}`
          : '/api/teams/teamsInfo';
        
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch team data');

        const data = await response.json();
        setTeams(data);  // Set the teams data, empty array if no teams found
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [instructor]);

  if (loading) {
    return <Loading/>;
  }

  // Display message if there are no teams (friendly UI message instead of an error)
  if (teams.length === 0) {
    return (
      <div className="p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
          {instructor ? "My Teams" : "All Teams"}
        </h1>
        <p className="text-gray-500 text-center">
          {instructor ? "You have not created any teams yet." : "No teams available at the moment."}
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        {instructor ? "My Teams" : "All Teams"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {teams.map((team, index) => (
          <Team key={index} team={team} instructor={team.instructor} />
        ))}
      </div>
    </div>
  );
}
