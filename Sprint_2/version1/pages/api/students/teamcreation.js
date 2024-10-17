import { db } from '../../../lib/firebase'; // Firebase config
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    const { instructor, teamName, students } = req.body;

    // Validate that the required fields are provided
    if (!instructor || !teamName || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({
            message: 'Instructor, team name, and an array of students are required',
        });
    }

    console.log('Creating team:', teamName, 'with instructor:', instructor, 'and students:', students);

    try {
        // Reference to the teams collection in Firestore
        const teamsCollection = collection(db, 'teams');
        
        // Create a new team document in Firestore
        const teamDoc = await addDoc(teamsCollection, {
            name: teamName,
            instructor: instructor, // Store instructor's username
            students: students, // Array of student usernames
        });

        // Send a success response with the team document ID
        res.status(201).json({
            message: 'Team created successfully',
            teamId: teamDoc.id,
        });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}
