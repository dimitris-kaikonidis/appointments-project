import { getBusinessInfo, getBookings } from "../../db/index";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const result = await getBusinessInfo(req.query.business);
            const result2 = await getBookings(req.query.business);
            res.status(200).json({
                info: result.rows[0],
                bookings: result2.rows,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
    }
}
