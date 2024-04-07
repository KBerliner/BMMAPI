const bcrypt = require("bcrypt");
const Admin = require("./models/admin.js");

const examplePassword = "example-password";

bcrypt.hash(examplePassword, 10).then((hash) => {
	// Setting the Admin Model

	const newAdmin = new Admin({
		admin_name: "John Doe",
		admin_username: "johnDoe123",
		admin_email: "john.doe@example.com",
		admin_phone_number: "123-456-7890",
		admin_password: hash, // Remember to hash passwords in a real application
		admin_created_at: new Date(),
		admin_updated_last: new Date(),
		admin_last_login: new Date(),
		admin_status: true,
	});

	console.log(hash, newAdmin);
});
