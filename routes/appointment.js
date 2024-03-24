const express = require("express");
const router = express.Router();

const apptCtrl = require("../controllers/appointment.js");

// Routing Endpoints

router.get("/", apptCtrl.allAppointments);
router.post("/", apptCtrl.addAppointment);

module.exports = router;
