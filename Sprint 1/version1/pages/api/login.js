import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

// Declare an array to hold users
let users = [];

// Function to update users array by reading and parsing CSV
async function updateUsersArray() {
  return new Promise((resolve, reject) => {
    const tempUsers = []; // Temporary array to store users during parsing

    // Define the path to the CSV file
    const filePath = path.join(process.cwd(), 'data/users.csv');

    // Read the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Push each row (user) into the tempUsers array
        tempUsers.push({
          username: row.username,
          password: row.password,
        });
      })
      .on('end', () => {
        // Update the global users array once parsing is complete
        users = tempUsers;
        console.log('CSV file successfully processed');
        console.log(users); // Log updated users array
        resolve(users); // Resolve the promise with the updated users array
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err); // Reject the promise on error
      });
  });
}

// Example usage of the updateUsersArray function
(async () => {
  try {
    await updateUsersArray(); // Await the CSV parsing
    // Users array has been updated; now you can use it
    console.log('Users array has been updated');
  } catch (error) {
    console.error('Error updating users array:', error);
  }
})();
// API route to handle login
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { username, password } = req.body;
  ;
  // Use cached users data
  
  const user = users.find((user) => user.username === username && user.password === password);
  

  if (user) {
    // Create session ID logic here
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}