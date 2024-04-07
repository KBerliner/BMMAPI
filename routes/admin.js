const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config.js");

const adminCtrl = require("../controllers/admin.js");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth.js");

// Routing Endpoints

router.get("/", cookieJwtAuth, adminCtrl.allAdmins);
router.get("/getAdmin/:id", cookieJwtAuth, adminCtrl.getAdmin);
router.post("/", multer, adminCtrl.addAdmin);
router.get("/login", adminCtrl.login);
router.get("/checkSession", cookieJwtAuth, adminCtrl.checkSession);

router.put("/deactivate/:id", cookieJwtAuth, adminCtrl.deactivateAdmin);
router.put("/activate/:id", cookieJwtAuth, adminCtrl.activateAdmin);

module.exports = router;
