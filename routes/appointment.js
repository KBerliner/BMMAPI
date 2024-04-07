const express = require("express");
const router = express.Router();

const apptCtrl = require("../controllers/appointment.js");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth.js");

// Routing Endpoints
router.get("/", cookieJwtAuth, apptCtrl.allAppointments);
router.post("/", cookieJwtAuth, apptCtrl.addAppointment);

module.exports = router;
