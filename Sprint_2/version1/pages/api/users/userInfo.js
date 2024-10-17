import { db } from '../../../lib/firebase'; // Assuming your Firestore setup is correct
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;

        try {
            // Reference to the users collection in Firestore
            const usersCollection = collection(db, 'users');
            
            // Query to find the user by username
            const q = query(usersCollection, where('username', '==', username));

            // Fetch the matching user document(s)
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // If no matching user found, return 404
                return res.status(404).json({ message: "User not found" });
            }

            // Get the first document (assuming username is unique)
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Create a user object with necessary fields
            const user = {
                id: userData.id,
                name: userData.name,
                role: userData.role,
                username: userData.username,
            };

            // Send the user data in the response
            res.status(200).json(user);

        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
