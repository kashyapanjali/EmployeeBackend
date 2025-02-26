const jwt = require("jsonwebtoken");

// 🔹 Verify JWT Token
const verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token)
		return res
			.status(403)
			.json({ message: "Access Denied, No Token Provided" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach user info to request
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid Token" });
	}
};

// 🔹 Admin-Only Access Middleware
const isAdmin = (req, res, next) => {
	if (req.user.role !== "admin")
		return res.status(403).json({ message: "Access Denied, Admins Only" });
	next();
};

module.exports = { verifyToken, isAdmin };
