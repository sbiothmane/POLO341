import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl transition-transform transform hover:scale-105 hover:shadow-xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Peer Assessment System</h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to the Peer Assessment System for university team projects. Our platform allows students to evaluate the contributions and performance of their teammates across four critical dimensions: cooperation, conceptual contribution, practical contribution, and work ethic.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          This system promotes accountability and provides valuable feedback to both students and instructors on team dynamics and individual efforts, ensuring a fair and transparent evaluation process.
        </p>

        {/* Updated Buttons */}
        <div className="space-y-4">
          <Link href="/login">
            <div className="block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
              Login
            </div>
          </Link>
          <Link href="/signup">
            <div className="block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
              Signup
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
