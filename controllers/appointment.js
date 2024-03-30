const Appointment = require("../models/appointment.js");
const db = require("../config/database.js");

// Retrieve one appointment

exports.getAppointment = (req, res) => {
	db.query("SELECT * FROM appointments WHERE appointment_id = $1", [
		req.params.id,
	])
		.then((appointment) => {
			res.status(200).json(appointment.rows);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Retrieve all appointments

exports.allAppointments = (req, res) => {
	db.query("SELECT * FROM appointments")
		.then((appointments) => {
			res.status(200).json(appointments.rows);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Add a new appointment

exports.addAppointment = (req, res) => {
	// First check if the appointment already exists
	db.query("SELECT * FROM appointments WHERE appointment_date = $1", [
		req.body.appointment_date,
	])
		.then((appointment) => {
			if (appointment.rowCount > 0) {
				res.status(403).json({ error: "Appointment time slot is unavailable" });
				return Promise.reject("Appointment exists");
			}

			// If the appointment doesn't exist, create it
			const sql =
				"INSERT INTO appointments (customer_name, customer_email, customer_phone, appointment_date, appointment_time, appointment_location, appointment_description, appointment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
			const {
				customer_name,
				customer_email,
				customer_phone,
				appointment_date,
				appointment_time,
				appointment_location,
				appointment_description,
			} = req.body;

			const newAppointment = new Appointment({
				customer_name,
				customer_email,
				customer_phone,
				appointment_date,
				appointment_time,
				appointment_location,
				appointment_description,
			});

			const values = [
				newAppointment.customer_name,
				newAppointment.customer_email,
				newAppointment.customer_phone,
				newAppointment.appointment_date,
				newAppointment.appointment_time,
				newAppointment.appointment_location,
				newAppointment.appointment_description,
				newAppointment.id,
			];
			return db.query(sql, values);
		})
		.then(() => {
			res.status(201).json(req.body);
		})
		.catch((err) => {
			if (err !== "Appointment exists") {
				if (err.code === "23502") {
					res.status(500).json({ error: "Not all the fields were filled out" });
				} else {
					res.status(500).json(err);
				}
			}
		});
};
