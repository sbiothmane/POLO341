import { users, updateUsersArray } from './users';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;
        const user = users.find((user) => user.username === username);
        user["password"] = undefined;
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
}