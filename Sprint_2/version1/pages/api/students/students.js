import fs from 'fs';
import path from 'path';
import {users} from '../users/users'



export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Construct the path to the CSV file
      const studentsData = users.map((user) => user.password = "");

      res.status(200).json(studentsData); // Return JSON response
    } catch (error) {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ error: 'Failed to read data' });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}