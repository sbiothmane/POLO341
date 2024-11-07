import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

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
                const evaluatorRef = data.evaluator;
                const evaluatorSnapshot = await getDoc(evaluatorRef);
                const evaluatorName = evaluatorSnapshot.exists() ? evaluatorSnapshot.data().username : 'Unknown';

                // Resolve ratedStudent reference to get the student's details
                const ratedStudentRef = data.ratedStudent;
                const ratedStudentSnapshot = await getDoc(ratedStudentRef);
                let ratedStudentId = 'Unknown';
                let ratedStudentName = 'Unknown';

                if (ratedStudentSnapshot.exists()) {
                    const studentData = ratedStudentSnapshot.data();
                    ratedStudentId = studentData.id;  // This is the student ID you want to display
                    ratedStudentName = studentData.username; // Get the username
                }

                // Step 4: Format comments as an array
                const comments = [
                    {
                        type: 'Conceptual Contribution',
                        comment: data.comments?.conceptualContribution || 'No comment provided',
                    },
                    {
                        type: 'Practical Contribution',
                        comment: data.comments?.practicalContribution || 'No comment provided',
                    },
                    {
                        type: 'Work Ethic',
                        comment: data.comments?.workEthic || 'No comment provided',
                    },
                ];

                return {
                    id: ratingDoc.id,
                    studentId: ratedStudentId, // Student ID to display in the table
                    ratedStudent: ratedStudentName,
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
