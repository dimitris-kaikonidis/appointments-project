import { withIronSession } from "next-iron-session";
import { SESSION_SECRET } from "../../secrets.json";

function handler(req, res, session) {
    req.session.destroy();
    res.send();
}

export default withIronSession(handler, {
    password: SESSION_SECRET,
    cookieName: "user",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});