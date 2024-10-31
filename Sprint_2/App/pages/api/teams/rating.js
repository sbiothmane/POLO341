import { db } from '../../../lib/firebase'; // Firebase config
import { collection, query, where, getDocs, addDoc, doc, Timestamp } from 'firebase/firestore'; // Firestore methods

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { evaluator, team, student } = req.body;
        console.log('Request body:', req.body);
        // Validate the request body
        if (!evaluator || !team || !student) {
            return res.status(400).json({
                message: 'Evaluator, team, and student are required.',
            });
        }

        try {
            // Step 1: Find the team document by name
            const teamsCollection = collection(db, 'teams');
            const teamQuery = query(teamsCollection, where('name', '==', team));
            const teamSnapshot = await getDocs(teamQuery);

            if (teamSnapshot.empty) {
                return res.status(404).json({ message: 'Team not found' });
            }

            // Assuming there's only one team with that name
            const teamDoc = teamSnapshot.docs[0]; // Get the first matching team document
            const teamId = teamDoc.id; // Get the team's document ID

            // Step 2: Reference to the team's ratings subcollection using the team document ID
            const ratingsCollection = collection(db, 'teams', teamId, 'ratings');

            // Step 3: Query to find an existing rating for this evaluator and student
            const q = query(
                ratingsCollection,
                where('evaluator', '==', doc(db, 'users', evaluator)), // Assuming evaluator is a reference
                where('ratedStudent', '==', doc(db, 'users', student))  // Assuming ratedStudent is a reference
            );

            // Fetch the existing rating, if it exists
            const querySnapshot = await getDocs(q);
            console.log('Fetched rating:', querySnapshot.empty ? 'No' : 'Yes');
            if (!querySnapshot.empty) {
                // If a rating exists, return the rating data
                const existingRating = querySnapshot.docs[0].data();
                return res.status(200).json({
                    message: 'Rating found',
                    rating: existingRating,
                });
            } else {
                // No rating found, return an empty result
                return res.status(200).json({
                    message: 'No rating found',
                    rating: null,
                });
            }
        } catch (error) {
            console.error('Error fetching rating:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
