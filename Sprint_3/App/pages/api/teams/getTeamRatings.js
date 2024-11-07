import { getTeamRatings } from './teamrating';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { teamName } = req.body;

        try {
            const ratings = await getTeamRatings(teamName);
            res.status(200).json({ ratings });
        } catch (error) {
            console.error('Error fetching team ratings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}