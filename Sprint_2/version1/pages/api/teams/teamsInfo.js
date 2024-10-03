import { teamsByInstructor, updateTeamsArray } from './teams.js';

export default async (req, res) => {
    if (Object.keys(teamsByInstructor).length === 0) {
        await updateTeamsArray();
    }

    if (req.method === 'GET') {
        if (req.query.instructor) {
            const instructor = req.query.instructor;
            if (teamsByInstructor[instructor]) {
                res.status(200).json(teamsByInstructor[instructor]);
            } else {
                res.status(404).end(`Instructor ${instructor} not found`);
            }
        } else {
            res.status(200).json(teamsByInstructor);
        }
    }
}