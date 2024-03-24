// Instaling dependencies

const mongoose = require("mongoose");

// Creating schema

const adminSchema = mongoose.Schema({
	admin_name: { type: String, required: true },
	admin_username: { type: String, required: true },
	admin_email: { type: String, required: true },
	admin_phone_number: { type: String, required: true },
	admin_password: { type: String, required: true },
	admin_created_at: { type: Date, required: true },
	admin_updated_last: { type: Date, required: true },
	admin_last_login: { type: Date, required: true },
	admin_status: { type: Boolean, required: true },
	admin_pfp_url: { type: String },
});

// Exporting schema
module.exports = mongoose.model("Admin", adminSchema);
