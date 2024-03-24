// Installing dependencies

const mongoose = require("mongoose");

// Creating schema

const appointmentSchema = new mongoose.Schema({
	customer_name: { type: String, required: true },
	customer_email: { type: String, required: true },
	customer_phone: { type: String, required: true },
	appointment_date: { type: Date, required: true },
	appointment_time: { type: String, required: true },
	appointment_location: { type: String, required: true },
	appointment_description: { type: String, required: true },
});

// Exporting schema

module.exports = mongoose.model("Appointment", appointmentSchema);
