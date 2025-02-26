const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
require("dotenv").config();

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate JWT Token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.json({ message: "Login successful!", token });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

// Register Route (for testing purposes)
router.post("/register", async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		// Prevent duplicate users
		if (await User.findOne({ email })) {
			return res.status(400).json({ error: "Email already exists" });
		}

		const newUser = new User({ username, email, password, role });
		await newUser.save();

		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
