import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Construct the path to the CSV file
      const filePath = path.join(process.cwd(), 'data', 'users.csv');
      const data = fs.readFileSync(filePath, 'utf8'); // Read the CSV file

      // Split the text into lines
      const lines = data.trim().split('\n');

      // Extract the header and data, skipping empty lines
      const studentsData = lines.slice(1).map((line) => {
        const row = line.split(',').map(item => item.trim()); // Trim each item to remove excess whitespace
        // Check if the row has valid data
        if (row.length >= 4 && row[0] && row[1] && row[2] && row[3]&& row[4] === 'student') { // Check for non-empty values
          return {
            username: row[0], 
            //password: row[1],
            id: row[2],      
            name: row[3],     
          };
        }
        return null; // Return null for empty or invalid rows
      }).filter(Boolean); // Filter out null values

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