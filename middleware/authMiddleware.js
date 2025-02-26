const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Rate limiters
const userLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 30,
	message: { error: "Too many requests from user, please try again later." },
});

const adminLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: { error: "Too many requests from admin, please try again later." },
});

// Middleware: Verify JWT & Apply Rate Limiting
const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

		// Apply correct rate limiter based on role
		if (decoded.role === "admin") {
			return adminLimiter(req, res, next);
		} else {
			return userLimiter(req, res, next);
		}
	} catch (error) {
		return res.status(400).json({ error: "Invalid Token" });
	}
};

module.exports = authenticate;
