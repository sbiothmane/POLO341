'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Signout from '../components/Signout';
import TeamBox from '../components/TeamBox';

export default function UserProfile() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        try {
          const username = session.user.name;

          const response = await fetch(`/api/users/userInfo/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });

          if (!response.ok) throw new Error("Failed to fetch user info");

          const data = await response.json();
          setUser(data);

          if (data.role === "instructor") {
            const res = await fetch(`/api/teams/teamsInfo?instructor=${session.user.name}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error("Failed to fetch team info");

            const teamsData = await res.json();
            setTeams(teamsData);
          }
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [session]);

  if (!session) {
    return <p className="text-red-500 text-center mt-8">You are not signed in.</p>;
  }

  if (loading) {
    return <p className="text-blue-500 text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-800">Welcome, {user.name}</h1>
          <p className="text-xl text-gray-600">ID: {user.id}</p>
          <p className="text-xl text-gray-600">Role: {user.role}</p>
        </div>

        {user.role === "instructor" && teams ? (
          <TeamBox teams={teams} />
        ) : (
          <p className="text-center text-gray-600">You do not have access to team data.</p>
        )}

        <div className="mt-10 flex justify-center">
          <Signout />
        </div>
      </div>
    );
  }

  return <p className="text-red-500 text-center mt-8">No user data found.</p>;
}
