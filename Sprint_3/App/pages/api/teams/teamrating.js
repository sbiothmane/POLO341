// FILE: teamrating.js

import { db } from '../../../lib/firebase'; // Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore methods

export async function getTeamRatings(teamName) {
    try {
        // Step 1: Find the team document by name
        const teamsCollection = collection(db, 'teams');
        const teamQuery = query(teamsCollection, where('name', '==', teamName));
        const teamSnapshot = await getDocs(teamQuery);

        if (teamSnapshot.empty) {
            throw new Error('Team not found');
        }

        // Assuming there's only one team with that name
        const teamDoc = teamSnapshot.docs[0]; // Get the first matching team document
        const teamId = teamDoc.id; // Get the team's document ID

        // Step 2: Reference to the team's ratings subcollection using the team document ID
        const ratingsCollection = collection(db, 'teams', teamId, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollection);

        // Step 3: Map the ratings data to the desired format
        const ratings = ratingsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: `${data.firstName} ${data.lastName}`,
                ratings: {
                    cooperation: data.cooperation,
                    conceptual: data.conceptual,
                    practical: data.practical,
                    workEthic: data.workEthic,
                },
                peersResponded: data.peersResponded,
                comments: data.comments,
            };
        });

        // Print the ratings information to the console
        console.log('Fetched team ratings:', ratings);

        return ratings;
    } catch (error) {
        console.error('Error retrieving team ratings:', error);
        return [];
    }
}