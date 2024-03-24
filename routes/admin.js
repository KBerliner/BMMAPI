const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config.js");

const adminCtrl = require("../controllers/admin.js");

// Routing Endpoints

router.get("/", adminCtrl.allAdmins);
router.get("/:id", adminCtrl.getAdmin);
router.post("/", multer, adminCtrl.addAdmin);

module.exports = router;
