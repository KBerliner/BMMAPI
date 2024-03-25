const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config.js");
const moment = require("moment");

const adminCtrl = require("../controllers/admin.js");

// Routing Endpoints

router.get("/", adminCtrl.allAdmins);
router.get("/getAdmin/:id", adminCtrl.getAdmin);
router.post("/", multer, adminCtrl.addAdmin);
router.get("/login", adminCtrl.login);

module.exports = router;
