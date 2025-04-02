const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const Employee = require("../models/EmployeeSchema");
const upload = require("../middleware/upload"); // Import Multer middleware
const fs = require("fs");
const path = require("path");

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

// GET all employees (Admin & Users)
router.get("/", authenticate, async (req, res) => {
	try {
		const employees = await Employee.find().sort({ serialNo: 1 });
		res.status(200).json({ success: true, data: employees });
	} catch (err) {
		res.status(500).json({ success: false, error: "Server error" });
	}
});

// GET single employee
router.get("/:id", authenticate, checkEmployeeExists, async (req, res) => {
	res.status(200).json({ success: true, data: req.employee });
});

// CREATE new employee (Admin only)
router.post(
	"/",
	authenticate,
	authorizeAdmin,
	upload.single("profile"),
	async (req, res) => {
		try {
			const { employeeId, firstName, lastName, age, role, contact } = req.body;

			// Check if file was uploaded
			const profile = req.file ? `/uploads/${req.file.filename}` : ""; // Ensure this is a relative path

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

// UPDATE employee (Admin only)
router.put(
	"/:id",
	authenticate,
	authorizeAdmin,
	checkEmployeeExists,
	upload.single("profile"),
	async (req, res) => {
		try {
			let updatedData = { ...req.body };

			// Handle profile image update
			if (req.file) {
				const newProfilePath = `/uploads/${req.file.filename}`;

				// Delete old profile image (if exists)
				if (req.employee.profile) {
					const oldImagePath = path.join(__dirname, "..", req.employee.profile);
					if (fs.existsSync(oldImagePath)) {
						fs.unlinkSync(oldImagePath);
					}
				}

				updatedData.profile = newProfilePath;
			}

			const updatedEmployee = await Employee.findByIdAndUpdate(
				req.params.id,
				updatedData,
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
			// Delete profile image (if exists)
			if (req.employee.profile) {
				const imagePath = path.join(__dirname, "..", req.employee.profile);
				if (fs.existsSync(imagePath)) {
					fs.unlinkSync(imagePath);
				}
			}

			await Employee.findByIdAndDelete(req.params.id);
			res
				.status(200)
				.json({ success: true, message: "Employee deleted successfully" });
		} catch (err) {
			res.status(500).json({ success: false, error: "Server error" });
		}
	}
);

module.exports = router;
