import { db } from '../../../lib/firebase'; // Firebase config
import { collection, addDoc, doc } from 'firebase/firestore'; // Firestore methods

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
        // Step 1: Convert the students array to references using the usernames as document IDs
        const studentRefs = students.map(username => doc(db, 'users', username)); // Directly reference users by document ID (username)

        // Step 2: Reference to the teams collection in Firestore
        const teamsCollection = collection(db, 'teams');
        
        // Step 3: Create a new team document in Firestore with student references
        const teamDoc = await addDoc(teamsCollection, {
            name: teamName,
            instructor: instructor, // Store instructor's username
            students: studentRefs,  // Array of student document references
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
