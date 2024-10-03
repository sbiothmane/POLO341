import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

let teamsByInstructor = {};

async function updateTeamsArray() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(process.cwd(), 'data', 'teams.csv');

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const instructor = row.instructor;
                const team = row.team;
                const students = row.students.split(':').map((member) => member.trim());
                console.log(instructor, team, students);

                if (!teamsByInstructor[instructor]) {
                    teamsByInstructor[instructor] = [];
                }

                teamsByInstructor[instructor].push({
                    team: team,
                    students: students,
                });
            })
            .on('end', () => {
                resolve(teamsByInstructor);
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err);
                reject(err);
            });
    });
}

updateTeamsArray().then((result) => {
    console.log(result);
}).catch((error) => {
    console.error('Error:', error);
});


export { teamsByInstructor, updateTeamsArray };