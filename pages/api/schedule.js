import { setSchedule } from "../../db/index";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { start, finish, daysOff, id } = req.body;
        try {
            await setSchedule(start, finish, daysOff, id);
            res.status(200).json();
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
    }
}
