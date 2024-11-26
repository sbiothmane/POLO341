// pages/api/teams/rating.js

import { db } from '../../../lib/firebase'; // Firebase config
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'; // Firestore methods

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { evaluator, team, student } = req.query;

    // Validate the request
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

      const teamDoc = teamSnapshot.docs[0];
      const teamId = teamDoc.id;

      // Step 2: Reference to the team's ratings subcollection
      const ratingsCollection = collection(db, 'teams', teamId, 'ratings');

      // Step 3: Query to find an existing rating for this evaluator and student
      const evaluatorRef = doc(db, 'users', evaluator);
      const studentRef = doc(db, 'users', student);

      const ratingQuery = query(
        ratingsCollection,
        where('evaluator', '==', evaluatorRef),
        where('ratedStudent', '==', studentRef)
      );

      const querySnapshot = await getDocs(ratingQuery);

      if (!querySnapshot.empty) {
        // If a rating exists, return the rating data
        const existingRatingDoc = querySnapshot.docs[0];
        const existingRating = existingRatingDoc.data();
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
  } else if (req.method === 'POST') {
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

      const teamDoc = teamSnapshot.docs[0];
      const teamId = teamDoc.id;

      // Step 2: Reference to the team's ratings subcollection
      const ratingsCollection = collection(db, 'teams', teamId, 'ratings');

      // Step 3: Check if a rating already exists
      const evaluatorRef = doc(db, 'users', evaluator);
      const studentRef = doc(db, 'users', student);

      const ratingQuery = query(
        ratingsCollection,
        where('evaluator', '==', evaluatorRef),
        where('ratedStudent', '==', studentRef)
      );

      const querySnapshot = await getDocs(ratingQuery);

      if (!querySnapshot.empty) {
        // If rating exists, update it
        const ratingDoc = querySnapshot.docs[0];
        const ratingDocRef = ratingDoc.ref;

        await updateDoc(ratingDocRef, {
          ratings,
          comments,
          updatedAt: Timestamp.now(),
        });

        return res.status(200).json({
          message: 'Rating updated successfully',
          success: true,
        });
      } else {
        // No rating exists, create a new one
        await addDoc(ratingsCollection, {
          evaluator: evaluatorRef,
          ratedStudent: studentRef,
          ratings,
          comments,
          createdAt: Timestamp.now(),
        });

        return res.status(200).json({
          message: 'Rating submitted successfully',
          success: true,
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}