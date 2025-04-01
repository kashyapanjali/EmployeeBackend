const express = require("express");
const Employee = require("../models/EmployeeSchema");
const mongoose = require("mongoose");

const router = express.Router();

//Add Employee
router.post("/", async (req, res) => {
	try {
		const {
			serialNo,
			userId,
			firstName,
			lastName,
			age,
			role,
			contact,
			profile,
		} = req.body;

		// Check if user already exists
		const existingEmployee = await Employee.findOne({ userId });
		if (existingEmployee) {
			return res.status(400).json({ error: "User already exists!" });
		}

		// Create new employee document
		const userDetails = new Employee({
			serialNo,
			userId,
			firstName,
			lastName,
			age,
			role,
			contact,
			profile,
		});
		const savedDetails = await userDetails.save();
		res.status(201).json({
			message: "User Details Saved!",
			userDetails: savedDetails,
		});
	} catch (error) {
		// Handle MongoDB Unique Constraint Error
		if (error.code === 11000) {
			return res.status(400).json({ error: "User already exists!" });
		}
		res.status(400).json({ error: error.message });
	}
});

// Update Employee by _id
router.put("/:id", async (req, res) => {
	try {
		const employeeId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(employeeId)) {
			return res.status(400).json({ error: "Invalid Employee ID format!" });
		}
		const updatedData = req.body;
		const updatedEmployee = await Employee.findByIdAndUpdate(
			employeeId,
			{ $set: updatedData },
			{ new: true, runValidators: true }
		);
		// If employee not found -database
		if (!updatedEmployee) {
			return res.status(404).json({ error: "Employee not found!" });
		}
		res.status(200).json({
			message: "Employee updated successfully!",
			updatedEmployee,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//find by id
router.get("/:id", async (req, res) => {
	try {
		const employeeId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(employeeId)) {
			return res.status(400).json({ error: "Invalid Employee ID format!" });
		}
		const getEmployee = await Employee.findById(employeeId);
		if (!getEmployee) {
			return res.status(404).json({ error: "Employee not found!" });
		}
		res.status(200).json({
			message: "Employee find successfully!",
			getEmployee,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//delete by id
router.delete("/:id", async (req, res) => {
	try {
		const employeeId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(employeeId)) {
			return res.status(400).json({ error: "Invalid Employee ID format!" });
		}
		const deleteEmployee = await Employee.findByIdAndDelete(employeeId);
		if (!deleteEmployee) {
			return res.status(404).json({ error: "Employee not found!" });
		}
		res.status(200).json({
			message: "Employee delete successfully!",
			employeeId,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});
module.exports = router;
