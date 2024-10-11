import { db } from '../../../lib/firebase'; // Assuming your firebase config is set up correctly
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Get the teams collection reference
      const teamsCollection = collection(db, 'teams');
      let teamsSnapshot;

      // Check if the instructor query is present
      if (req.query.instructor) {
        const instructor = req.query.instructor;

        // Query for teams by instructor
        const q = query(teamsCollection, where('instructor', '==', instructor));
        teamsSnapshot = await getDocs(q);
      } else {
        // If no instructor query, get all teams
        teamsSnapshot = await getDocs(teamsCollection);
      }

      // Map through the teams to format them properly
      const teams = teamsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

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
