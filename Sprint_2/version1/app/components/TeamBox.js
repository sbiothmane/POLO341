import { useSession } from "next-auth/react";
import Team from './Team';

export default function TeamBox({ teams }) {
  // Flatten the teams into a single array with instructor data included
  const { data: session } = useSession();
  let instructor = "TA"
  if (session){
    instructor = session.user.name
  }

  return (
    <div className="p-6 bg-gray-50 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">My Teams</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {teams.map((team, index) => (
          <Team key={index} team={team} instructor={instructor} />
        ))}
      </div>
    </div>
  );
}
