const express = require("express");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected Route (Test API)
router.get("/dashboard", authenticate, (req, res) => {
	res.json({ message: `Welcome ${req.user.role}, you have access!` });
});

module.exports = router;
