const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ADMIN_EMAILS = [
	"anjalikashyap9608@gmail.com",
	"anjali.official7061@gmail.com",
];

exports.authenticate = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token)
			return res.status(401).json({ error: "Authentication required" });

		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		req.user = {
			email: payload.email,
			role: ADMIN_EMAILS.includes(payload.email) ? "admin" : "user",
		};
		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid token" });
	}
};

exports.authorizeAdmin = (req, res, next) => {
	if (req.user?.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}
	next();
};
