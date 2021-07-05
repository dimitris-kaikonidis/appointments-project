import { makeBooking } from "../../db/index";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { business_name, tel, email, name, date } = req.body;
        try {
            await makeBooking(business_name, tel, email, name, date);
            res.status(200).json();
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
    }
}
