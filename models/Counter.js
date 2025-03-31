const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 },
});

CounterSchema.statics.getNextSequence = async function (name) {
	const result = await this.findByIdAndUpdate(
		name,
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true }
	);
	return result.seq;
};

module.exports = mongoose.model("Counter", CounterSchema);
