const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const Employee = require("../models/EmployeeSchema");

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

router.post("/", authenticate, authorizeAdmin, async (req, res) => {
	console.log("Request body:", req.body); // Log the incoming request data
	try {
		const existingEmployee = await Employee.findOne({
			employeeId: req.body.employeeId,
		});
		if (existingEmployee) {
			return res
				.status(400)
				.json({ success: false, error: "Employee ID already exists" });
		}

		const employee = new Employee(req.body);
		await employee.save();
		res.status(201).json({ success: true, data: employee });
	} catch (err) {
		console.error("Error creating employee:", err);
		res
			.status(500)
			.json({ success: false, error: err.message || "Server error" });
	}
});

// PUT update employee (Admin only)
router.put(
	"/:id",
	authenticate,
	authorizeAdmin,
	checkEmployeeExists,
	async (req, res) => {
		try {
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
