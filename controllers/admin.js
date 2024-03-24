// Instaling dependencies
const Admin = require("../models/admin.js");
const db = require("../config/database.js");

const AWS = require("../config/aws.js");

// Initialize S3 instance

const s3 = new AWS.S3();

// Retrieve one admin

exports.getAdmin = (req, res) => {
	db.query("SELECT * FROM admins WHERE admin_id = $1", [req.params.id])
		.then((admin) => {
			res.status(200).json(admin.rows);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Retrieve all admins

exports.allAdmins = (req, res) => {
	db.query("SELECT * FROM admins")
		.then((admins) => {
			res.status(200).json(admins.rows);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Add a new admin

exports.addAdmin = (req, res) => {
	// Setting Variables
	const MIME_TYPES = {
		"image/jpg": "jpg",
		"image/jpeg": "jpg",
		"image/png": "png",
	};

	const sql =
		"INSERT INTO admins (admin_name, admin_id, admin_username, admin_email, admin_phone_number, admin_password, admin_created_at, admin_updated_last, admin_last_login, admin_status, admin_pfp_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

	const newAdmin = new Admin({
		admin_name: req.body.admin_name,
		admin_username: req.body.admin_username,
		admin_email: req.body.admin_email,
		admin_phone_number: req.body.admin_phone_number,
		admin_password: req.body.admin_password,
		admin_created_at: req.body.admin_created_at,
		admin_updated_last: req.body.admin_updated_last,
		admin_last_login: req.body.admin_last_login,
		admin_status: req.body.admin_status,
	});

	console.log("new admin: ", newAdmin);

	const values = [
		newAdmin.admin_name,
		newAdmin.id,
		newAdmin.admin_username,
		newAdmin.admin_email,
		newAdmin.admin_phone_number,
		newAdmin.admin_password,
		newAdmin.admin_created_at,
		newAdmin.admin_updated_last,
		newAdmin.admin_last_login,
		newAdmin.admin_status,
	];

	// Seeing if there is a profile picture in the request body
	if (req.file) {
		const uploadParams = {
			Bucket: "bmmadminprofilepictures",
			Key: req.file.originalname,
			Body: req.file.buffer,
			ContentType: `image/${MIME_TYPES[req.file.mimetype]}`,
			ContentDisposition: "inline",
		};

		s3.upload(uploadParams, (err, data) => {
			if (err) {
				console.error("Error uploading file to S3", err);
				res.status(500).json({
					error: "Failed to upload profile picture to S3",
					message: err,
				});
			} else {
				console.log("Successfully uploaded file to S3", data);

				// Handling the rest of the request
				values.push(data.Location);

				console.log("Values: ", values);

				db.query(sql, values)
					.then((admin) => {
						res.status(201).json({
							message: "Admin added successfully",
						});
					})
					.catch((err) => {
						res.status(500).json(err);
					});
			}
		});
	} else {
		values.push(null);
		db.query(sql, values)
			.then((admin) => {
				res.status(201).json({
					message: "Admin added successfully",
				});
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
};

// Login as Admin

exports.login = (req, res) => {};
