const rateLimit = require("express-rate-limit");

// 🔹 User Rate Limit (30 requests per 10 minutes)
const userLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 30, // Limit each IP to 30 requests per window
	message: " Too many requests, please try again later.",
});

// 🔹 Admin Rate Limit (100 requests per 10 minutes)
const adminLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // Limit each IP to 100 requests per window
	message: " Too many requests, please try again later.",
});

module.exports = { userLimiter, adminLimiter };
