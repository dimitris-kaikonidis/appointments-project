import { updateRequest, deleteRequest } from "../../db/index";
import { sendEmail } from "../../utils/SES";
import { sendSMS } from "../../utils/SNS";
import randomstring from "randomstring";
import { withIronSession } from "next-iron-session";
const SESSION_SECRET = process.env.SESSION_SECRET;

async function handler(req, res) {
    if (req.method === "POST") {
        const { id, status } = req.body;
        try {
            if (status === "confirmed") {
                const verificationCode = randomstring.generate(5);
                updateRequest(id, status, verificationCode);
                sendEmail(
                    process.env.myEmail,
                    "Verification Code",
                    `You booking is now confirmed. \nVerification Code: ${verificationCode}`
                );
                // sendSMS(verificationCode);
            } else if (status === "rejected") {
                deleteRequest(id);
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
