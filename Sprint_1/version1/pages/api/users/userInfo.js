import { users, updateUsersArray } from './users';

export default async function handler(req, res) {
    updateUsersArray();
    if (req.method === 'POST') {
        const { username } = req.body;
        console.log("req " + req.body);
        console.log(users, username);
        const user = users.find((user) => user.username === username);
        user["password"] = undefined;
        console.log(user);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
}