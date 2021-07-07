import { withIronSession } from "next-iron-session";
import { findBusiness } from "../../db/index";
import { compare } from "../../utils/bcrypt";
const SESSION_SECRET = process.env.SESSION_SECRET;

async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;
        try {
            const user = await findBusiness(email);
            const pass = await compare(password, user.rows[0].password_hash);
            if (!pass) throw new Error("Wrong password.");
            else {
                const { id, name, email, phone } = user.rows[0];
                req.session.set("user", { id, name, email, phone });
                await req.session.save();
                res.status(200).json();
            }
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
