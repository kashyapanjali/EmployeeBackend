const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
	serialNo: { type: Number, required: true, unique: true },
	userId: { type: Number, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	age: { type: Number, required: true },
	role: { type: String, required: true },
	contact: { type: String, default: "" },
	profile: { type: String, default: "" },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
