import { findBusinesses } from "../../db/index";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const searchResult = await findBusinesses(req.query.q);
            res.json({ result: searchResult.rows });
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
    }
}