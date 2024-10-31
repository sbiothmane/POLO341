import { db } from '../../../lib/firebase'; // Assuming your firebase config is set up correctly
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Get the teams collection reference
      const teamsCollection = collection(db, 'teams');
      let teamsSnapshot;

      // Check if instructor or student query is present
      if (req.query.instructor) {
        const instructor = req.query.instructor;

        // Query for teams by instructor
        const q = query(teamsCollection, where('instructor', '==', instructor));
        teamsSnapshot = await getDocs(q);
      } else if (req.query.student) {
        const student = req.query.student;

        // Query for teams where the student is a part of the team
        const q = query(teamsCollection, where('students', 'array-contains', doc(db, 'users', student)));
        teamsSnapshot = await getDocs(q);
      } else {
        // If no instructor or student query, get all teams
        teamsSnapshot = await getDocs(teamsCollection);
      }

      // Helper function to fetch the username for each student reference
      const resolveStudentUsernames = async (studentRefs) => {
        const usernames = await Promise.all(
          studentRefs.map(async (studentRef) => {
            const studentDoc = await getDoc(studentRef); // Resolve the reference
            if (studentDoc.exists()) {
              return studentDoc.data().username; // Get the username
            }
            return null; // Handle case where the user document doesn't exist
          })
        );
        return usernames.filter(Boolean); // Filter out nulls in case some users don't exist
      };

      // Map through the teams to format them properly
      const teams = await Promise.all(
        teamsSnapshot.docs.map(async (doc) => {
          const teamData = doc.data();

          // Resolve student usernames from document references
          const studentUsernames = await resolveStudentUsernames(teamData.students);

          return {
            id: doc.id,
            instructor: teamData.instructor,
            name: teamData.name,
            students: studentUsernames, // Replace references with usernames
          };
        })
      );

      console.log('Fetched teams with usernames:', teams);

      // Respond with an empty array if no teams are found, otherwise return the teams
      res.status(200).json(teams.length > 0 ? teams : []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
