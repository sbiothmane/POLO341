'use client'
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Signout from '../components/Signout';

export default function UserProfile() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null); // To store fetched user data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        if (session) {
            const fetchUser = async () => {
                try {
                    const username = session.user.name;

                    // Make the fetch call
                    const response = await fetch(`/api/users/userInfo/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username: username }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch user info");
                    }

                    const data = await response.json(); // Parse the JSON response
                    setUser(data); // Store the user data in state
                    setLoading(false); // Stop loading
                } catch (err) {
                    setError(err.message);
                    setLoading(false); // Stop loading even on error
                }
            };

            fetchUser(); // Call the async function
        }
    }, [session]); // Runs whenever session changes

    if (!session) {
        return <p className="text-red-500">You are not signed in.</p>;
    }

    if (loading) {
        return <p className="text-blue-500"></p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.name}</h1>
                    <p className="text-lg text-gray-600 mb-2">Id: {user.id}</p>
                    <p className="text-lg text-gray-600 mb-6">Role: {user.role}</p>
                    <Signout />
                </div>
            </div>
        );
    }

    return <p className="text-red-500">No user data found.</p>;
}