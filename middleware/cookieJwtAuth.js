const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, next) => {
	if (!req.headers.cookie) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const token = req.headers.cookie.split("=")[1];

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.clearCookie("token");
			return res.status(401).json({ error: "Unauthorized" });
		}

		req.user = decoded;
		next();
	});
};
