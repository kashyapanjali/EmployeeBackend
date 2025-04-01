const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const Employee = require("../models/EmployeeSchema");
const upload = require("../middleware/upload"); // Import the upload middleware

// Middleware to check if employee exists
const checkEmployeeExists = async (req, res, next) => {
	try {
		const employee = await Employee.findById(req.params.id);
		if (!employee) {
			return res
				.status(404)
				.json({ success: false, error: "Employee not found" });
		}
		req.employee = employee;
		next();
	} catch (err) {
		res.status(500).json({ success: false, error: "Server error" });
	}
};

// GET all employees (Both admin and regular users)
router.get("/", authenticate, async (req, res) => {
	try {
		const employees = await Employee.find().sort({ serialNo: 1 });
		res.status(200).json({ success: true, data: employees });
	} catch (err) {
		res.status(500).json({ success: false, error: "Server error" });
	}
});

// GET single employee (Both admin and regular users)
router.get("/:id", authenticate, checkEmployeeExists, async (req, res) => {
	res.status(200).json({ success: true, data: req.employee });
});

router.post(
	"/",
	authenticate,
	authorizeAdmin,
	upload.single("profile"),
	async (req, res) => {
		try {
			const { employeeId, firstName, lastName, age, role, contact } = req.body;

			// Check if file was uploaded
			const profile = req.file ? `/uploads/${req.file.filename}` : "";

			const newEmployee = new Employee({
				employeeId,
				firstName,
				lastName,
				age,
				role,
				contact,
				profile: profile, // Save image path in database
			});

			await newEmployee.save();
			res.status(201).json({ success: true, data: newEmployee });
		} catch (err) {
			res
				.status(500)
				.json({ success: false, error: err.message || "Server error" });
		}
	}
);

// PUT update employee (Admin only)
router.put(
	"/:id",
	authenticate,
	authorizeAdmin,
	checkEmployeeExists,
	upload.single("profile"), // Use the multer middleware for handling image upload
	async (req, res) => {
		try {
			if (req.file) {
				req.body.profile = req.file.path; // Store the file path in profile field
			}
			const updatedEmployee = await Employee.findByIdAndUpdate(
				req.params.id,
				{
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					age: req.body.age,
					role: req.body.role,
					contact: req.body.contact,
					profile: req.body.profile,
				},
				{ new: true, runValidators: true }
			);
			res.status(200).json({ success: true, data: updatedEmployee });
		} catch (err) {
			if (err.name === "ValidationError") {
				const errors = Object.values(err.errors).map((val) => val.message);
				return res
					.status(400)
					.json({ success: false, error: errors.join(", ") });
			}
			res.status(500).json({ success: false, error: "Server error" });
		}
	}
);

// DELETE employee (Admin only)
router.delete(
	"/:id",
	authenticate,
	authorizeAdmin,
	checkEmployeeExists,
	async (req, res) => {
		try {
			await Employee.findByIdAndDelete(req.params.id);
			res.status(200).json({ success: true, data: {} });
		} catch (err) {
			res.status(500).json({ success: false, error: "Server error" });
		}
	}
);

module.exports = router;
