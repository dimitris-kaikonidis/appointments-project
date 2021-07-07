import { withIronSession } from "next-iron-session";
import { addBusiness } from "../../db/index";
import { genHash } from "../../utils/bcrypt";
const SESSION_SECRET = process.env.SESSION_SECRET;

async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { name, email, phone, password } = req.body;
            if (!name || !email || !phone || !password)
                throw new Error("Invalid");
            const hashedPassword = await genHash(password);
            const response = await addBusiness(
                name,
                email,
                phone,
                hashedPassword
            );
            const { id } = response.rows[0];
            req.session.set("user", { id, name, email, phone });
            await req.session.save();
            res.status(200).json({ id });
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
