// FILE: teamrating.js

const teamData = {
    teamName: 'Invincibles',
    students: [
        {
            id: '402XXXXX',
            lastName: 'Doe',
            firstName: 'John',
            cooperation: 6.4,
            conceptual: 6.4,
            practical: 6.8,
            workEthic: 6.6,
            peersResponded: 5,
            comments: [
                { peer: 'Student 2', comment: 'Great team player!' },
                { peer: 'Student 3', comment: '' },
            ],
        },
        {
            id: '402XXXXX2',
            lastName: 'Smith',
            firstName: 'Jane',
            cooperation: 4.2,
            conceptual: 5.1,
            practical: 3.8,
            workEthic: 4.5,
            peersResponded: 4,
            comments: [
                { peer: 'Student 1', comment: 'Needs improvement.' },
                { peer: 'Student 4', comment: 'Good effort.' },
            ],
        },
    ],
};

export function getTeamRatings(teamName) {
    if (teamData.teamName === teamName) {
        return teamData.students.map(student => ({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            ratings: {
                cooperation: student.cooperation,
                conceptual: student.conceptual,
                practical: student.practical,
                workEthic: student.workEthic,
            },
            peersResponded: student.peersResponded,
            comments: student.comments,
        }));
    } else {
        return [];
    }
}