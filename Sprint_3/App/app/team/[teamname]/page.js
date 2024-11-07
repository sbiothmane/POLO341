'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { getTeamRatings } from '../../teamrating';

const TeamPage = ({ teamName }) => {
    const [teamRatings, setTeamRatings] = useState([]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const ratings = await getTeamRatings(teamName);
                setTeamRatings(ratings);
            } catch (error) {
                console.error('Error fetching team ratings:', error);
            }
        };

        fetchRatings();
    }, [teamName]);

    return (
        <div>
            <NavBar />
            <h1>Team: {teamName}</h1>
            <div>
                {teamRatings.map(student => (
                    <div key={student.id}>
                        <h2>{student.name}</h2>
                        <p>Cooperation: {student.ratings.cooperation}</p>
                        <p>Conceptual: {student.ratings.conceptual}</p>
                        <p>Practical: {student.ratings.practical}</p>
                        <p>Work Ethic: {student.ratings.workEthic}</p>
                        <p>Peers Responded: {student.peersResponded}</p>
                        <div>
                            <h3>Comments:</h3>
                            {student.comments.map((comment, index) => (
                                <p key={index}>{comment.peer}: {comment.comment}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
