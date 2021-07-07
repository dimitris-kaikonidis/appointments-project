import { withIronSession } from "next-iron-session";
const SESSION_SECRET =
    process.env.SESSION_SECRET || require("../secrets.json").SESSION_SECRET;

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
