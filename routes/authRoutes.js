const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
const { userLimiter, adminLimiter } = require("../middleware/rateLimit");

const router = express.Router();

// 🔹 Register User
router.post("/register", userLimiter, async (req, res) => {
	try {
		const { email, username, password, role } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ message: " User already exists" });

		// Create new user
		const newUser = new User({ email, username, password, role });
		await newUser.save();

		res.status(201).json({ message: "User registered successfully", newUser });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// 🔹 Login User
router.post("/login", userLimiter, async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user
		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({ message: "Invalid email or password" });

		// Compare password
		const isMatch = await user.comparePassword(password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid email or password" });

		// Generate JWT Token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({ message: "Login successful", token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
