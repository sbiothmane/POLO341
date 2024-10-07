import fs from 'fs';
import path from 'path';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { teamsByInstructor, updateTeamsArray, addTeam } from '../teams/teams.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, students, username } = req.body;

    const csvFilePath = path.join(process.cwd(), 'data', 'teams.csv');

    try {
      if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, 'team,instructor,students\n');
      }

      const fileContent = fs.readFileSync(csvFilePath, 'utf8');
      const lines = fileContent.trim().split('\n').slice(1);

      const existingUsernames = new Set();

      lines.forEach(line => {
        const [teamName, instructorUsername, teamMembers] = line.split(',');
        if (instructorUsername === username) {
          const members = teamMembers.split(':');
          members.forEach(member => existingUsernames.add(member.trim()));
        }
      });

      const newStudents = students.split(':');

      const duplicates = newStudents.filter(student => existingUsernames.has(student.trim()));

      if (duplicates.length > 0) {
        return res.status(400).json({ message: `The following usernames are already assigned: ${duplicates.join(', ')}` });
      }

      fs.appendFileSync(csvFilePath, `${name},${username},${students}\n`, 'utf8');
      console.log(`Team ${name} created with IDs: ${students} by user: ${username}`);
      addTeam(username, name, students);

      res.status(200).json({ message: 'Team created and IDs written to CSV successfully!' });
    } catch (error) {
      console.error('Error writing to CSV:', error);
      res.status(500).json({ message: 'Failed to write team IDs to CSV' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}