const mongoose = require("mongoose");
const Counter = require("./Counter");

const EmployeeSchema = new mongoose.Schema({
	serialNo: { type: Number, unique: true }, // No longer required
	employeeId: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	age: { type: Number, required: true },
	role: { type: String, required: true },
	contact: { type: String, default: "" },
	profile: { type: String, default: "" },
	createdAt: { type: Date, default: Date.now },
});

EmployeeSchema.pre("save", async function (next) {
	if (!this.isNew) return next();

	try {
		this.serialNo = await Counter.getNextSequence("employeeSerial");
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model("Employee", EmployeeSchema);
