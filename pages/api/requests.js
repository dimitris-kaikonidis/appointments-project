import { getRequests, updateRequest } from "../../db/index";
import { sendEmail } from "../../utils/SES";
import { sendSMS } from "../../utils/SNS";
import randomstring from "randomstring";
import { myEmail } from "../../secrets.json";
import { withIronSession } from "next-iron-session";
import { SESSION_SECRET } from "../../secrets.json";

const email = process.env.myEmail || myEmail;

async function handler(req, res) {
    if (req.method === "GET") {
        const { name } = req.session.get("user");
        try {
            const response = await getRequests(name);
            res.status(200).json(response.rows);
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
    }

    if (req.method === "POST") {
        const { id, status } = req.body;
        try {
            if (status === "confirmed") {
                const verificationCode = randomstring.generate(5);
                updateRequest(id, status, verificationCode);
                sendEmail(
                    email,
                    "Verification Code",
                    `You booking is now confirmed. \nVerification Code: ${verificationCode}`
                );
                // sendSMS(verificationCode);
            }
            res.status(200).json();
        } catch (error) {
            console.log(error);
            res.status(400).json();
        }
    }
}

export default withIronSession(handler, {
    password: SESSION_SECRET,
    cookieName: "user",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});
