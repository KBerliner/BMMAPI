require("dotenv").config();
const Client = require("pg").Pool;

const client = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
});

module.exports = client;
