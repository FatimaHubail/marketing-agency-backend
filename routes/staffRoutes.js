const express = require("express");

const router = express.Router();

const isSignedIn = require("../middleware/isSignedIn");
const isStaff = require("../middleware/isStaff");

const staffCtrl = require("../controllers/staffCtrl");

router.get("/", isSignedIn, isStaff, staffCtrl.getStaff);

module.exports = router;