// Installing dependencies
const http = require("http");
const express = require("express");
const app = express();
const client = require("./config/database");

const apptRoutes = require("./routes/appointment.js");

// Connecting to the database

client
	.connect()
	.then((res) => {
		console.log("Successfully connected to PostgreSQL!");
		// console.log(res);
	})
	.catch((error) => {
		console.log("unable to connect to PostgreSQL!");
		console.log(error);
	});

// Header Middleware

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	next();
});

app.use(express.json());

// API Request Routing

app.use("/api/appointments", apptRoutes);

// Assigning a port

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// Creating a server

const server = http.createServer(app);

// Error Handling

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

// Active Server Listening

server.listen(port);
