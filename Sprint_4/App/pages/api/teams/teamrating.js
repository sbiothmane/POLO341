import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, getDoc } from 'firebase/firestore';

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
        const teamDoc = teamSnapshot.docs[0];
        const teamId = teamDoc.id;

        // Step 2: Access the team's ratings subcollection using the team document ID
        const ratingsCollection = collection(db, 'teams', teamId, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollection);

        if (ratingsSnapshot.empty) {
            console.log('No ratings found in ratings subcollection.');
            return [];
        }

        // Step 3: Map the ratings data, resolving references for evaluator and ratedStudent
        const ratings = await Promise.all(
            ratingsSnapshot.docs.map(async (ratingDoc) => {
                const data = ratingDoc.data();

                // Resolve evaluator reference to get the evaluator's name
                const evaluatorSnapshot = await getDoc(data.evaluator);
                const evaluatorName = evaluatorSnapshot.exists() ? evaluatorSnapshot.data().username : 'Unknown';

                // Resolve ratedStudent reference to get the student's details
                const ratedStudentSnapshot = await getDoc(data.ratedStudent);
                let ratedStudentId = 'Unknown';
                let ratedStudentName = 'Unknown';

                if (ratedStudentSnapshot.exists()) {
                    const studentData = ratedStudentSnapshot.data();
                    ratedStudentId = studentData.id;  // This is the student ID you want to display
                    ratedStudentName = studentData.username; // Get the username
                }

                // Split ratedStudentName into first and last names
                const { firstName, lastName } = splitName(ratedStudentName);

                // Format comments
                const comments = [
                    { type: 'Cooperation', comment: data.comments?.cooperation || 'No comment provided' },
                    { type: 'Conceptual Contribution', comment: data.comments?.conceptualContribution || 'No comment provided' },
                    { type: 'Practical Contribution', comment: data.comments?.practicalContribution || 'No comment provided' },
                    { type: 'Work Ethic', comment: data.comments?.workEthic || 'No comment provided' },
                ];

                return {
                    id: ratingDoc.id,
                    evaluator: evaluatorName,
                    studentId: ratedStudentId,
                    lastName: lastName,
                    firstName: firstName,
                    ratings: {
                        cooperation: data.ratings.cooperation || 0,
                        conceptual: data.ratings.conceptualContribution || 0,
                        practical: data.ratings.practicalContribution || 0,
                        workEthic: data.ratings.workEthic || 0,
                    },
                    comments: comments, // Comments as an array
                    timestamp: data.timestamp ? data.timestamp.toDate().toLocaleString() : 'Unknown',
                };
            })
        );

        console.log('Formatted team ratings:', ratings);
        return ratings;
    } catch (error) {
        console.error('Error retrieving team ratings:', error);
        return [];
    }
}

// Helper function to split full name into first and last names
const splitName = (ratedStudentName) => {
    let firstName = 'Unknown';
    let lastName = 'Unknown';

    if (ratedStudentName) {
        const nameParts = ratedStudentName.split(' ');
        if (nameParts.length > 1) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
        } else {
            const match = ratedStudentName.match(/([A-Z][a-z]+)([A-Z][a-z]+)/);
            if (match) {
                firstName = match[1];
                lastName = match[2];
            } else {
                firstName = ratedStudentName;
            }
        }
    }

    return { firstName, lastName };
};

