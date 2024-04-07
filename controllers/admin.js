// Instaling dependencies
const Admin = require("../models/admin.js");
const db = require("../config/database.js");

const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AWS = require("../config/aws.js");

// Initialize S3 instance

const s3 = new AWS.S3();

// Check Session

exports.checkSession = (req, res) => {
	res.status(200).json();
};

// Retrieve one admin

exports.getAdmin = (req, res) => {
	db.query("SELECT * FROM admins WHERE admin_id = $1", [req.params.id])
		.then((admin) => {
			console.log(admin);
			res.status(200).json(admin.rows);
		})
		.catch((err) => {
			console.log(err);
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

	// Hashing the password

	bcrypt
		.hash(req.body.admin_password, 10)
		.then((hash) => {
			// Setting the Admin Model
			const newAdmin = new Admin({
				admin_name: req.body.admin_name,
				admin_username: req.body.admin_username,
				admin_email: req.body.admin_email,
				admin_phone_number: req.body.admin_phone_number,
				admin_password: hash,
				admin_created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
				admin_updated_last: moment().format("YYYY-MM-DD HH:mm:ss"),
				admin_last_login: moment().format("YYYY-MM-DD HH:mm:ss"),
				admin_status: req.body.admin_status,
			});

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

						db.query(sql, values)
							.then(() => {
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
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Login as Admin

exports.login = async (req, res) => {
	// Setting Variables
	const sql = "SELECT * FROM admins WHERE admin_username = $1";

	const values = [req.body.admin_username];

	// Querying the database

	db.query(sql, values)
		.then((admin) => {
			if (admin.rowCount > 0) {
				bcrypt
					.compare(req.body.admin_password, admin.rows[0].admin_password)
					.then((result) => {
						if (result) {
							// Checking if the admin is active
							if (admin.rows[0].admin_status === false) {
								return res.status(401).json({
									message: "Your account is not active",
								});
							}

							// Updating the last login time

							const updateLastLogin =
								"UPDATE admins SET admin_last_login = $1 WHERE admin_id = $2";
							const values = [
								moment().format("YYYY-MM-DD HH:mm:ss"),
								admin.rows[0].admin_id,
							];
							db.query(updateLastLogin, values).catch((err) => {
								console.log(err);
							});

							// Sign a JWT Token
							const token = jwt.sign(admin.rows[0], process.env.JWT_SECRET, {
								expiresIn: "15m",
							});

							res.cookie("token", token, {
								httpOnly: true,
								secure: true,
							});
							return res.status(200).json({
								message: "Admin logged in successfully",
								admin: admin.rows[0],
							});
						} else {
							res.status(401).json({
								message: "Incorrect password",
							});
						}
					});
			} else {
				res.status(401).json({
					message: "Incorrect username",
				});
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Deactivate Admin

exports.deactivateAdmin = (req, res) => {
	const sql = "UPDATE admins SET admin_status = $1 WHERE admin_id = $2";
	const values = [false, req.params.id];

	db.query(sql, values)
		.then(() => {
			res.status(200).json({
				message: "Admin deactivated successfully",
			});
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

// Activate Admin

exports.activateAdmin = (req, res) => {
	const sql = "UPDATE admins SET admin_status = $1 WHERE admin_id = $2";
	const values = [true, req.params.id];

	db.query(sql, values)
		.then(() => {
			res.status(200).json({
				message: "Admin activated successfully",
			});
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};
