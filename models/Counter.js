const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to increment and get the next sequence number
Counter.getNextSequence = async function (name) {
	const counter = await Counter.findOneAndUpdate(
		{ name: name },
		{ $inc: { sequence_value: 1 } },
		{ new: true, upsert: true } // If not found, create a new counter
	);
	return counter.sequence_value;
};

module.exports = Counter;
