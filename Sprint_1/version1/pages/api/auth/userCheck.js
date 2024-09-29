import fs from 'fs';
import path from 'path';
import users from '../users/users';

export default async function handler(req, res) {
  console.log(users);
  if (req.method === 'POST') {
    const { username } = req.body;

    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'users.csv');
    
    try {
      // Searching for the CSV file 
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        
        // Spliting csv file's data into rows (While making sure empty lines aren't included)
        const rows = data.split('\n').filter(row => row.trim() !== '');
        
        // Checking username existence along each row of the csv file    
        const usernameTaken = rows.some(row => {
          const [existingUsername] = row.split(',').map(item => item.trim()); // Trimmming extra spaces
          return existingUsername.toLowerCase() === username.toLowerCase();   // Case-insensitive comparison, ensuring capital letters do not register as different user
        });
        
        if (usernameTaken) {
          return res.status(200).json({ available: false });
        } else {
          return res.status(200).json({ available: true });
        }
      } else {
        // If such username doesn't exist within database then all usernames are available
        return res.status(200).json({ available: true });
      }
    } catch (error) {
      console.error('Error reading CSV file:', error); // Log full error stack for debugging
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
