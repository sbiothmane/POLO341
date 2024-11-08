'use client';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { FaIdBadge, FaUserTie } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import TeamBox from '../components/TeamBox';
import Loading from '../components/Loading';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Loading/>;
  }

  if (status === 'unauthenticated') {
    return <p className="text-red-500 text-center mt-8">You are not signed in.</p>;
  }

  if (session) {
    const id = session.user.id;
    const name = session.user.name;
    const role = session.user.role;
    const username = session.user.username;
    console.log(session.user);
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        {/* Main Content */}
        <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-10">
            <div className="md:flex md:items-center md:justify-between">
              {/* Left: Welcome Text and User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {name}</h1>
                <div className="mt-4 text-gray-600">
                  <div className="flex items-center mb-2">
                    <FaIdBadge className="text-gray-500 mr-2" />
                    <span className="font-medium">ID:</span> {id}
                  </div>
                  <div className="flex items-center">
                    <FaUserTie className="text-gray-500 mr-2" />
                    <span className="font-medium">Role:</span> {role}
                  </div>
                </div>
              </div>
                 {role === "instructor" && (
                <div className="mt-6 md:mt-0">
                  <Link href="/create_time">
                    <div className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                      Create office hours
                    </div>
                  </Link>
                </div>
              )}
              {role === "instructor" && (
                <div className="mt-6 md:mt-0">
                  <Link href="/create_poll">
                    <div className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                      Create Polls
                    </div>
                  </Link>
                </div>
              )}

              {/* Right: Create Team Button */}
              {role === "instructor" && (
                <div className="mt-6 md:mt-0">
                  <Link href="/create_teams">
                    <div className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                      Create Team
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Teams Section */}
          <div className="space-y-10">
            {/* Instructor's Teams */}
            {role === "instructor" && (
            <div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4"></h2>
                <TeamBox instructor={username} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4"></h2>
                < TeamBox />
              </div>
          </div>
            )}
            {role === "student" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4"></h2>
                <TeamBox student={username} />
              </div>
            )}
           

            
          </div>
        </main>
      </div>
    );
  }

  return <p className="text-red-500 text-center mt-8">No user data found.</p>;
}
