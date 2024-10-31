import { db } from '../../../lib/firebase'; // Firebase config
import { collection, addDoc, Timestamp, doc, getDocs, query, where } from 'firebase/firestore'; // Firestore methods

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    const { evaluator, team, student, ratings, comments } = req.body;

    // Validate the request body
    if (!evaluator || !team || !student || !ratings || !comments) {
        return res.status(400).json({
            message: 'Evaluator, team, student, ratings, and comments are required.',
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

        // Step 2: Reference to the evaluator and rated student in the users collection
        const evaluatorRef = doc(db, 'users', evaluator); // Assuming evaluator is the email/ID
        const studentRef = doc(db, 'users', student);     // Assuming student is the username/ID

        // Step 3: Reference to the team's ratings subcollection using the team document ID
        const ratingsCollection = collection(db, 'teams', teamId, 'ratings');

        // Step 4: Create a new rating document in Firestore
        const ratingDoc = await addDoc(ratingsCollection, {
            evaluator: evaluatorRef, // Store evaluator as a reference
            ratedStudent: studentRef, // Store rated student as a reference
            ratings: {
                conceptualContribution: ratings.conceptualContribution,
                practicalContribution: ratings.practicalContribution,
                workEthic: ratings.workEthic,
            },
            comments: {
                conceptualContribution: comments.conceptualContribution,
                practicalContribution: comments.practicalContribution,
                workEthic: comments.workEthic,
            },
            timestamp: Timestamp.now(), // Add a timestamp for when the rating was created
        });

        // Step 5: Send a success response
        res.status(201).json({
            message: 'Rating submitted successfully',
            ratingId: ratingDoc.id,
        });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}
