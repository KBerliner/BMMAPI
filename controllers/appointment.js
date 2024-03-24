const Appointment = require("../models/appointment.js");
const db = require("../config/database.js");

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
	console.log(req.body);
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

	console.log("SQL QUERY AND VALUES: ", sql, values);
	db.query(sql, values)
		.then(() => {
			res.status(201).json(newAppointment);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};
