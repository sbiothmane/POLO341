import { getFirestore, doc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { db } from '../../lib/firebase'; // Ensure your Firebase config is properly set up

// Helper function to generate random names
function generateFakeName() {
  const firstNames = ['John', 'Jane', 'Mike', 'Emily', 'Adam', 'Emma', 'Chris', 'Sophia', 'David', 'Olivia'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Garcia', 'Davis', 'Rodriguez', 'Martinez'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName}${lastName}`;
}

// Main function to create fake students
async function createFakeStudents(numStudents) {
  for (let i = 0; i < numStudents; i++) {
    const fakeName = generateFakeName();
    const fakePassword = `${fakeName}123`;
    const role = 'student';
    const id = Math.floor(Math.random() * 1000000); // Random unique ID
    const name = fakeName;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(fakePassword, 10);

      // Add the new student document to Firestore
      await setDoc(doc(db, 'users', fakeName), {
        username: fakeName,
        password: hashedPassword,
        role,
        id,
        name,
      });

      console.log(`Created fake student: ${fakeName}`);
    } catch (error) {
      console.error(`Error creating student ${fakeName}:`, error);
    }
  }

  console.log(`Successfully created ${numStudents} fake students.`);
}

export default { createFakeStudents };
